import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  useCreateLmsMutation,
  useDeleteLmsMutation,
  useGetLmsQuery,
  useUpdateLmsMutation,
} from "../redux/baseapi";
  
const initialForm = {
  title: "",
  descrition: "",
  category: "",
  audience: "",
  is_active: true,
};

const getStatusTone = (isActive) =>
  isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600";

const Lms = () => {
  const [formData, setFormData] = useState(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    data: lmsResponse = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetLmsQuery();
  const [createLms, { isLoading: isCreating }] = useCreateLmsMutation();
  const [updateLms, { isLoading: isUpdating }] = useUpdateLmsMutation();
  const [deleteLms, { isLoading: isDeleting }] = useDeleteLmsMutation();

  const modules = Array.isArray(lmsResponse)
    ? lmsResponse
    : Array.isArray(lmsResponse?.data)
      ? lmsResponse.data
      : [];

  const stats = [
    { label: "Total modules", value: modules.length },
    {
      label: "Active",
      value: modules.filter((item) => item.is_active).length,
    },
    {
      label: "Inactive",
      value: modules.filter((item) => !item.is_active).length,
    },
  ];

  const isSubmitting = isCreating || isUpdating;
  const errorMessage = error?.data?.message || error?.error || "Unable to load LMS modules.";

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      descrition: item.descrition || item.description || "",
      category: item.category || "",
      audience: item.audience || "",
      is_active: Boolean(item.is_active),
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
      [name]: name === "is_active" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateLms({ id: editingId, ...formData }).unwrap();
      } else {
        await createLms(formData).unwrap();
      }

      handleCloseModal();
      refetch();
    } catch (submitError) {
      console.error("Failed to save LMS module:", submitError);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this LMS module?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteLms(id).unwrap();
      refetch();
    } catch (deleteError) {
      console.error("Failed to delete LMS module:", deleteError);
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
              Learning suite
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              LMS modules table
            </h3>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="self-start rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Create module
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Title",
                    "Description",
                    "Category",
                    "Audience",
                    "Status",
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
                      Loading LMS modules...
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

                {!isLoading && !isError && modules.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      No LMS modules found.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError
                  ? modules.map((item) => (
                      <tr key={item.id} className="border-t border-slate-200">
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          {item.title}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <p className="max-w-xs">
                            {item.descrition || item.description || "-"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.category || "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.audience || "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusTone(item.is_active)}`}
                          >
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                              aria-label={`Edit ${item.title}`}
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              disabled={isDeleting}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label={`Delete ${item.title}`}
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
                  {editingId ? "Update module" : "Create module"}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  {editingId ? "Edit LMS module details" : "Add LMS module details"}
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
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="descrition"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="descrition"
                  name="descrition"
                  value={formData.descrition}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  required
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
                <input
                  id="audience"
                  name="audience"
                  type="text"
                  value={formData.audience}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="is_active"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Status
                </label>
                <select
                  id="is_active"
                  name="is_active"
                  value={String(formData.is_active)}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Saving module..."
                    : editingId
                      ? "Update module"
                      : "Save module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Lms;
