import { useEffect, useState } from "react";
import { useHttpErrorHandler } from "../hooks/httpErrorHandler";
import { http } from "../utils/HttpClient";
import { useForm } from "react-hook-form";

type ProductType = { id?: number; name: string; stock: number; price: number };

export default function AdminDashboardPage() {
   const handleHttpError = useHttpErrorHandler();

   const [products, setProducts] = useState<ProductType[]>([]);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showModifyModal, setShowModifyModal] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

   const { register, handleSubmit, reset } = useForm<ProductType>();

   useEffect(() => {
      fetchProducts();
   }, []);

   const fetchProducts = () => {
      http
         .get("/products")
         .then((response) => {
            setProducts(response.data as ProductType[]);
         })
         .catch(handleHttpError);
   };

   const handleDelete = (productId: number | undefined) => {
      http
         .delete(`/products/${productId}`)
         .then(() => {
            setShowDeleteModal(false);
            fetchProducts();
         })
         .catch(handleHttpError);
   };

   const handleModify = (data: ProductType) => {
      http
         .patch(`/products/${selectedProduct?.id}`, data)
         .then(() => {
            setShowModifyModal(false);
            fetchProducts();
         })
         .catch(handleHttpError);
   };

   const openDeleteModal = (product: ProductType | null) => {
      setSelectedProduct(product);
      setShowDeleteModal(true);
   };

   const openModifyModal = (product: ProductType | null) => {
      if (!product) return;
      setSelectedProduct(product);
      reset(product);
      setShowModifyModal(true);
   };

   const closeModals = () => {
      setSelectedProduct(null);
      setShowDeleteModal(false);
      setShowModifyModal(false);
   };

   return (
      <>
         <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-200">
               <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Stock</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
               </tr>
            </thead>
            <tbody>
               {products.length > 0 ? (
                  products.map((product) => (
                     <tr key={product.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                        <td className="border border-gray-300 px-4 py-2">${product.price.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                           <button onClick={() => openModifyModal(product)} className="text-blue-500 hover:text-blue-700 mx-2">
                              ✎
                           </button>
                           <button onClick={() => openDeleteModal(product)} className="text-red-500 hover:text-red-700 mx-2">
                              🗑
                           </button>
                        </td>
                     </tr>
                  ))
               ) : (
                  <tr>
                     <td colSpan={5} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                        No products found
                     </td>
                  </tr>
               )}
            </tbody>
         </table>

         {/* Modals */}
         {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
               <div className="bg-white p-6 rounded-md shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Delete Product</h2>
                  <p>Are you sure you want to delete {selectedProduct?.name}?</p>
                  <div className="mt-4 flex justify-end">
                     <button onClick={closeModals} className="mr-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">
                        Cancel
                     </button>
                     <button
                        onClick={() => handleDelete(selectedProduct?.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                     >
                        Delete
                     </button>
                  </div>
               </div>
            </div>
         )}

         {showModifyModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
               <div className="bg-white p-6 rounded-md shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Modify Product</h2>
                  <form onSubmit={handleSubmit(handleModify)}>
                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Name</label>
                        <input type="text" {...register("name", { required: "Name is required" })} className="w-full px-4 py-2 border rounded-md" />
                     </div>
                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Price</label>
                        <input
                           type="number"
                           step="0.01"
                           {...register("price", { required: "Price is required", valueAsNumber: true })}
                           className="w-full px-4 py-2 border rounded-md"
                        />
                     </div>
                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Stock</label>
                        <input
                           type="number"
                           {...register("stock", { required: "Stock is required", valueAsNumber: true })}
                           className="w-full px-4 py-2 border rounded-md"
                        />
                     </div>
                     <div className="mt-4 flex justify-end">
                        <button onClick={closeModals} className="mr-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">
                           Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                           Save Changes
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </>
   );
}
