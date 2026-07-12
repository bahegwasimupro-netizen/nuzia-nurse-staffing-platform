import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth";
import { LanguageProvider } from "./components/language";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/MainLayout";

const LandingPage = lazy(() => import("./components/LandingPage").then(m => ({ default: m.LandingPage })));
const ElectivePlacement = lazy(() => import("./components/ElectivePlacement").then(m => ({ default: m.ElectivePlacement })));
const JobOpportunities = lazy(() => import("./components/JobOpportunities").then(m => ({ default: m.JobOpportunities })));
const ClientPortal = lazy(() => import("./components/ClientPortal").then(m => ({ default: m.ClientPortal })));
const NursePortal = lazy(() => import("./components/NursePortal").then(m => ({ default: m.NursePortal })));
const AdminPortal = lazy(() => import("./components/AdminPortal").then(m => ({ default: m.AdminPortal })));
const AuthPortal = lazy(() => import("./components/AuthPortal").then(m => ({ default: m.AuthPortal })));
const PricingPage = lazy(() => import("./components/PricingPage").then(m => ({ default: m.PricingPage })));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./components/TermsOfService").then(m => ({ default: m.TermsOfService })));
const TNMCCompliance = lazy(() => import("./components/TNMCCompliance").then(m => ({ default: m.TNMCCompliance })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400 font-medium">Nuzia</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/elective" element={<ElectivePlacement />} />
                <Route path="/jobs" element={<JobOpportunities />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/compliance" element={<TNMCCompliance />} />
              </Route>
              <Route path="/auth" element={<AuthPortal onClose={() => window.location.href = "/"} />} />
              <Route element={<ProtectedRoute requiredRole="client" />}>
                <Route path="/portal/client" element={<ClientPortal />} />
              </Route>
              <Route element={<ProtectedRoute requiredRole="nurse" />}>
                <Route path="/portal/nurse" element={<NursePortal />} />
              </Route>
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/portal/admin" element={<AdminPortal />} />
              </Route>
            </Routes>
          </Suspense>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
