import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) nav("/campaigns");
  }, [nav]);

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login/", form);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      nav("/campaigns");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-black">Welcome back 👋</h1>
        <p className="text-sm text-gray-500 mt-1">
          Login to manage campaigns and dashboard.
        </p>

        {error && (
          <div className="mt-4 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              className="mt-1 w-full h-11 rounded-xl border px-3 text-sm focus:ring-2 focus:ring-black outline-none"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="mt-1 w-full h-11 rounded-xl border px-3 text-sm focus:ring-2 focus:ring-black outline-none"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-black text-white text-sm font-bold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm mt-5 text-gray-600">
          Don’t have an account?{" "}
          <Link className="font-bold text-black" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
