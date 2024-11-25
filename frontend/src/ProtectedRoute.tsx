import React from "react";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "./contexts/GlobalContext";

interface ProtectedRouteProps {
   roles: Role[];
   component: React.ComponentType;
}
export type Role = "ADMIN" | "SELLER" | "CLIENT";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, component: Component }) => {
   const { value } = useGlobalContext();
   const user = value.user;

   const checkRoules = () => {
      return user?.roles?.some((role) => roles.includes(role as Role)) || false;
   };

   if (!user) return <Navigate to="/auth" replace />;

   if (!checkRoules()) {
      return <Navigate to="/unauthorized" replace />;
   }

   return <Component />;
};

export default ProtectedRoute;
