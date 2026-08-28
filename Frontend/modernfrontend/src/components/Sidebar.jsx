import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  BellIcon,
  AcademicCapIcon,
  UserGroupIcon,
  TicketIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const navSections = [
  {
    title: "Main Menu",
    items: [
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: HomeIcon,
      },
      {
        label: "Household",
        to: "/household",
        icon: UserGroupIcon,
      },
      {
        label: "Users",
        to: "/users",
        icon: UsersIcon,
      },
      {
        label: "Tickets",
        to: "/tickets",
        icon: TicketIcon,
      },
       {
        label: "Feedback",
        to: "/feedback",
        icon: ChartBarIcon,
      },
      {
        label: "Notification",
        to: "/notification",
        icon: BellIcon,
      },
      {
        label: "LMS",
        to: "/lms",
        icon: AcademicCapIcon,
      },
      {
        label: "Survey",
        to: "/survey",
        icon: ClipboardDocumentListIcon,
      },
      {
        label: "Settings",
        to: "/settings",
        icon: Cog6ToothIcon,
      },
      {
        label: "Audience",
        to: "/audience",
        icon: ChartBarIcon,
      },
      
    ],
  },
];

const Sidebar = ({ collapsed = false, setCollapsed = () => {} }) => {
  return (
    <aside
      className={`
        h-full min-h-0 shrink-0 transition-all duration-300
        border-r border-slate-200/70
        bg-[linear-gradient(180deg,#0f172a,#111827,#172033)]
        text-slate-100
        flex flex-col overflow-hidden
        ${collapsed ? "w-20" : "w-80"}
      `}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white text-sm bg-white/10 px-2 py-1 rounded"
        >
          {collapsed ? ">>" : "<<"}
        </button>
      </div>

      <nav className="mt-6 min-h-0 flex-1 space-y-6 overflow-y-auto px-2 pb-6">
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="mb-2 px-3 text-xs uppercase text-slate-400">
                {section.title}
              </p>
            )}

            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                        isActive
                          ? "bg-white text-black"
                          : "text-slate-300 hover:bg-white/10"
                      }`
                    }
                  >
                    {/* Icon */}
                    <Icon className="h-5 w-5 shrink-0" />

                    {/* Label */}
                    {!collapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
