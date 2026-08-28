import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetGenderListQuery,
  useGetUserQuery,
  useUpdateUserMutation,
} from "../redux/baseapi";

const initialForm = {
  id: "",
  username: "",
  email: "",
  gender: "",
  password: "",
  mobile: "",
};

const userCards = [
  { label: "Active users", value: "12,480", note: "Up 14% this month" },
  { label: "New invites", value: "248", note: "38 pending approvals" },
  { label: "Retention", value: "89%", note: "Best result in 90 days" },
];

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGender, setSelectedGender] = useState("");
  const pageSize = 10;
  const [formData, setFormData] = useState(initialForm);
  const [successMessage, setSuccessMessage] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, isError, error, refetch } = useGetUserQuery({
    page: currentPage,
    limit: pageSize,
    gender: selectedGender,
  });
  const { data: genderOptions = [] } = useGetGenderListQuery();
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = Array.isArray(data?.users)
    ? data.users
    : Array.isArray(data?.data?.users)
      ? data.data.users
      : Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];
  const totalUsers = data?.total ?? data?.data?.total ?? users.length;
  const totalPages = Math.max(
    data?.totalPages ?? data?.data?.totalPages ?? 1,
    1,
  );
  const activePage = data?.page ?? data?.data?.page ?? currentPage;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModal = () => {
    setIsEditing(false);
    setFormData(initialForm);
    setSuccessMessage("");
    setIsAddUserOpen(true);
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setSuccessMessage("");
    setFormData({
      id: user.id ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
      gender: user.gender ?? "",
      password: "",
      mobile: user.mobile ?? "",
    });
    setIsAddUserOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddUserOpen(false);
    setIsEditing(false);
    setFormData(initialForm);
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");

    try {
      if (isEditing) {
        await updateUser(formData).unwrap();
        setSuccessMessage("User updated successfully.");
      } else {
        await addUser(formData).unwrap();
        setSuccessMessage("User added successfully.");
      }

      setFormData(initialForm);
      refetch();
      setTimeout(() => {
        handleCloseModal();
      }, 800);
    } catch (submitError) {
      setSuccessMessage("");
      console.error(
        `Failed to ${isEditing ? "update" : "add"} user:`,
        submitError,
      );
    }
  };

  const handleDeleteUser = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteUser(id).unwrap();
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        refetch();
      }
    } catch (deleteError) {
      console.error("Failed to delete user:", deleteError);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
    setCurrentPage(1);
  };

  const errorMessage =
    error?.data?.message || error?.error || "Unable to load users.";

  return (
    <div className="space-y-6">
      <section className="grid gap-5 md:grid-cols-3">
        {userCards.map((card) => (
          <article
            key={card.label}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-emerald-700">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Directory
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Users list
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedGender}
              onChange={handleGenderChange}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 outline-none transition focus:border-slate-950"
            >
              <option value="">All genders</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-slate-500">{totalUsers} users</p>
            <button
              type="button"
              onClick={handleOpenModal}
              className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
            >
              Add user
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50">
              <tr>
                {["ID", "Username", "Email", "Gender", "Mobile", "Actions"].map(
                  (head) => (
                    <th
                      key={head}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-400"
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    Loading users...
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

              {!isLoading && !isError && users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    No users found for the selected gender.
                  </td>
                </tr>
              ) : null}

              {!isLoading && !isError
                ? users.map((user) => (
                    <tr
                      key={user.id ?? user.email}
                      className="border-t border-slate-200"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                        {user.id}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.username}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.gender}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.mobile}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleEditUser(user)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                            aria-label={`Edit ${user.username}`}
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isDeleting}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label={`Delete ${user.username}`}
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

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page {activePage} of {totalPages}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={activePage <= 1 || isLoading}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={activePage >= totalPages || isLoading}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {isAddUserOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {isEditing ? "Update user" : "Create user"}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  {isEditing ? "Edit user details" : "Add a new user"}
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

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                >
                  <option value="">Select gender</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!isEditing}
                  placeholder={
                    isEditing ? "Leave blank to keep current password" : ""
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Mobile
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              {successMessage ? (
                <p className="text-sm font-medium text-emerald-700">
                  {successMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isAdding || isUpdating}
                className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isEditing
                  ? isUpdating
                    ? "Updating user..."
                    : "Update user"
                  : isAdding
                    ? "Adding user..."
                    : "Add user"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Users;
