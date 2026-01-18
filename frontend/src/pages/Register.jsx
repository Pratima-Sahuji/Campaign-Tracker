import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
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
      // register
      await api.post("/auth/register/", form);

      // auto-login
      const loginRes = await api.post("/auth/login/", {
        username: form.username,
        password: form.password,
      });

      localStorage.setItem("access_token", loginRes.data.access);
      localStorage.setItem("refresh_token", loginRes.data.refresh);

      nav("/campaigns");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-black">Create your account ✨</h1>
        <p className="text-sm text-gray-500 mt-1">
          Start tracking campaigns in seconds.
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
              placeholder="Choose username"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Email (optional)
            </label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className="mt-1 w-full h-11 rounded-xl border px-3 text-sm focus:ring-2 focus:ring-black outline-none"
              placeholder="example@gmail.com"
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
              placeholder="Create password"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-black text-white text-sm font-bold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Register & Continue"}
          </button>
        </form>

        <p className="text-sm mt-5 text-gray-600">
          Already have an account?{" "}
          <Link className="font-bold text-black" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
