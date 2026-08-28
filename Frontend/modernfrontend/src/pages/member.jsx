import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  useGetHouseholdMembersQuery,
  useCreateHouseholdMemberMutation,
} from "../redux/baseapi";

const statusTone = {
  Active: "bg-emerald-100 text-emerald-800",
  Inactive: "bg-red-100 text-red-700",
};

const initialForm = {
  memberId: "",
  memberName: "",
  dateOfBirth: "",
  gender: "",
  earnedPoints: 0,
  userStatus: "Active",
  appVersion: "",
  appStatus: "Active",
  lastLogin: "",
};

const formatDate = (value, withTime = false) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  }).format(date);
};

const Member = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [gender, setGender] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const {
    data: membersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetHouseholdMembersQuery();

  const [createMember, { isLoading: isCreating }] =
    useCreateHouseholdMemberMutation();
  const selectedHouseholdId = Number(searchParams.get("householdId")) || null;

  const members = Array.isArray(membersResponse)
    ? membersResponse
    : Array.isArray(membersResponse?.data)
      ? membersResponse.data
      : [];
  const errorMessage =
    error?.data?.message || error?.error || "Unable to load members.";

  const householdMembers = selectedHouseholdId
    ? members.filter(
        (member) => Number(member.householdId) === selectedHouseholdId,
      )
    : [];

  const filteredMembers = householdMembers.filter((member) => {
    const matchesName = (member.memberName || "")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const matchesGender = gender ? member.gender === gender : true;

    return matchesName && matchesGender;
  });

  const visibleMembers = filteredMembers.slice(0, rowsPerPage);
  const totalEarnedPoints = householdMembers.reduce(
    (total, member) => total + Number(member.earnedPoints || 0),
    0,
  );

  const handleOpenForm = () => {
    setFormData(initialForm);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setFormData(initialForm);
    setShowForm(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!selectedHouseholdId) {
      return;
    }

    try {
      const payload = {
        ...formData,
        earnedPoints: Number(formData.earnedPoints),
        householdId: selectedHouseholdId,
        lastLogin: formData.lastLogin
          ? new Date(formData.lastLogin).toISOString()
          : "",
      };

      await createMember(payload).unwrap();
      handleCloseForm();
      refetch();
    } catch (err) {
      console.error("Failed to add member:", err);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <Link
          to="/household"
          className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Households
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Household Members
          </h1>
          <button
            type="button"
            onClick={handleOpenForm}
            disabled={!selectedHouseholdId}
            className="self-start rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            title={
              selectedHouseholdId
                ? "Add member"
                : "Select a household before adding a member"
            }
          >
            Add Member
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                    Create member
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">
                    Add member details
                  </h3>
                </div>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                  >
                    Close
                  </button>
              </div>

              <form
                onSubmit={handleAddMember}
                className="mt-6 grid gap-4 md:grid-cols-2"
              >
                {[
                  {
                    id: "memberId",
                    label: "Member ID",
                    type: "text",
                    required: true,
                  },
                  {
                    id: "memberName",
                    label: "Member Name",
                    type: "text",
                    required: true,
                  },
                  {
                    id: "dateOfBirth",
                    label: "Date of Birth",
                    type: "date",
                    required: true,
                  },
                  {
                    id: "earnedPoints",
                    label: "Earned Points",
                    type: "number",
                    required: true,
                  },
                  {
                    id: "appVersion",
                    label: "App Version",
                    type: "text",
                    required: true,
                  },
                  {
                    id: "lastLogin",
                    label: "Last Login",
                    type: "datetime-local",
                    required: true,
                    wide: true,
                  },
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
                      type={field.type}
                      value={formData[field.id]}
                      onChange={handleChange}
                      required={field.required}
                      min={
                        field.id === "earnedPoints"
                          ? "0"
                          : undefined
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                    />
                  </div>
                ))}

                {[
                  {
                    id: "gender",
                    label: "Gender",
                    options: ["Male", "Female"],
                  },
                  {
                    id: "userStatus",
                    label: "User Status",
                    options: ["Active", "Inactive"],
                  },
                  {
                    id: "appStatus",
                    label: "App Status",
                    options: ["Active", "Inactive"],
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      {field.label}
                    </label>
                    <select
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                    >
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCreating ? "Saving member..." : "Save member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="rounded-lg border border-slate-100 bg-white p-3 shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "HOUSEHOLD", value: selectedHouseholdId ?? "-" },
              { label: "TOTAL EARNED POINTS", value: totalEarnedPoints },
              { label: "MAX ALLOWED POINTS", value: 0 },
            ].map((stat) => (
              <article
                key={stat.label}
                className="rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-4"
              >
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-lg font-bold text-slate-950">
                  {stat.value}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-100 bg-white p-3 shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by Member Name..."
                className="h-9 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-32"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {[
                    "MEMBER ID",
                    "MEMBER NAME",
                    "DATE OF BIRTH",
                    "GENDER",
                    "EARNED POINTS",
                    "USER STATUS",
                    "APP VERSION",
                    "APP STATUS",
                    "LAST LOGIN",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-3 py-3 text-xs font-semibold uppercase text-slate-500"
                    >
                      <span className="inline-flex items-center gap-1">
                        {heading}
                        {heading === "EARNED POINTS" ? (
                          <span className="text-[10px] leading-none text-slate-400">
                            ▲
                            <br />▼
                          </span>
                        ) : null}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-3 py-8 text-center text-sm text-slate-500"
                    >
                      Loading members...
                    </td>
                  </tr>
                ) : null}

                {isError ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-3 py-8 text-center text-sm text-red-600"
                    >
                      {errorMessage}
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError
                  ? visibleMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-slate-200 text-sm text-slate-950"
                      >
                        <td className="px-3 py-2.5">
                          {member.memberId ?? "-"}
                        </td>
                        <td className="px-3 py-2.5">
                          {member.memberName ?? "-"}
                        </td>
                        <td className="px-3 py-2.5">
                          {formatDate(member.dateOfBirth)}
                        </td>
                        <td className="px-3 py-2.5">{member.gender ?? "-"}</td>
                        <td className="px-3 py-2.5">
                          {member.earnedPoints ?? 0}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone[member.userStatus] || "bg-slate-100 text-slate-700"}`}
                          >
                            {member.userStatus ?? "-"}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          {member.appVersion ?? "-"}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone[member.appStatus] || "bg-slate-100 text-slate-700"}`}
                          >
                            {member.appStatus ?? "-"}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          {formatDate(member.lastLogin, true)}
                        </td>
                      </tr>
                    ))
                  : null}

                {!isLoading && !isError && visibleMembers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-3 py-8 text-center text-sm text-slate-500"
                    >
                      No members found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 pt-4 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing page 1 of 1 ({filteredMembers.length}{" "}
              {filteredMembers.length === 1 ? "member" : "members"})
            </p>

            <div className="flex items-center justify-end gap-3">
              <label className="flex items-center gap-2">
                Rows:
                <select
                  value={rowsPerPage}
                  onChange={(event) =>
                    setRowsPerPage(Number(event.target.value))
                  }
                  className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </label>

              <button
                type="button"
                disabled
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-300"
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold text-white"
                aria-current="page"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-300"
                aria-label="Next page"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Member;
