import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  const token = localStorage.getItem("access_token");

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-bold transition ${
      isActive
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
        : "text-gray-700 hover:bg-white/70"
    }`;

  function logout() {
    localStorage.clear();
    nav("/login");
  }

  return (
    <div className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="font-black text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            SBM Campaign Tracker
          </div>

          {token && (
            <div className="flex gap-2">
              <NavLink to="/campaigns" className={linkClass}>
                Campaigns
              </NavLink>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            </div>
          )}
        </div>

        <div>
          {token ? (
            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-xl text-sm font-black text-white 
              bg-gradient-to-r from-slate-900 to-slate-700 shadow-md hover:shadow-lg transition"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="px-5 py-2.5 rounded-xl text-sm font-black border bg-white hover:bg-gray-50 transition"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
