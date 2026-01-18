import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/");
      setData(res.data);
    } catch (err) {
      console.log("Dashboard load error:", err?.response?.data || err.message);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const statusData = useMemo(() => {
    if (!data?.status_counts) return [];
    return data.status_counts.map((x) => ({
      name: x.status?.toUpperCase(),
      value: x.count,
    }));
  }, [data]);

  const platformData = useMemo(() => {
    if (!data?.platform_counts) return [];
    return data.platform_counts.map((x) => ({
      name: x.platform?.toUpperCase(),
      count: x.count,
    }));
  }, [data]);

  const trendData = useMemo(() => {
    if (!data?.trends) return [];
    return data.trends.map((t) => ({
      day: t.day,
      count: t.count,
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Live reporting based on campaigns stored in database.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            to="/campaigns"
            className="px-5 py-2.5 rounded-xl border bg-white text-sm font-black hover:bg-gray-50 transition"
          >
            ← Back to Campaigns
          </Link>
          <button
            onClick={load}
            className="px-5 py-2.5 rounded-xl text-sm font-black text-white
            bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg transition"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-6">
          <p className="text-sm font-black text-gray-500">Total Budget</p>
          <p className="text-3xl font-black mt-2 text-slate-900">
            ₹ {Number(data?.total_budget || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-xs font-bold text-gray-500 mt-1">
            All campaigns budget
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-6">
          <p className="text-sm font-black text-gray-500">Running Budget</p>
          <p className="text-3xl font-black mt-2 text-slate-900">
            ₹ {Number(data?.running_budget || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-xs font-bold text-gray-500 mt-1">
            Budget for running campaigns
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-6">
          <p className="text-sm font-black text-gray-500">Status Categories</p>
          <p className="text-3xl font-black mt-2 text-slate-900">
            {statusData.length}
          </p>
          <p className="text-xs font-bold text-gray-500 mt-1">
            Planned / Running / Paused / Completed
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Status Pie */}
        <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900">
              Campaigns by Status
            </h2>
            <span className="text-xs font-bold text-gray-500">
              Live from DB ✅
            </span>
          </div>

          {loading ? (
            <p className="text-sm font-semibold text-gray-600">Loading...</p>
          ) : statusData.length === 0 ? (
            <p className="text-sm font-semibold text-gray-600">
              No data to display.
            </p>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    innerRadius={55}
                    paddingAngle={3}
                    label
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Platform Bar */}
        <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900">
              Campaigns by Platform
            </h2>
            <span className="text-xs font-bold text-gray-500">
              Instagram / YouTube / FB / Google
            </span>
          </div>

          {loading ? (
            <p className="text-sm font-semibold text-gray-600">Loading...</p>
          ) : platformData.length === 0 ? (
            <p className="text-sm font-semibold text-gray-600">
              No data to display.
            </p>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                    {platformData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Trend Line (full width) */}
        <div className="xl:col-span-2 bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900">
              Campaign Creation Trend
            </h2>
            <span className="text-xs font-bold text-gray-500">
              campaigns created per day
            </span>
          </div>

          {loading ? (
            <p className="text-sm font-semibold text-gray-600">Loading...</p>
          ) : trendData.length === 0 ? (
            <p className="text-sm font-semibold text-gray-600">
              Not enough data for trend.
            </p>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
