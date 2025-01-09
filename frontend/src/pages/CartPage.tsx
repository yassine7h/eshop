import Layout from "../layouts/Layout";

import { useEffect, useState } from "react";
import { http } from "../utils/HttpClient";
import { useHttpErrorHandler } from "../hooks/httpErrorHandler";
import { useSnackbar } from "notistack";
import { useGlobalContext } from "../contexts/GlobalContext";
type CartProduct = {
   id: number;
   quantity: number;
   product: {
      id: number;
      name: string;
      price: number;
      picture: string;
   };
};
type Cart = {
   id: number;
   products: CartProduct[];
};

export default function CartPage() {
   const { enqueueSnackbar } = useSnackbar();
   const { value } = useGlobalContext();
   const [cart, setCart] = useState<Cart | null>(null);
   const [address, setAddress] = useState<string>(value.user?.address || "");
   const handleHttpError = useHttpErrorHandler();
   const [overallTotal, setOverallTotal] = useState<number>(0);
   const PICTURES_URL = import.meta.env.VITE_PICTURES_URL;

   useEffect(() => {
      fetchCart();
   }, []);

   useEffect(() => {
      if (cart) {
         const total = cart.products.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
         setOverallTotal(total);
      }
   }, [cart]);

   const fetchCart = () => {
      http
         .get("/carts/mine")
         .then((response) => {
            setCart(response.data as Cart);
         })
         .catch(handleHttpError);
   };
   const handleDeleteProduct = (cartProductId: number) => {
      if (confirm("Are you sure you want to delete this product from your cart?")) deleteProduct(cartProductId);
   };
   const deleteProduct = (cartProductId: number) => {
      http
         .delete(`/carts/${cart?.id}/products/${cartProductId}`)
         .then(() => {
            fetchCart();
         })
         .catch(handleHttpError);
   };

   const updateQuantity = (productId: number, newQuantity: number) => {
      http
         .post(`/carts/${cart?.id}`, { quantity: newQuantity, productId: productId, append: true })
         .then(() => {
            fetchCart();
         })
         .catch(handleHttpError);
   };

   const reserveCart = () => {
      if (!address.trim()) {
         alert("Please provide an address before reserving the cart.");
         return;
      }
      http
         .post("/orders", {
            cartId: cart?.id,
            address,
         })
         .then(() => {
            fetchCart();
            enqueueSnackbar("Order is reserved", { variant: "success" });
         })
         .catch(handleHttpError);
   };

   return (
      <Layout>
         <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">My Cart</h1>
            {cart && cart.products.length > 0 ? (
               <>
                  <table className="w-full border-collapse border border-gray-300 mb-4">
                     <thead className="bg-gray-200">
                        <tr>
                           <th className="border border-gray-300 px-4 py-2 text-left w-[100px]"></th>
                           <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                           <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
                           <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                           <th className="border border-gray-300 px-4 py-2 text-right">Total Price</th>
                           <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {cart.products.map((item) => (
                           <tr key={item.product.id} className="hover:bg-gray-100">
                              <td className="border border-gray-300 px-4 py-2">
                                 <div className="bg-gray-500 w-[100px]">
                                    <img src={`${PICTURES_URL}${item.product.picture}`} alt="" />
                                 </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{item.product.name}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                 <div className="flex justify-between items-center">
                                    <button
                                       className="rounded-md w-7 h-8 bg-blue-500 text-white text-center font-semibold hover:bg-blue-600"
                                       onClick={() => {
                                          if (item.quantity == 1) return;
                                          updateQuantity(item.product.id, -1);
                                       }}
                                    >
                                       -
                                    </button>
                                    <div>{item.quantity}</div>
                                    <button
                                       className="rounded-md w-7 h-8 bg-blue-500 text-white text-center font-semibold hover:bg-blue-600"
                                       onClick={() => updateQuantity(item.product.id, 1)}
                                    >
                                       +
                                    </button>
                                 </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-right">${item.product.price.toFixed(2)}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">${(item.quantity * item.product.price).toFixed(2)}</td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                 <button onClick={() => handleDeleteProduct(item.product.id)} className="text-red-500 hover:text-red-700">
                                    🗑
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>

                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <label className="block mb-2 font-semibold">Address</label>
                        <input
                           type="text"
                           value={address}
                           onChange={(e) => setAddress(e.target.value)}
                           className="min-w-[500px] px-4 py-2 border rounded-md"
                        />
                     </div>
                     <div>
                        <h2 className="text-lg font-bold">Overall Total: ${overallTotal.toFixed(2)}</h2>
                     </div>
                  </div>

                  <button onClick={reserveCart} className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                     Reserve Order
                  </button>
               </>
            ) : (
               <p className="text-gray-500">Your cart is empty.</p>
            )}
         </div>
      </Layout>
   );
}
