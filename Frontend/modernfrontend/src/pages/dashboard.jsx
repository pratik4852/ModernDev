import {
  AcademicCapIcon,
  BellIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  HomeModernIcon,
  TicketIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import {
  useGetAudienceQuery,
  useGetHouseholdQuery,
  useGetLmsQuery,
  useGetNotificationsQuery,
  useGetSurveysQuery,
  useGetTicketsQuery,
  useGetUserQuery,
} from "../redux/baseapi";

const getList = (response, keys = []) => {
  if (Array.isArray(response)) {
    return response;
  }

  for (const key of keys) {
    if (Array.isArray(response?.[key])) {
      return response[key];
    }

    if (Array.isArray(response?.data?.[key])) {
      return response.data[key];
    }
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

const formatDateTime = (value) => {
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getPercent = (value, total) => {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
};

const getStatusTone = (status) => {
  switch (status) {
    case "error":
      return "bg-rose-50 text-rose-700";
    case "loading":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-emerald-50 text-emerald-700";
  }
};

const Dashboard = () => {
  const usersQuery = useGetUserQuery({ page: 1, limit: 100, gender: "" });
  const notificationsQuery = useGetNotificationsQuery();
  const lmsQuery = useGetLmsQuery();
  const householdQuery = useGetHouseholdQuery();
  const ticketsQuery = useGetTicketsQuery();
  const surveysQuery = useGetSurveysQuery();
  const audienceQuery = useGetAudienceQuery();

  const users = getList(usersQuery.data, ["users"]);
  const notifications = getList(notificationsQuery.data);
  const modules = getList(lmsQuery.data);
  const households = getList(householdQuery.data);
  const tickets = getList(ticketsQuery.data, ["tickets"]);
  const surveys = getList(surveysQuery.data);
  const audiences = getList(audienceQuery.data);

  const totalUsers =
    usersQuery.data?.total ?? usersQuery.data?.data?.total ?? users.length;
  const activeNotifications = notifications.filter((item) => item.is_active);
  const activeModules = modules.filter((item) => item.is_active);
  const openTickets = tickets.filter((item) => item.status === "Open");
  const highPriorityTickets = tickets.filter((item) => item.priority === "High");
  const totalAllowedPoints = households.reduce(
    (sum, item) => sum + Number(item.allowedpoints || 0),
    0,
  );
  const totalMaxAllowedPoints = households.reduce(
    (sum, item) => sum + Number(item.maxallowedpoints || 0),
    0,
  );
  const activeSurveyCount = surveys.filter((item) => {
    if (!item.end_date) {
      return true;
    }

    const endDate = new Date(item.end_date);
    return Number.isNaN(endDate.getTime()) || endDate >= new Date();
  }).length;

  const queries = [
    { label: "Users", query: usersQuery, path: "/users" },
    { label: "Notifications", query: notificationsQuery, path: "/notification" },
    { label: "LMS", query: lmsQuery, path: "/lms" },
    { label: "Households", query: householdQuery, path: "/household" },
    { label: "Tickets", query: ticketsQuery, path: "/tickets" },
    { label: "Surveys", query: surveysQuery, path: "/survey" },
    { label: "Audience", query: audienceQuery, path: "/audience" },
  ];

  const isLoading = queries.some((item) => item.query.isLoading);
  const failedQueries = queries.filter((item) => item.query.isError);

  const summaryCards = [
    {
      label: "Users",
      value: totalUsers,
      note: `${audiences.length} audience segments`,
      icon: UsersIcon,
      path: "/users",
    },
    {
      label: "Households",
      value: households.length,
      note: `${totalAllowedPoints}/${totalMaxAllowedPoints || 0} points used`,
      icon: HomeModernIcon,
      path: "/household",
    },
    {
      label: "Open tickets",
      value: openTickets.length,
      note: `${highPriorityTickets.length} high priority`,
      icon: TicketIcon,
      path: "/tickets",
    },
    {
      label: "Active learning",
      value: activeModules.length,
      note: `${modules.length} total LMS modules`,
      icon: AcademicCapIcon,
      path: "/lms",
    },
  ];

  const operationCards = [
    {
      label: "Notifications",
      value: notifications.length,
      meta: `${activeNotifications.length} active`,
      percent: getPercent(activeNotifications.length, notifications.length),
      path: "/notification",
      icon: BellIcon,
    },
    {
      label: "Surveys",
      value: surveys.length,
      meta: `${activeSurveyCount} active or upcoming`,
      percent: getPercent(activeSurveyCount, surveys.length),
      path: "/survey",
      icon: ClipboardDocumentListIcon,
    },
    {
      label: "Audience",
      value: audiences.length,
      meta: "Segments available",
      percent: audiences.length ? 100 : 0,
      path: "/audience",
      icon: ChartBarIcon,
    },
  ];

  const recentRecords = [
    ...tickets.map((item) => ({
      type: "Ticket",
      title: item.title || item.appointment_no || "Untitled ticket",
      detail: `${item.status || "No status"} • ${item.priority || "No priority"}`,
      createdAt: item.createdAt,
      path: "/tickets",
    })),
    ...notifications.map((item) => ({
      type: "Notification",
      title: item.title || "Untitled notification",
      detail: item.is_active ? "Active" : "Inactive",
      createdAt: item.createdAt,
      path: "/notification",
    })),
    ...surveys.map((item) => ({
      type: "Survey",
      title: item.title || "Untitled survey",
      detail: item.audience || "No audience",
      createdAt: item.createdAt || item.start_date,
      path: "/survey",
    })),
    ...modules.map((item) => ({
      type: "LMS",
      title: item.title || "Untitled module",
      detail: item.category || item.audience || "Learning module",
      createdAt: item.createdAt,
      path: "/lms",
    })),
  ]
    .sort((first, second) => {
      const firstTime = new Date(first.createdAt || 0).getTime();
      const secondTime = new Date(second.createdAt || 0).getTime();

      return secondTime - firstTime;
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Operations overview
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950">
              Dashboard based on live module data
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Track users, households, tickets, notifications, LMS modules,
              surveys, and audiences from the same API data used across the app.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
              <p className="text-sm text-slate-300">Total records</p>
              <p className="mt-2 text-3xl font-semibold">
                {totalUsers +
                  notifications.length +
                  modules.length +
                  households.length +
                  tickets.length +
                  surveys.length +
                  audiences.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 px-5 py-4">
              <p className="text-sm text-slate-500">Data health</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {failedQueries.length ? `${failedQueries.length} issue` : "Ready"}
              </p>
            </div>
          </div>
        </div>

        {isLoading || failedQueries.length ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {isLoading ? (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Syncing dashboard data...
              </span>
            ) : null}
            {failedQueries.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
              >
                {item.label} failed to load
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              to={card.path}
              className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                    {card.value}
                  </p>
                </div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600">{card.note}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Module status
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Active workload
            </h3>
          </div>

          <div className="mt-6 space-y-5">
            {operationCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link key={card.label} to={card.path} className="block">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {card.label}
                        </p>
                        <p className="text-sm text-slate-500">{card.meta}</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-slate-950">
                      {card.value}
                    </p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-slate-950"
                      style={{ width: `${card.percent}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Recent records
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">
                Latest activity across modules
              </h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {recentRecords.length} items
            </span>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            {recentRecords.length ? (
              <div className="divide-y divide-slate-200">
                {recentRecords.map((item, index) => (
                  <Link
                    key={`${item.type}-${item.title}-${index}`}
                    to={item.path}
                    className="flex flex-col gap-2 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                          {item.type}
                        </span>
                        <p className="text-sm font-semibold text-slate-950">
                          {item.title}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
                    </div>
                    <p className="text-sm text-slate-500">
                      {formatDateTime(item.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-slate-500">
                No recent records available yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            API checks
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Module connection status
          </h3>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {queries.map((item) => {
            const status = item.query.isError
              ? "error"
              : item.query.isLoading
                ? "loading"
                : "ready";

            return (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="text-sm font-semibold text-slate-800">
                  {item.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusTone(status)}`}
                >
                  {status === "error" ? (
                    <ExclamationTriangleIcon className="h-4 w-4" />
                  ) : null}
                  {status}
                </span>
              </Link>
            );
          })}
        </div>
      </section> */}
    </div>
  );
};

export default Dashboard;
