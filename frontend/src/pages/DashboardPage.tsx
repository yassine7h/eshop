import { useState } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";
import { Role } from "../ProtectedRoute";
import ProductsDashboard from "../components/ProductsDashboard";
import OrdersDashboard from "../components/OrdersDashboard";
import Layout from "../layouts/Layout";

export default function DashboardPage() {
   const { value } = useGlobalContext();
   const isAdmin = value.user?.roles.includes("ADMIN" as Role);
   const [tab, setTab] = useState("orders");
   return (
      <Layout>
         <div className="w-full bg-gray-100 flex flex-col items-center p-8">
            <div className="bg-white rounded-md shadow-lg w-full max-w-5xl p-6 ">
               {isAdmin ? (
                  <>
                     <div className="flex items-center gap-1 mb-6 border-b">
                        <button onClick={() => setTab("orders")}>
                           <h2
                              className={
                                 (tab === "orders" ? "border-blue-500 " : " border-white") +
                                 " border-b text-xl text-blue-500 px-4 py-2 font-semibold hover:border-blue-500"
                              }
                           >
                              Orders
                           </h2>
                        </button>
                        <button onClick={() => setTab("products")}>
                           <h2
                              className={
                                 (tab === "products" ? "border-blue-500 " : " border-white") +
                                 " border-b text-xl text-blue-500 px-4 py-2 font-semibold hover:border-blue-500"
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
               {tab === "products" && <ProductsDashboard />}
               {tab === "orders" && <OrdersDashboard />}
            </div>
         </div>
      </Layout>
   );
}
