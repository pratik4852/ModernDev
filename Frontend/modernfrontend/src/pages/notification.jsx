import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  useCreateNotificationsMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
} from "../redux/baseapi";

const initialForm = {
  title: "",
  description: "",
  image: "",
  audience: "",
  status: "active",
};

const formatSentAt = (value) => {
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getStatusTone = (isActive) =>
  isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600";

const Notification = () => {
  const [formData, setFormData] = useState(initialForm);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const {
    data: notificationsData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetNotificationsQuery();
  const [createNotification, { isLoading: isCreating }] =
    useCreateNotificationsMutation();
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();

  const notifications = Array.isArray(notificationsData)
    ? notificationsData
    : Array.isArray(notificationsData?.data)
      ? notificationsData.data
      : [];

  const stats = [
    { label: "Total notifications", value: notifications.length },
    {
      label: "Active",
      value: notifications.filter((item) => item.is_active).length,
    },
    {
      label: "Inactive",
      value: notifications.filter((item) => !item.is_active).length,
    },
  ];

  const handleOpenModal = () => {
    setFormData(initialForm);
    setIsCreateOpen(true);
  };

  const handleCloseModal = () => {
    setFormData(initialForm);
    setIsCreateOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];

  setFormData((prev) => ({
    ...prev,
    image: file,
  }));
};

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("image", formData.image);
    data.append("audience", formData.audience);
    data.append("is_active", formData.status === "active");
    await createNotification(data).unwrap();

    handleCloseModal();
    refetch();
  } catch (submitError) {
    console.error("Failed to create notification:", submitError);
  }
};
  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteNotification(id).unwrap();
      refetch();
    } catch (deleteError) {
      console.error("Failed to delete notification:", deleteError);
    }
  };

  const errorMessage =
    error?.data?.message || error?.error || "Unable to load notifications.";

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
              Notification center
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Notifications table
            </h3>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="self-start rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Create notification
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
                    "Image",
                    "Audience",
                    "Status",
                    "Sent At",
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
                      colSpan={7}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      Loading notifications...
                    </td>
                  </tr>
                ) : null}

                {isError ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-sm text-rose-600"
                    >
                      {errorMessage}
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError && notifications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      No notifications found.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError
                  ? notifications.map((item) => (
                      <tr key={item.id} className="border-t border-slate-200">
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          {item.title}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <p className="max-w-xs">{item.description}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.image ? (
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${item.image}`}
                              alt={item.title}
                              className="h-12 w-12 rounded-2xl object-cover"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.audience}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusTone(item.is_active)}`}
                          >
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatSentAt(item.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label={`Delete ${item.title}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Create notification
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  Add notification details
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
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleImageChange}
                  required
                  placeholder="https://example.com/image.png"
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
                  placeholder="students"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? "Saving notification..." : "Save notification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Notification;
