import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetSurveysQuery,
  useLazyCreateSurveysQuery,
  useLazyUpdateSurveysQuery,
  useLazyDeleteSurveysQuery,
} from "../redux/baseapi";

import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const initialForm = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  audience: "",
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getAudienceTone = (audience) => {
  switch (audience) {
    case "admins":
      return "bg-amber-50 text-amber-700";
    case "users":
      return "bg-sky-50 text-sky-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

const Survey = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSurveysQuery();
  const surveyRows = response?.data || [];
  const [createSurvey] = useLazyCreateSurveysQuery();
  const [updateSurvey] = useLazyUpdateSurveysQuery();
  const [deleteSurvey] = useLazyDeleteSurveysQuery();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditId(null);
    setFormData(initialForm);
  };

  const handleCreate = async () => {
    await createSurvey(formData);

    refetch();
    closeForm();
  };

  const handleEdit = (row) => {
    setShowForm(true);
    setEditId(row.id);

    setFormData({
      title: row.title,
      description: row.description,
      start_date: row.start_date,
      end_date: row.end_date,
      audience: row.audience,
    });
  };

  const handleUpdate = async () => {
    await updateSurvey({
      id: editId,
      ...formData,
    });

    refetch();
    closeForm();
  };

  const handleDelete = async (id) => {
    await deleteSurvey(id);
    refetch();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData(initialForm);
  };

  const errorMessage =
    error?.data?.message || error?.error || "Unable to load surveys.";

  const stats = [
    { label: "Total surveys", value: surveyRows.length },
    {
      label: "Users",
      value: surveyRows.filter((item) => item.audience === "users").length,
    },
    {
      label: "Admins",
      value: surveyRows.filter((item) => item.audience === "admins").length,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-5 md:grid-cols-3">
        {stats.map((card) => (
          <article
            key={card.label}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {card.value}
            </p>
          </article>
        ))}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {editId ? "Update survey" : "Create survey"}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  {editId ? "Edit survey details" : "Add survey details"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="audience"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Audience
                </label>
                <select
                  id="audience"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                >
                  <option value="">Select audience</option>
                  <option value="users">Users</option>
                  <option value="admins">Admins</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="start_date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Start Date
                </label>
                <input
                  id="start_date"
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="end_date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  End Date
                </label>
                <input
                  id="end_date"
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                {editId ? (
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Update survey
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Save survey
                  </button>
                )}

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Survey Center
            </p>

            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Surveys table
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500">
              {surveyRows.length} records available
            </p>
            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
            >
              Create survey
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Title",
                    "Description",
                    "Start Date",
                    "End Date",
                    "Audience",
                    "Action",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-400"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      Loading surveys...
                    </td>
                  </tr>
                ) : null}

                {isError ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-sm text-rose-600"
                    >
                      {errorMessage}
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError && surveyRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      No surveys found.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError
                  ? surveyRows.map((row) => (
                      <tr key={row.id} className="border-t border-slate-200">
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          {row.title || "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {row.description || "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(row.start_date)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(row.end_date)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getAudienceTone(row.audience)}`}
                          >
                            {row.audience || "-"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/addsurvey/${row.id}`)}
                              className="rounded-2xl border border-emerald-200 px-3 py-2 text-emerald-600"
                            >
                              <PlusIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(row)}
                              className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(row.id)}
                              className="rounded-2xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Survey;
