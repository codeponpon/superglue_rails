import React from "react";
import { useSelector } from "react-redux";
import Logo from "../Logo";
import {
  Folder,
  List,
  Settings,
  LogOut,
  Newspaper,
  ChevronDown,
  Edit,
} from "lucide-react";
import { Form } from "../Inputs";
import { UserState } from "../../slices/user";

export default function AppSidebar() {
  const user = useSelector((state: { user: UserState }) => state.user);
  const { form, extras } = user.sign_out_form ?? { form: {}, extras: {} };
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === "/dashboard" || currentPath === "/";
    }
    if (path === "/dashboard/settings") {
      return currentPath === "/dashboard/settings";
    }
    if (path === "/projects") {
      return (
        currentPath === "/projects" || currentPath.startsWith("/projects/")
      );
    }
    if (path.startsWith("/users/") && path.includes("/edit")) {
      return currentPath.includes("/users/") && currentPath.includes("/edit");
    }
    return currentPath === path;
  };

  const getMenuItemClasses = (path: string) => {
    const baseClasses = "px-4 py-2 hover:bg-indigo-800";
    return isActive(path)
      ? `${baseClasses} bg-indigo-800 border-r-4 border-indigo-300`
      : baseClasses;
  };

  const getLinkClasses = (path: string) => {
    const baseClasses =
      "flex items-center py-2 text-indigo-200 rounded-lg transition-colors";
    return isActive(path)
      ? `${baseClasses} text-white font-semibold`
      : baseClasses;
  };

  return (
    <aside className="min-w-64 relative bg-indigo-900 shadow-sm min-h-[calc(100vh)]">
      <nav>
        <div className="p-4">
          <Logo />
        </div>
        <ul className="space-y-2">
          <li className={getMenuItemClasses("/dashboard")}>
            <a
              href="/dashboard"
              data-sg-visit
              className={getLinkClasses("/dashboard")}
            >
              <Folder className="w-5 h-5 mr-3" />
              Dashboard
            </a>
          </li>
          <li className={getMenuItemClasses("/projects")}>
            <a
              href="/projects"
              data-sg-visit
              className={getLinkClasses("/projects")}
            >
              <List className="w-5 h-5 mr-3" />
              Projects
            </a>
          </li>
          <li className={`${getMenuItemClasses("/dashboard/posts")} hidden`}>
            <a
              href="/dashboard/posts"
              data-sg-visit
              className={getLinkClasses("/dashboard/posts")}
            >
              <Newspaper className="w-5 h-5 mr-3" />
              Posts
            </a>
          </li>
          <li className={getMenuItemClasses("/dashboard/settings") + " hidden"}>
            <a
              href="/dashboard/settings"
              data-sg-visit
              className={getLinkClasses("/dashboard/settings")}
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
      <section className="absolute px-4 hover:bg-indigo-800 bottom-25 w-full">
        <div className="flex items-center py-2 text-indigo-200 transition-colors">
          <span>{user.username}</span>
          <ChevronDown className="w-5 h-5 mr-3" />
          <ul className="absolute top-0 left-0 w-full bg-indigo-900">
            <li
              className={`flex items-center px-2 pt-4 pb-4 text-indigo-200 transition-colors hover:bg-indigo-800 ${
                isActive(`/users/${user.id}/edit`)
                  ? "bg-indigo-800 border-r-4 border-indigo-300"
                  : ""
              }`}
            >
              <Edit className="w-5 h-5 mr-3" />
              <a
                href={user.id ? `/users/${user.id}/edit` : "#"}
                data-sg-visit
                className={`${
                  user.id ? "" : "pointer-events-none opacity-50"
                } ${
                  isActive(`/users/${user.id}/edit`)
                    ? "text-white font-semibold"
                    : ""
                }`}
              >
                Edit Profile
              </a>
            </li>
            <li className="hover:bg-indigo-800">
              <Form {...form} extras={extras} className="flex flex-col">
                <button
                  type="submit"
                  className="flex items-center px-2 pt-4 pb-4 text-indigo-200 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </Form>
            </li>
          </ul>
        </div>
      </section>
    </aside>
  );
}
