import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CampaignList from "./pages/CampaignList";
import CampaignForm from "./pages/CampaignForm";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
        {/* ✅ Premium background blobs */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-purple-200/40 blur-3xl" />
        <div className="pointer-events-none absolute top-56 -right-40 h-[520px] w-[520px] rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-sky-200/30 blur-3xl" />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/*"
            element={
              <>
                <Navbar />

                {/* ✅ wide premium layout */}
                <main className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 py-8 relative z-10">
                  <Routes>
                    <Route path="/" element={<Navigate to="/campaigns" />} />

                    <Route
                      path="/campaigns"
                      element={
                        <ProtectedRoute>
                          <CampaignList />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/campaigns/new"
                      element={
                        <ProtectedRoute>
                          <CampaignForm mode="create" />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/campaigns/:id/edit"
                      element={
                        <ProtectedRoute>
                          <CampaignForm mode="edit" />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

