import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth";

interface ProtectedRouteProps {
  requiredRole: "client" | "nurse" | "admin";
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) return <Navigate to="/auth" replace />;

  if (userProfile.role !== requiredRole) {
    const redirectMap: Record<string, string> = {
      client: "/portal/client",
      nurse: "/portal/nurse",
      admin: "/portal/admin",
    };
    return <Navigate to={redirectMap[userProfile.role] || "/"} replace />;
  }

  return <Outlet />;
}
