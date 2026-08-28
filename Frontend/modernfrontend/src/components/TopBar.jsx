import { useLocation } from "react-router-dom";

const titles = {
  "/dashboard": {
    title: "Dashboard",
    subtitle:
      "A high-clarity control center for platform activity, growth, and learning ops.",
  },
  "/users": {
    title: "Users",
    subtitle:
      "Track member activity, health signals, and engagement at a glance.",
  },
  "/notification": {
    title: "Notification",
    subtitle:
      "Manage alert streams, delivery health, and campaign momentum.",
  },
  "/lms": {
    title: "LMS",
    subtitle:
      "Oversee course performance, learner progress, and release cadence.",
  },
};

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
    <path
      d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
    <path
      d="M14.857 17H9.143M17 17V10.8A5 5 0 0 0 13.4 6a1.5 1.5 0 0 0-2.8 0A5 5 0 0 0 7 10.8V17l-1.286 1.286A1 1 0 0 0 6.42 20h11.16a1 1 0 0 0 .707-1.707L17 17Zm-6.5 3a1.5 1.5 0 0 0 3 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
    <path
      d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TopBar = () => {
  const location = useLocation();

  const page = titles[location.pathname] || {
    title: "Household",
    subtitle:
      "A refined control surface for navigation, insight, and action.",
  };

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="border-b border-slate-200/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.94),_rgba(248,250,252,0.96)),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.2),_transparent_20%)] px-4 py-2 backdrop-blur xl:px-6">

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">

        {/* LEFT */}
        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            {/* <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              Control Room
            </span> */}

            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              {today}
            </span>

          </div>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            {page.title}
          </h1>

          <p className="text-xs text-slate-600">
            {page.subtitle}
          </p>

        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-2">

          {/* search */}
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:min-w-[220px]">

            <span className="text-slate-400">
              <SearchIcon />
            </span>

            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent text-xs text-slate-700 outline-none"
            />

          </label>

          {/* alerts */}
          <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">

            <BellIcon />
            Alerts

          </button>

          {/* insight */}
          <button className="inline-flex items-center gap-1 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white">

            <SparkIcon />
            New

          </button>

          {/* user */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1">

            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,_#0f172a,_#1d4ed8)] text-xs font-semibold text-white">
              PM
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-900">
                Product Admin
              </p>
              <p className="text-[10px] text-slate-500">
                Operations
              </p>
            </div>

          </div>

        </div>

      </div>

    </header>
  );
};

export default TopBar;