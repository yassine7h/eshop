import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage.tsx";
import { SnackbarProvider } from "notistack";
import DashboardPage from "./pages/DashboardPage.tsx";
import { GlobalContextProvider } from "./contexts/GlobalContext.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Layout from "./layouts/Layout.tsx";
import MyAccountPage from "./pages/MyAccountPage.tsx";

const router = createBrowserRouter([
   {
      path: "/auth",
      element: <AuthPage />,
   },
   {
      path: "/",
      element: <Layout />,
      children: [
         {
            path: "dashboard",
            element: <ProtectedRoute roles={["ADMIN", "SELLER"]} component={DashboardPage} />,
         },
         {
            path: "myaccount",
            element: <ProtectedRoute roles={["ADMIN", "SELLER", "CLIENT"]} component={MyAccountPage} />,
         },
      ],
   },
   {
      path: "/unauthorized",
      element: <h1>You are not authorized to view this page</h1>,
   },
   {
      path: "*",
      element: <h1>Page Not Found</h1>,
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
