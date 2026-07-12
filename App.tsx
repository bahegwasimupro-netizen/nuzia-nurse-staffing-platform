import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth";
import { LanguageProvider } from "./components/language";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/MainLayout";
import { LandingPage } from "./components/LandingPage";
import { ElectivePlacement } from "./components/ElectivePlacement";
import { JobOpportunities } from "./components/JobOpportunities";
import { ClientPortal } from "./components/ClientPortal";
import { NursePortal } from "./components/NursePortal";
import { AdminPortal } from "./components/AdminPortal";
import { AuthPortal } from "./components/AuthPortal";
import { PricingPage } from "./components/PricingPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/elective" element={<ElectivePlacement />} />
              <Route path="/jobs" element={<JobOpportunities />} />
              <Route path="/pricing" element={<PricingPage />} />
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
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
