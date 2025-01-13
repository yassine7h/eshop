import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage.tsx";
import { SnackbarProvider } from "notistack";
import DashboardPage from "./pages/DashboardPage.tsx";
import { GlobalContextProvider } from "./contexts/GlobalContext.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import MyAccountPage from "./pages/MyAccountPage.tsx";
import ShopPage from "./pages/ShopPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import OrdersPage from "./pages/OrdersPage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.tsx";

const router = createBrowserRouter([
   {
      path: "/",
      element: <Navigate to="/shop" />,
   },
   {
      path: "/auth",
      element: <AuthPage />,
   },
   {
      path: "/shop",
      element: <ProtectedRoute roles={["ADMIN", "SELLER", "CLIENT"]} component={ShopPage} />,
   },
   {
      path: "/product/:id",
      element: <ProtectedRoute roles={["ADMIN", "SELLER", "CLIENT"]} component={ProductPage} />,
   },
   {
      path: "/cart",
      element: <ProtectedRoute roles={["CLIENT"]} component={CartPage} />,
   },
   {
      path: "/orders",
      element: <ProtectedRoute roles={["CLIENT"]} component={OrdersPage} />,
   },
   {
      path: "/dashboard",
      element: <ProtectedRoute roles={["ADMIN", "SELLER"]} component={DashboardPage} />,
   },
   {
      path: "/superadmin",
      element: <ProtectedRoute roles={["SUPADMIN"]} component={SuperAdminDashboard} />,
   },
   {
      path: "/myaccount",
      element: <ProtectedRoute roles={["ADMIN", "SELLER", "CLIENT", "SUPADMIN"]} component={MyAccountPage} />,
   },
   {
      path: "/unauthorized",
      element: <h1 className="text-xl font-semibold p-3">You are not authorized to view this page</h1>,
   },
   {
      path: "*",
      element: <h1 className="text-xl font-semibold p-3">Page Not Found</h1>,
   },
]);

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <SnackbarProvider>
         <GlobalContextProvider>
            <RouterProvider router={router} />
         </GlobalContextProvider>
      </SnackbarProvider>
   </StrictMode>
);
