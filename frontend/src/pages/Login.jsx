import { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        username: form.username.trim(),
        password: form.password,
      };

      const res = await api.post("/auth/login/", payload);

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      nav("/campaigns");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        "Login failed";
      setError(msg);
      console.log("Login error:", err?.response?.data || err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur border rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-black mb-1">Welcome back 👋</h1>
        <p className="text-sm text-gray-600 mb-4">
          Login to manage campaigns and dashboard.
        </p>

        {error && (
          <div className="mb-4 border border-red-200 bg-red-50 text-red-700 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-semibold">Username</label>
            <input
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={onChange}
              className="w-full border rounded-xl px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={onChange}
              className="w-full border rounded-xl px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <button className="w-full rounded-xl py-2 font-semibold text-white bg-gradient-to-r from-gray-900 to-gray-700 hover:opacity-95">
            Login
          </button>
        </form>

        <p className="text-sm mt-4 text-gray-700">
          Don’t have an account?{" "}
          <Link className="text-violet-700 font-semibold" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
