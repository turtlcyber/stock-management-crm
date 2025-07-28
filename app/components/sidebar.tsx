import { NavLink } from "@remix-run/react";
import { adminMenus } from "@/data/admin-menus";

const Sidebar = () => {
  return (
    <aside className="w-60 fixed left-0 top-12 bottom-0 border-r bg-gradient-to-b from-violet-100 to-pink-100 shadow-md z-10 overflow-y-auto">
      <ul className="space-y-1 p-2">
        {adminMenus.map(({ id, title, icon: Icon, href }) => (
          <li key={id}>
            <NavLink
              to={href}
              end={href === ""}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-blue-100"
                }`
              }
            >
              {Icon && <Icon className="w-5 h-5" />}
              {title}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
