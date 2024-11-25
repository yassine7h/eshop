import Layout from "../layouts/Layout";
import { useEffect, useState } from "react";
import { http } from "../utils/HttpClient";
import { useHttpErrorHandler } from "../hooks/httpErrorHandler";
import { useGlobalContext } from "../contexts/GlobalContext";
import { useSnackbar } from "notistack";
type Product = {
   id: number;
   name: string;
   price: number;
   stock: number;
};

export default function ShopPage() {
   const { value } = useGlobalContext();
   const { enqueueSnackbar } = useSnackbar();
   const [products, setProducts] = useState<Product[]>([]);
   const handleHttpError = useHttpErrorHandler();
   const [quantities, setQuantities] = useState<{ [key: number]: string }>({});
   useEffect(() => {
      http
         .get("/products")
         .then((response) => {
            setProducts(response.data as Product[]);
            products.map((p) => {
               handleQuantityChange(p.id, "1");
            });
         })
         .catch(handleHttpError);
   }, []);

   const addToCart = (productId: number) => {
      const quantity: number = parseInt(quantities[productId]) || 1;
      http
         .post(`/carts/${value?.cart?.id}`, { quantity, productId, append: true })
         .then(() => {
            enqueueSnackbar(`Product #${productId} has been added to cart`, { variant: "success" });
         })
         .catch(handleHttpError);
   };

   const handleQuantityChange = (productId: number, value: string) => {
      setQuantities((prev) => ({
         ...prev,
         [productId]: value,
      }));
   };
   const getQuantity = (id: number) => {
      const qte = quantities[id];
      return qte !== undefined ? qte : "1";
   };

   return (
      <Layout>
         <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Shop</h1>
            <div className="flex flex-wrap gap-6 justify-center">
               {products.length > 0 ? (
                  products.map((product) => (
                     <div key={product.id} className="bg-white shadow-md rounded-md p-4 ">
                        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                        <div className="flex justify-between">
                           <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                           <div className="w-[150px]"></div>
                           <p className="text-right text-gray-600 mb-4">{product.stock} unit</p>
                        </div>
                        <div className="relative flex items-center space-x-2">
                           {!value.user?.roles.includes("CLIENT") && (
                              <div
                                 onClick={(e) => {
                                    e.stopPropagation();
                                 }}
                                 className="absolute top-0 right-0 h-full w-full z-10 bg-gray-500 rounded-md text-white"
                              ></div>
                           )}
                           <button
                              onClick={() => addToCart(product.id)}
                              className="flex items-center justify-center px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex-grow"
                           >
                              Add
                              <input
                                 onClick={(e) => {
                                    e.stopPropagation();
                                 }}
                                 value={getQuantity(product.id)}
                                 onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                 className="mx-2 border-blue-900 border-2 bg-transparent h-[4ch] w-[3ch]  text-center"
                              />
                              to Cart
                           </button>
                        </div>
                     </div>
                  ))
               ) : (
                  <p className="text-gray-500">No products available</p>
               )}
            </div>
         </div>
      </Layout>
   );
}
