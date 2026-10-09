import { useGetProfileQuery } from "@/redux/api/apiSlice";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { data, isLoading, isError } = useGetProfileQuery();
  let user = data?.user;

  if (isLoading) return null;

  if (isError || !user) return <Navigate to="/auth" replace />;

  if (!user.isAdmin || user.role === "User") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
