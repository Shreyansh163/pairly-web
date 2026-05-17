import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router";
import axios from "axios";
import { Flame, User, Users, Inbox, LogOut, MessageSquare } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { disconnectSocket } from "../utils/socket";

const navItems = [
  { to: "/", label: "Feed", icon: Flame, end: true },
  { to: "/connections", label: "Connections", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/requests", label: "Requests", icon: Inbox },
];

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      disconnectSocket();
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="sticky top-0 z-[200] backdrop-blur-xl bg-base-100/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={user ? "/" : "/login"} className="flex items-center gap-2 group">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-linear-to-br from-rose-500 to-fuchsia-600 shadow-lg shadow-rose-500/30 group-hover:scale-105 transition">
            <Flame size={20} className="text-white" strokeWidth={2.5} />
          </span>
          <span className="text-xl font-extrabold tracking-tight bg-linear-to-r from-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
            Pairly
          </span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-1">
            {/* eslint-disable-next-line no-unused-vars */}
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-base-content/70 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>
        )}

        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm opacity-80">
              Hey, <span className="font-semibold">{user.firstName}</span>
            </span>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="relative w-10 h-10 rounded-full ring-2 ring-rose-400/60 hover:ring-rose-300 transition cursor-pointer overflow-hidden"
              >
                <img
                  src={user.photoUrl}
                  alt={user.firstName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-base-100" />
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 w-56 rounded-2xl bg-base-200/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 z-50"
              >
                <li className="md:hidden">
                  <Link to="/"><Flame size={16} /> Feed</Link>
                </li>
                <li>
                  <Link to="/profile"><User size={16} /> Profile</Link>
                </li>
                <li className="md:hidden">
                  <Link to="/connections"><Users size={16} /> Connections</Link>
                </li>
                <li className="md:hidden">
                  <Link to="/messages"><MessageSquare size={16} /> Messages</Link>
                </li>
                <li className="md:hidden">
                  <Link to="/requests"><Inbox size={16} /> Requests</Link>
                </li>
                <div className="my-1 h-px bg-white/10" />
                <li>
                  <button onClick={handleLogout} className="text-rose-400">
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
