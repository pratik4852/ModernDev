import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  useAddAudienceMutation,
  useDeleteAudienceMutation,
  useGetAudienceQuery,
  useGetUserQuery,
  useUpdateAudienceMutation,
} from "../redux/baseapi";

const initialForm = {
  audience: "",
  users: "",
  role: "",
  state: "",
  district: "",
  gender: "",
  ageRange: "",
};

const getUserDisplayValue = (value) => {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map(getUserDisplayValue).filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    return value.username || value.email || value.mobile || "";
  }

  return String(value);
};

const Audience = () => {
  const [formData, setFormData] = useState(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    data: audienceResponse = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAudienceQuery();
  const [addAudience, { isLoading: isCreating }] = useAddAudienceMutation();
  const [updateAudience, { isLoading: isUpdating }] =
    useUpdateAudienceMutation();
  const [deleteAudience, { isLoading: isDeleting }] =
    useDeleteAudienceMutation();
  const { data: usersResponse, isLoading: isUsersLoading } = useGetUserQuery({
    page: 1,
    limit: 100,
    gender: "",
  });

  const audienceRows = Array.isArray(audienceResponse)
    ? audienceResponse
    : Array.isArray(audienceResponse?.data)
      ? audienceResponse.data
      : [];
  const users = Array.isArray(usersResponse?.users)
    ? usersResponse.users
    : Array.isArray(usersResponse?.data?.users)
      ? usersResponse.data.users
      : Array.isArray(usersResponse)
        ? usersResponse
        : Array.isArray(usersResponse?.data)
          ? usersResponse.data
          : [];
  const userOptions = users
    .map((user) => ({
      id: user.id,
      label: user.username || user.email || user.mobile || `User ${user.id}`,
      value: user.username || user.email || user.mobile || "",
      email: user.email || "",
    }))
    .filter((user) => user.value);
  const hasSelectedUser = userOptions.some(
    (user) => user.value === formData.users
  );

  const totalUsers = audienceRows.reduce((sum, row) => {
    const users = getUserDisplayValue(row.users)
      .split(",")
      .map((user) => user.trim())
      .filter(Boolean);

    return sum + users.length;
  }, 0);

  const stats = [
    { label: "Total audiences", value: audienceRows.length },
    { label: "Total users", value: totalUsers },
    {
      label: "Active roles",
      value: new Set(audienceRows.map((row) => row.role).filter(Boolean)).size,
    },
  ];

  const isSubmitting = isCreating || isUpdating;
  const errorMessage =
    error?.data?.message || error?.error || "Unable to load audiences.";

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row) => {
    setEditingId(row.id);
    setFormData({
      audience: row.audience || "",
      users: getUserDisplayValue(row.users),
      role: row.role || "",
      state: row.state || "",
      district: row.district || "",
      gender: row.gender || "",
      ageRange: row.ageRange || "",
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
        await updateAudience({ id: editingId, ...formData }).unwrap();
      } else {
        await addAudience(formData).unwrap();
      }

      handleCloseModal();
      refetch();
    } catch (submitError) {
      console.error("Failed to save audience:", submitError);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this audience?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteAudience(id).unwrap();
      refetch();
    } catch (deleteError) {
      console.error("Failed to delete audience:", deleteError);
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
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Audience builder
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Audience table
            </h3>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="self-start rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Create audience
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Audience",
                    "Users",
                    "Role",
                    "State",
                    "District",
                    "Gender",
                    "Age Range",
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
                      colSpan={8}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      Loading audiences...
                    </td>
                  </tr>
                ) : null}

                {isError ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-8 text-center text-sm text-rose-600"
                    >
                      {errorMessage}
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError && audienceRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      No audience records found.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError
                  ? audienceRows.map((row) => (
                      <tr key={row.id} className="border-t border-slate-200">
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          {row.audience}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {getUserDisplayValue(row.users)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {row.role}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {row.state}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {row.district}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {row.gender}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {row.ageRange}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(row)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                              aria-label={`Edit ${row.audience}`}
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(row.id)}
                              disabled={isDeleting}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label={`Delete ${row.audience}`}
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
          <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {editingId ? "Update audience" : "Create audience"}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  {editingId ? "Edit audience details" : "Add audience details"}
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

            <form
              className="mt-6 grid gap-4 md:grid-cols-2"
              onSubmit={handleSubmit}
            >
              {[
                { id: "audience", label: "Audience" },
              ].map((field) => (
                <div
                  key={field.id}
                  className={field.wide ? "md:col-span-2" : undefined}
                >
                  <label
                    htmlFor={field.id}
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    name={field.id}
                    type="text"
                    value={formData[field.id]}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="users"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Users
                </label>
                <select
                  id="users"
                  name="users"
                  value={formData.users}
                  onChange={handleChange}
                  required
                  disabled={isUsersLoading}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {isUsersLoading ? "Loading users..." : "Select user"}
                  </option>
                  {formData.users && !hasSelectedUser ? (
                    <option value={formData.users}>{formData.users}</option>
                  ) : null}
                  {userOptions.map((user) => (
                    <option key={user.id || user.value} value={user.value}>
                      {user.email ? `${user.label} (${user.email})` : user.label}
                    </option>
                  ))}
                </select>
              </div>

              {[
                { id: "role", label: "Role" },
                { id: "state", label: "State" },
                { id: "district", label: "District" },
                { id: "gender", label: "Gender" },
                { id: "ageRange", label: "Age Range", wide: true },
              ].map((field) => (
                <div
                  key={field.id}
                  className={field.wide ? "md:col-span-2" : undefined}
                >
                  <label
                    htmlFor={field.id}
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    name={field.id}
                    type="text"
                    value={formData[field.id]}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Saving audience..."
                    : editingId
                      ? "Update audience"
                      : "Save audience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Audience;
