import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from './Context/UserContext'; // Ajusta la ruta a tu context

export default function AdminRoute() {
  const { user, isAdmin } = useUser();

  // 1. Si no hay usuario autenticado, mandar al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si hay usuario pero NO es admin, denegar acceso y mandar al Home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 3. Si es Admin, permite ver las rutas hijas (AdminDashboard)
  return <Outlet />;
}