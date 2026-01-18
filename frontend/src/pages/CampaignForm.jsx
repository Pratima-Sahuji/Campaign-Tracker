import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate, useParams, Link } from "react-router-dom";

function toYYYYMMDD(value) {
  // Accepts: "YYYY-MM-DD" (correct)
  // If someone types "DD-MM-YYYY" => convert it
  if (!value) return "";

  // already correct
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  // convert dd-mm-yyyy to yyyy-mm-dd
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }

  return value; // fallback
}

export default function CampaignForm({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    platform: "instagram",
    budget_inr: "",
    status: "planned",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [usd, setUsd] = useState(null);

  function onChange(e) {
    const { name, value } = e.target;

    // ✅ force correct date format
    if (name === "start_date" || name === "end_date") {
      setForm((p) => ({ ...p, [name]: toYYYYMMDD(value) }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  }

  async function loadCampaign() {
    try {
      const res = await api.get(`/campaigns/${id}/`);
      setForm({
        title: res.data.title,
        platform: res.data.platform,
        budget_inr: res.data.budget_inr,
        status: res.data.status,
        start_date: res.data.start_date, // already YYYY-MM-DD
        end_date: res.data.end_date || "",
      });
    } catch (err) {
      console.log("Load campaign error:", err?.response?.data || err.message);
      alert("Failed to load campaign");
    }
  }

  useEffect(() => {
    if (mode === "edit" && id) loadCampaign();
  }, [mode, id]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ always send correct date format
      const payload = {
        ...form,
        start_date: toYYYYMMDD(form.start_date),
        end_date: form.end_date ? toYYYYMMDD(form.end_date) : null,
      };

      if (mode === "edit") {
        await api.put(`/campaigns/${id}/`, payload);
      } else {
        await api.post("/campaigns/", payload);
      }

      nav("/campaigns");
    } catch (err) {
      console.log("Save error:", err?.response?.data || err.message);

      alert(
        "Save failed: " +
          JSON.stringify(err?.response?.data || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  }

  async function convert() {
    try {
      if (!form.budget_inr) {
        alert("Enter budget first");
        return;
      }

      const res = await api.get(`/convert/?amount=${form.budget_inr}`);
      setUsd(res.data.amount_usd);
    } catch (err) {
      console.log("Convert error:", err?.response?.data || err.message);
      alert("Conversion failed");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            {mode === "edit" ? "Edit Campaign" : "Create Campaign"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Add details, budget, platform and status.
          </p>
        </div>

        <Link
          to="/campaigns"
          className="px-5 py-2.5 rounded-xl border bg-white text-sm font-black hover:bg-gray-50 transition"
        >
          ← Back
        </Link>
      </div>

      {/* Form card */}
      <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-8">
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="md:col-span-2">
            <label className="text-sm font-black text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              className="mt-2 w-full h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
              placeholder="Eg: New Product Launch"
              required
            />
          </div>

          <div>
            <label className="text-sm font-black text-gray-700">Platform</label>
            <select
              name="platform"
              value={form.platform}
              onChange={onChange}
              className="mt-2 w-full h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
              <option value="google">Google</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-black text-gray-700">
              Budget (INR)
            </label>

            <div className="mt-2 flex gap-2">
              <input
                name="budget_inr"
                value={form.budget_inr}
                onChange={onChange}
                type="number"
                className="w-full h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
                placeholder="Eg: 5000"
                required
              />

              <button
                type="button"
                onClick={convert}
                className="px-5 h-12 rounded-2xl text-sm font-black text-white
                bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg transition"
              >
                Convert
              </button>
            </div>

            {usd !== null && (
              <div className="mt-3 rounded-2xl border bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3">
                <p className="text-sm font-black text-slate-900">
                  Approx: <span className="text-indigo-700">${usd} USD</span>
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-black text-gray-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className="mt-2 w-full h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              <option value="planned">Planned</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-black text-gray-700">Start date</label>
            <input
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={onChange}
              className="mt-2 w-full h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-black text-gray-700">End date</label>
            <input
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={onChange}
              className="mt-2 w-full h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => nav("/campaigns")}
              className="px-6 py-3 rounded-2xl border bg-white text-sm font-black hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="px-7 py-3 rounded-2xl text-sm font-black text-white
              bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
