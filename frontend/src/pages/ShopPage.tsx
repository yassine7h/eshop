import Layout from "../layouts/Layout";
import { useEffect, useState } from "react";
import { http } from "../utils/HttpClient";
import { useHttpErrorHandler } from "../hooks/httpErrorHandler";
import { useNavigate } from "react-router-dom";

type Product = {
   id: number;
   name: string;
   price: number;
   stock: number;
   picture: string;
};

export default function ShopPage() {
   const navigate = useNavigate();
   const [products, setProducts] = useState<Product[]>([]);
   const handleHttpError = useHttpErrorHandler();
   const PICTURES_URL = import.meta.env.VITE_PICTURES_URL;

   useEffect(() => {
      http
         .get<Product[]>("/products")
         .then((response) => {
            setProducts(response.data);
         })
         .catch(handleHttpError);
   }, []);

   return (
      <Layout>
         <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Shop</h1>
            <div className="flex flex-wrap gap-6 justify-center">
               {products.length > 0 ? (
                  products.map((product) => {
                     return (
                        <div key={product.id} className="bg-white shadow-md rounded-md p-4 w-[350px]">
                           <div className="w-full aspect-square bg-gray-500 mb-2">
                              <img src={`${PICTURES_URL}${product.picture}`} alt="" />
                           </div>
                           <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                           <div className="flex justify-between">
                              <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                              <p className="text-right text-gray-600 mb-4">{product.stock} items left</p>
                           </div>
                           <button
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="w-full flex items-center justify-center py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex-grow"
                           >
                              Order
                           </button>
                        </div>
                     );
                  })
               ) : (
                  <p className="text-gray-500">No products available</p>
               )}
            </div>
         </div>
      </Layout>
   );
}
