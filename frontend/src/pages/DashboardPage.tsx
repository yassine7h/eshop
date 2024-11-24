import { useState } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";
import { Role } from "../ProtectedRoute";
import AdminDashboardPage from "./AdminDashboardPage";
import SellerDashboardPage from "./SellerDashboardPage";

export default function DashboardPage() {
   const { value } = useGlobalContext();
   const isAdmin = value.user?.roles.includes("ADMIN" as Role);
   const [tab, setTab] = useState("orders");
   return (
      <div className="w-screen bg-gray-100 flex flex-col items-center p-8">
         <div className="bg-white rounded-md shadow-lg w-full max-w-5xl p-6">
            {isAdmin ? (
               <>
                  <div className="flex items-center gap-3 mb-4">
                     <button onClick={() => setTab("orders")}>
                        <h2
                           className={
                              (tab === "orders" ? "border-blue-500 " : "border-blue-200 ") +
                              "text-xl text-blue-500 rounded-md px-2 font-semibold border-2"
                           }
                        >
                           Orders
                        </h2>
                     </button>
                     <button onClick={() => setTab("products")}>
                        <h2
                           className={
                              (tab === "products" ? "border-blue-500 " : "border-blue-200 ") +
                              "text-xl text-blue-500 rounded-md px-2 font-semibold border-2"
                           }
                        >
                           Products
                        </h2>
                     </button>
                  </div>
               </>
            ) : (
               <h2 className="text-xl font-semibold mb-4">Orders</h2>
            )}
            {tab === "products" && <AdminDashboardPage />}
            {tab === "orders" && <SellerDashboardPage />}
         </div>
      </div>
   );
}
