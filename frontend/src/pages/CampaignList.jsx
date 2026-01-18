import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";

const badgeClass = (status) => {
  const map = {
    planned: "bg-gray-100 text-gray-800 border-gray-200",
    running: "bg-green-50 text-green-800 border-green-200",
    paused: "bg-yellow-50 text-yellow-900 border-yellow-200",
    completed: "bg-blue-50 text-blue-900 border-blue-200",
  };
  return map[status] || "bg-gray-50 text-gray-800 border-gray-200";
};

export default function CampaignList() {
  const nav = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Search + Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  async function load() {
    try {
      setLoading(true);
      const res = await api.get("/campaigns/");
      setCampaigns(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id) {
    const ok = confirm("Delete this campaign?");
    if (!ok) return;

    try {
      await api.delete(`/campaigns/${id}/`);
      await load();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  }

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setPlatform("all");
    setMinBudget("");
    setMaxBudget("");
    setSortBy("newest");
  }

  // ✅ filtered list (UI side filtering)
  const filteredCampaigns = useMemo(() => {
    let list = [...campaigns];

    // search title
    if (search.trim()) {
      list = list.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // platform
    if (platform !== "all") {
      list = list.filter((c) => c.platform === platform);
    }

    // status
    if (status !== "all") {
      list = list.filter((c) => c.status === status);
    }

    // budget range
    if (minBudget !== "") {
      list = list.filter((c) => Number(c.budget_inr) >= Number(minBudget));
    }
    if (maxBudget !== "") {
      list = list.filter((c) => Number(c.budget_inr) <= Number(maxBudget));
    }

    // sorting
    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "budgetHigh") {
      list.sort((a, b) => Number(b.budget_inr) - Number(a.budget_inr));
    } else if (sortBy === "budgetLow") {
      list.sort((a, b) => Number(a.budget_inr) - Number(b.budget_inr));
    }

    return list;
  }, [campaigns, search, status, platform, minBudget, maxBudget, sortBy]);

  const totalBudgetFiltered = useMemo(() => {
    return filteredCampaigns.reduce((sum, c) => sum + Number(c.budget_inr), 0);
  }, [filteredCampaigns]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count++;
    if (status !== "all") count++;
    if (platform !== "all") count++;
    if (minBudget !== "") count++;
    if (maxBudget !== "") count++;
    if (sortBy !== "newest") count++;
    return count;
  }, [search, status, platform, minBudget, maxBudget, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Campaigns
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Search, filter & manage campaigns like a real product dashboard.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl text-sm font-black border bg-white hover:bg-gray-50 transition"
          >
            View Dashboard →
          </Link>

          <button
            onClick={() => nav("/campaigns/new")}
            className="px-6 py-2.5 rounded-xl text-sm font-black text-white 
            bg-gradient-to-r from-indigo-600 to-purple-600 
            shadow-md hover:shadow-lg hover:opacity-95 transition"
          >
            + Add Campaign
          </button>
        </div>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-6">
          <p className="text-sm font-black text-gray-500">Total Campaigns</p>
          <p className="text-3xl font-black mt-2 text-slate-900">
            {filteredCampaigns.length}
          </p>
          <p className="text-xs font-bold text-gray-500 mt-1">
            After filters applied
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-6">
          <p className="text-sm font-black text-gray-500">Total Budget</p>
          <p className="text-3xl font-black mt-2 text-slate-900">
            ₹ {totalBudgetFiltered.toLocaleString("en-IN")}
          </p>
          <p className="text-xs font-bold text-gray-500 mt-1">
            Based on filtered campaigns
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-6">
          <p className="text-sm font-black text-gray-500">Active Filters</p>
          <p className="text-3xl font-black mt-2 text-slate-900">
            {activeFiltersCount}
          </p>
          <p className="text-xs font-bold text-gray-500 mt-1">
            Reset to clear filters
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          {/* Search */}
          <div className="flex-1">
            <label className="text-xs font-black text-gray-600">Search Title</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaign title..."
              className="mt-2 w-full h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          {/* Platform */}
          <div className="w-full lg:w-52">
            <label className="text-xs font-black text-gray-600">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="mt-2 w-full h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              <option value="all">All</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
              <option value="google">Google</option>
            </select>
          </div>

          {/* Status */}
          <div className="w-full lg:w-52">
            <label className="text-xs font-black text-gray-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 w-full h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              <option value="all">All</option>
              <option value="planned">Planned</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Budget */}
          <div className="w-full lg:w-64">
            <label className="text-xs font-black text-gray-600">Budget Range</label>
            <div className="mt-2 flex gap-2">
              <input
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                placeholder="Min"
                className="w-1/2 h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
              />
              <input
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="Max"
                className="w-1/2 h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="w-full lg:w-56">
            <label className="text-xs font-black text-gray-600">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mt-2 w-full h-12 rounded-2xl border bg-white px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="budgetHigh">Budget High → Low</option>
              <option value="budgetLow">Budget Low → High</option>
            </select>
          </div>

          {/* Reset */}
          <div>
            <button
              onClick={resetFilters}
              className="w-full lg:w-auto px-6 h-12 rounded-2xl text-sm font-black border bg-white hover:bg-gray-50 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between">
          <p className="text-sm font-black text-gray-800">
            Showing <span className="text-indigo-700">{filteredCampaigns.length}</span>{" "}
            campaigns
          </p>

          <p className="text-xs font-bold text-gray-500">
            
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-sm font-semibold text-gray-600">
            Loading campaigns...
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="p-8 text-sm font-semibold text-gray-600">
            No campaigns match your filters.
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-white text-gray-700">
                <tr className="border-b">
                  <th className="text-left px-6 py-4 font-black">Title</th>
                  <th className="text-left px-6 py-4 font-black">Platform</th>
                  <th className="text-left px-6 py-4 font-black">Budget (₹)</th>
                  <th className="text-left px-6 py-4 font-black">Status</th>
                  <th className="text-left px-6 py-4 font-black">Dates</th>
                  <th className="text-right px-6 py-4 font-black">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCampaigns.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-indigo-50/40">
                    <td className="px-6 py-4 font-black text-slate-900">
                      {c.title}
                    </td>

                    <td className="px-6 py-4 capitalize font-semibold text-gray-700">
                      {c.platform}
                    </td>

                    <td className="px-6 py-4 font-black text-slate-900">
                      ₹ {Number(c.budget_inr).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-black ${badgeClass(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-700 font-semibold">
                      {c.start_date} {c.end_date ? `→ ${c.end_date}` : ""}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/campaigns/${c.id}/edit`}
                          className="px-4 py-2 rounded-xl border bg-white text-xs font-black hover:bg-gray-50 transition"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => onDelete(c.id)}
                          className="px-4 py-2 rounded-xl text-xs font-black text-white 
                          bg-gradient-to-r from-red-600 to-rose-600 shadow hover:opacity-95 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
