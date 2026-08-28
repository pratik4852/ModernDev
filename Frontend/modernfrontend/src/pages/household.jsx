import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useCreateHouseholdMutation,
  useDeleteHouseholdMutation,
  useGetHouseholdQuery,
  useUpdateHouseholdMutation,
} from "../redux/baseapi";

const initialForm = {
  householdCode: "",
  state: "",
  district: "",
  allowedpoints: "",
  maxallowedpoints: "",
};

const Household = () => {
  const [formData, setFormData] = useState(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    data: householdResponse = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetHouseholdQuery();
  const [createHousehold, { isLoading: isCreating }] =
    useCreateHouseholdMutation();
  const [updateHousehold, { isLoading: isUpdating }] =
    useUpdateHouseholdMutation();
  const [deleteHousehold, { isLoading: isDeleting }] =
    useDeleteHouseholdMutation();

  const households = Array.isArray(householdResponse)
    ? householdResponse
    : Array.isArray(householdResponse?.data)
      ? householdResponse.data
      : [];

  const isSubmitting = isCreating || isUpdating;
  const errorMessage =
    error?.data?.message || error?.error || "Unable to load households.";

  const totalAllowedPoints = households.reduce(
    (sum, item) => sum + Number(item.allowedpoints || 0),
    0
  );
  const totalMaxAllowedPoints = households.reduce(
    (sum, item) => sum + Number(item.maxallowedpoints || 0),
    0
  );

  const stats = [
    { label: "Total households", value: households.length },
    { label: "Allowed points", value: totalAllowedPoints },
    { label: "Max allowed points", value: totalMaxAllowedPoints },
  ];

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      householdCode: item.householdCode || "",
      state: item.state || "",
      district: item.district || "",
      allowedpoints: item.allowedpoints || "",
      maxallowedpoints: item.maxallowedpoints || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateHousehold({ id: editingId, ...formData }).unwrap();
      } else {
        await createHousehold(formData).unwrap();
      }

      handleCloseModal();
      refetch();
    } catch (submitError) {
      console.error("Failed to save household:", submitError);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this household?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteHousehold(id).unwrap();
      refetch();
    } catch (deleteError) {
      console.error("Failed to delete household:", deleteError);
    }
  };

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
      </section>-------------------------

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Household management
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Household table
            </h3>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="self-start rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Add household
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Household Code",
                    "State",
                    "District",
                    "Allowed Points",
                    "Max Allowed Points",
                    "Actions",
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
                      Loading households...
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

                {!isLoading && !isError && households.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      No household records found.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError
                  ? households.map((item) => (
                      <tr key={item.id} className="border-t border-slate-200">
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          <Link
                            to={`/member?householdId=${item.id}`}
                            className="text-slate-950 underline-offset-4 transition hover:text-blue-600 hover:underline"
                          >
                            {item.householdCode}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.state}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.district}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.allowedpoints}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.maxallowedpoints}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                              aria-label={`Edit ${item.householdCode}`}
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              disabled={isDeleting}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label={`Delete ${item.householdCode}`}
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

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {editingId ? "Update household" : "Create household"}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  {editingId
                    ? "Edit household details"
                    : "Add household details"}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Close
              </button>
            </div>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="householdCode"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Household Code
                </label>
                <input
                  id="householdCode"
                  name="householdCode"
                  type="text"
                  value={formData.householdCode}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="district"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  District
                </label>
                <input
                  id="district"
                  name="district"
                  type="text"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="allowedpoints"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Allowed Points
                </label>
                <input
                  id="allowedpoints"
                  name="allowedpoints"
                  type="text"
                  value={formData.allowedpoints}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="maxallowedpoints"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Max Allowed Points
                </label>
                <input
                  id="maxallowedpoints"
                  name="maxallowedpoints"
                  type="text"
                  value={formData.maxallowedpoints}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Saving household..."
                    : editingId
                      ? "Update household"
                      : "Save household"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Household;
