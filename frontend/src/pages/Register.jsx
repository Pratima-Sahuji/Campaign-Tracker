import { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
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
        email: form.email.trim() || "",
        password: form.password,
      };

      // ✅ Step 1: Register
      await api.post("/auth/register/", payload);

      // ✅ Step 2: Auto-login after register
      const loginRes = await api.post("/auth/login/", {
        username: payload.username,
        password: payload.password,
      });

      localStorage.setItem("access_token", loginRes.data.access);
      localStorage.setItem("refresh_token", loginRes.data.refresh);

      // ✅ redirect directly
      nav("/campaigns");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        "Registration failed";
      setError(msg);
      console.log("Register error:", err?.response?.data || err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-violet-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur border rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-black mb-1">
          Create your account ✨
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Start tracking campaigns in seconds.
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
              placeholder="Username"
              value={form.username}
              onChange={onChange}
              className="w-full border rounded-xl px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-violet-300"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email (optional)</label>
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              className="w-full border rounded-xl px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              className="w-full border rounded-xl px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-violet-300"
              required
            />
          </div>

          <button className="w-full rounded-xl py-2 font-semibold text-white bg-gradient-to-r from-gray-900 to-gray-700 hover:opacity-95">
            Register & Continue
          </button>
        </form>

        <p className="text-sm mt-4 text-gray-700">
          Already have an account?{" "}
          <Link className="text-violet-700 font-semibold" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

