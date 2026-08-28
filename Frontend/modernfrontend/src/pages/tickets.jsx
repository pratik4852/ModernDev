import { useState } from "react";
import {
  useCreateTicketMutation,
  useGetTicketsQuery,
  useGetUserQuery,
} from "../redux/baseapi";

const initialForm = {
  appointment_no: "",
  cluster_id: "",
  title: "",
  category: "",
  priority: "Medium",
  assigned_to: "",
  status: "Open",
};

const formatCreatedAt = (value) => {
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

const getPriorityTone = (priority) => {
  switch (priority) {
    case "High":
      return "bg-rose-50 text-rose-700";
    case "Medium":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-emerald-50 text-emerald-700";
  }
};

const getStatusTone = (status) => {
  switch (status) {
    case "Open":
      return "bg-sky-50 text-sky-700";
    case "In Progress":
      return "bg-amber-50 text-amber-700";
    case "Closed":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

const Tickets = () => {
  const [formData, setFormData] = useState(initialForm);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const {
    data: ticketsResponse = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTicketsQuery();
  const { data: usersResponse } = useGetUserQuery({
    page: 1,
    limit: 100,
    gender: "",
  });
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();

  const tickets = Array.isArray(ticketsResponse)
    ? ticketsResponse
    : Array.isArray(ticketsResponse?.data)
      ? ticketsResponse.data
      : Array.isArray(ticketsResponse?.tickets)
        ? ticketsResponse.tickets
        : Array.isArray(ticketsResponse?.data?.tickets)
          ? ticketsResponse.data.tickets
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

  const errorMessage =
    error?.data?.message || error?.error || "Unable to load tickets.";

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createTicket(formData).unwrap();
      handleCloseModal();
      refetch();
    } catch (submitError) {
      console.error("Failed to create ticket:", submitError);
    }
  };

  const stats = [
    { label: "Total tickets", value: tickets.length },
    {
      label: "Open tickets",
      value: tickets.filter((item) => item.status === "Open").length,
    },
    {
      label: "High priority",
      value: tickets.filter((item) => item.priority === "High").length,
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

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Ticket management
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Tickets table
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500">
              {tickets.length} records available
            </p>
            <button
              type="button"
              onClick={handleOpenModal}
              className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
            >
              Create ticket
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Appointment No",
                    "Cluster ID",
                    "Title",
                    "Category",
                    "Priority",
                    "Assigned To",
                    "Status",
                    "Created At",
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
                      Loading tickets...
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

                {!isLoading && !isError && tickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      No tickets found.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError
                  ? tickets.map((ticket) => (
                      <tr
                        key={
                          ticket.id ??
                          ticket._id ??
                          ticket.appointment_no ??
                          `${ticket.title}-${ticket.createdAt}`
                        }
                        className="border-t border-slate-200"
                      >
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          {ticket.appointment_no ?? "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {ticket.cluster_id ?? "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {ticket.title ?? "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {ticket.category ?? "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityTone(ticket.priority)}`}
                          >
                            {ticket.priority ?? "-"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {ticket.assigned_to?.username ?? "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusTone(ticket.status)}`}
                          >
                            {ticket.status ?? "-"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatCreatedAt(ticket.createdAt)}
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
                  Create ticket
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  Add ticket details
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
                  htmlFor="appointment_no"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Appointment No
                </label>
                <input
                  id="appointment_no"
                  name="appointment_no"
                  type="text"
                  value={formData.appointment_no}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="cluster_id"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Cluster ID
                </label>
                <input
                  id="cluster_id"
                  name="cluster_id"
                  type="text"
                  value={formData.cluster_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

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
                  htmlFor="assigned_to"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Assigned To
                </label>
                <select
                  id="assigned_to"
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                >
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option
                      key={user.id ?? user.email ?? user.username}
                      value={user.id ?? ""}
                    >
                      {user.username ?? user.email ?? "Unnamed user"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
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
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? "Saving ticket..." : "Save ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Tickets;
