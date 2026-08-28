import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  useAddSettingsMutation,
  useDeleteSettingsMutation,
  useGetAudienceQuery,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../redux/baseapi";

const initialForm = {
  image: "",
  audience: "",
};

const getAudienceValue = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "object") {
    return value.audience || value.name || value.title || String(value.id || "");
  }

  return String(value);
};

const getImageSrcCandidates = (item) => {
  const image = item?.image;

  if (!image) {
    return [];
  }

  if (item?.imageUrl) {
    return [item.imageUrl];
  }

  if (image instanceof File) {
    return [URL.createObjectURL(image)];
  }

  if (/^https?:\/\//i.test(image)) {
    return [image];
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const cleanImage = String(image).replace(/^\/+/, "");

  return [
    `${baseUrl}/uploads/images/${cleanImage}`,
    `${baseUrl}/uploads/${cleanImage}`,
    `${baseUrl}/${cleanImage}`,
    `${baseUrl}/uploads/settings/${cleanImage}`,
    `${baseUrl}/settings/${cleanImage}`,
  ];
};

const SettingImage = ({ item, audience }) => {
  const [srcIndex, setSrcIndex] = useState(0);
  const imageSrcCandidates = getImageSrcCandidates(item);
  const src = imageSrcCandidates[srcIndex];

  if (!src) {
    return "-";
  }

  return (
    <img
      src={src}
      alt={audience}
      className="h-14 w-14 rounded-2xl object-cover"
      onError={() => {
        setSrcIndex((prev) =>
          prev + 1 < imageSrcCandidates.length ? prev + 1 : prev
        );
      }}
    />
  );
};

const Settings = () => {
  const [formData, setFormData] = useState(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    data: settingsResponse = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSettingsQuery();
  const { data: audienceResponse = [], isLoading: isAudienceLoading } =
    useGetAudienceQuery();
  const [addSettings, { isLoading: isCreating }] = useAddSettingsMutation();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();
  const [deleteSettings, { isLoading: isDeleting }] =
    useDeleteSettingsMutation();

  const settings = Array.isArray(settingsResponse)
    ? settingsResponse
    : Array.isArray(settingsResponse?.data)
      ? settingsResponse.data
      : [];
  const audiences = Array.isArray(audienceResponse)
    ? audienceResponse
    : Array.isArray(audienceResponse?.data)
      ? audienceResponse.data
      : [];
  const audienceOptions = audiences
    .map((item) => ({
      id: item.id,
      value: item.audience || item.name || item.title || "",
    }))
    .filter((item) => item.value);
  const hasSelectedAudience = audienceOptions.some(
    (item) => item.value === formData.audience
  );

  const stats = [
    { label: "Total settings", value: settings.length },
    {
      label: "Audiences",
      value: new Set(settings.map((item) => getAudienceValue(item.audience))).size,
    },
    {
      label: "Images",
      value: settings.filter((item) => item.image).length,
    },
  ];

  const isSubmitting = isCreating || isUpdating;
  const errorMessage =
    error?.data?.message || error?.error || "Unable to load settings.";

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      image: "",
      audience: getAudienceValue(item.audience),
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    setFormData((prev) => ({
      ...prev,
      image: file || "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = new FormData();
      data.append("audience", formData.audience);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editingId) {
        await updateSettings({ id: editingId, body: data }).unwrap();
      } else {
        await addSettings(data).unwrap();
      }

      handleCloseModal();
      refetch();
    } catch (submitError) {
      console.error("Failed to save setting:", submitError);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this setting?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteSettings(id).unwrap();
      refetch();
    } catch (deleteError) {
      console.error("Failed to delete setting:", deleteError);
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
              Settings model
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Settings table
            </h3>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="self-start rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Create setting
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {["Image", "Audience", "Actions"].map((head) => (
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
                      colSpan={3}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      Loading settings...
                    </td>
                  </tr>
                ) : null}

                {isError ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-8 text-center text-sm text-rose-600"
                    >
                      {errorMessage}
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError && settings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      No settings found.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError
                  ? settings.map((item) => (
                      <tr key={item.id} className="border-t border-slate-200">
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <SettingImage
                            item={item}
                            audience={getAudienceValue(item.audience)}
                          />
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          {getAudienceValue(item.audience)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                              aria-label={`Edit ${getAudienceValue(item.audience)}`}
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              disabled={isDeleting}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label={`Delete ${getAudienceValue(item.audience)}`}
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
                  {editingId ? "Update setting" : "Create setting"}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  {editingId ? "Edit setting details" : "Add setting details"}
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
                  required={!editingId}
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
                  required
                  disabled={isAudienceLoading}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {isAudienceLoading ? "Loading audiences..." : "Select audience"}
                  </option>
                  {formData.audience && !hasSelectedAudience ? (
                    <option value={formData.audience}>
                      {formData.audience}
                    </option>
                  ) : null}
                  {audienceOptions.map((item) => (
                    <option key={item.id || item.value} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Saving setting..."
                    : editingId
                      ? "Update setting"
                      : "Save setting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Settings;
