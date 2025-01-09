import { useEffect, useState } from "react";
import { useHttpErrorHandler } from "../hooks/httpErrorHandler";
import { http } from "../utils/HttpClient";
import { useForm } from "react-hook-form";

type ProductType = { id?: number; name: string; stock: number; price: number; picture?: string | File[] };

export default function ProductsDashboard() {
   const handleHttpError = useHttpErrorHandler();

   const [products, setProducts] = useState<ProductType[]>([]);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showModifyModal, setShowModifyModal] = useState(false);
   const [showAddModal, setShowAddModal] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
   const [selectedPicture, setSelectedPicture] = useState<string>("");
   const defaultProductValue = { id: 0, name: "", stock: 0, price: 0 };
   const {
      register,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
   } = useForm<ProductType>();

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
      resizeAndCenterImage(data?.picture?.[0] as File)
         .then((imageBase64) => {
            data.picture = imageBase64 as string;
         })
         .catch(() => {
            data.picture = undefined;
         })
         .finally(() => {
            http
               .patch(`/products/${selectedProduct?.id}`, data)
               .then(() => {
                  fetchProducts();
                  closeModals();
               })
               .catch(handleHttpError);
         });
   };
   const handleAdd = (data: ProductType) => {
      resizeAndCenterImage(data?.picture?.[0] as File).then((imageBase64) => {
         data.picture = imageBase64 as string;
         http
            .post(`/products`, data)
            .then(() => {
               fetchProducts();
               closeModals();
            })
            .catch(handleHttpError);
      });
   };
   const openDeleteModal = (product: ProductType | null) => {
      setSelectedProduct(product);
      setShowDeleteModal(true);
   };
   const openAddModal = () => {
      reset(defaultProductValue);
      setSelectedProduct(null);
      setShowAddModal(true);
   };

   const openModifyModal = (product: ProductType | null) => {
      if (!product) return;
      setSelectedProduct(product);
      reset(product);
      setShowModifyModal(true);
   };

   const closeModals = () => {
      setSelectedProduct(null);
      setSelectedPicture("");
      reset(defaultProductValue);
      setShowDeleteModal(false);
      setShowModifyModal(false);
      setShowAddModal(false);
   };
   const PICTURES_URL = import.meta.env.VITE_PICTURES_URL;
   const watchedPicture = watch("picture");
   useEffect(() => {
      if (watchedPicture && watchedPicture.length > 0) {
         resizeAndCenterImage(watchedPicture[0] as File).then((res) => {
            setSelectedPicture(res as string);
         });
      }
   }, [watchedPicture]);

   return (
      <>
         <div className="w-full flex justify-end mb-2">
            <button className="px-4 py-2 rounded-md bg-green-500 text-white" onClick={openAddModal}>
               Add
            </button>
         </div>
         <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-200">
               <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left w-[50px]">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left w-[100px]">Picture</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Stock</th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-[150px]">Actions</th>
               </tr>
            </thead>
            <tbody>
               {products.length > 0 ? (
                  products.map((product) => (
                     <tr key={product.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                        <td className="border border-gray-300 px-4 py-2">
                           <div className="bg-gray-500 w-[60px]">
                              <img src={`${PICTURES_URL}${product?.picture}`} alt="" />
                           </div>
                        </td>
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
                     <td colSpan={6} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
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
               <div className="bg-white p-6 rounded-md shadow-lg w-[500px]">
                  <h2 className="text-xl font-bold mb-4">Modify Product</h2>
                  <form onSubmit={handleSubmit(handleModify)}>
                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Picture</label>
                        <div className="flex items-end gap-2">
                           <div className="w-[130px] aspect-square bg-gray-500">
                              {selectedPicture == "" ? (
                                 <img src={`${PICTURES_URL}${selectedProduct?.picture}`} alt="" />
                              ) : (
                                 <img src={selectedPicture} alt="" />
                              )}
                           </div>
                           <input
                              type="file"
                              {...register("picture")}
                              className="w-full px-4 py-2 border rounded-md"
                              accept="image/*"
                              multiple={false}
                           />
                        </div>
                     </div>
                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Name</label>
                        <input type="text" {...register("name", { required: "Name is required" })} className="w-full px-4 py-2 border rounded-md" />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                     </div>
                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Price</label>
                        <input
                           type="number"
                           step="0.01"
                           {...register("price", { required: "Price is required", valueAsNumber: true })}
                           className="w-full px-4 py-2 border rounded-md"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                     </div>
                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Stock</label>
                        <input
                           type="number"
                           {...register("stock", { required: "Stock is required", valueAsNumber: true })}
                           className="w-full px-4 py-2 border rounded-md"
                        />
                        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
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
         {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
               <div className="bg-white p-6 rounded-md shadow-lg w-[500px]">
                  <h2 className="text-xl font-bold mb-4">Add Product</h2>
                  <form onSubmit={handleSubmit(handleAdd)}>
                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Picture</label>
                        <div className="flex items-end gap-2">
                           <div className="w-[130px] aspect-square bg-gray-500">
                              <img src={selectedPicture} alt="" />
                           </div>
                           <input
                              type="file"
                              {...register("picture", { required: "Picture is required" })}
                              className="w-full px-4 py-2 border rounded-md"
                              accept="image/*"
                              multiple={false}
                           />
                        </div>
                        {errors.picture && <p className="text-red-500 text-sm mt-1">{errors.picture.message}</p>}
                     </div>

                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Name</label>
                        <input type="text" {...register("name", { required: "Name is required" })} className="w-full px-4 py-2 border rounded-md" />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                     </div>
                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Price</label>
                        <input
                           type="number"
                           step="0.01"
                           {...register("price", { required: "Price is required", valueAsNumber: true })}
                           className="w-full px-4 py-2 border rounded-md"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                     </div>
                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Stock</label>
                        <input
                           type="number"
                           {...register("stock", { required: "Stock is required", valueAsNumber: true })}
                           className="w-full px-4 py-2 border rounded-md"
                        />
                        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
                     </div>
                     <div className="mt-4 flex justify-end">
                        <button onClick={closeModals} className="mr-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">
                           Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                           Add
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </>
   );
}
function resizeAndCenterImage(file: File) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
         const img = new Image();
         img.onload = () => {
            // Create a canvas to resize the image
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Set the desired dimensions (400x400)
            const targetWidth = 400;
            const targetHeight = 400;

            // Calculate the scaling factor
            let scaleFactor = Math.min(targetWidth / img.width, targetHeight / img.height);

            // Calculate the new image dimensions while maintaining aspect ratio
            const newWidth = img.width * scaleFactor;
            const newHeight = img.height * scaleFactor;

            // Set the canvas size
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // Calculate the position to center the image
            const offsetX = (targetWidth - newWidth) / 2;
            const offsetY = (targetHeight - newHeight) / 2;

            // Draw the image on the canvas, centered
            ctx?.drawImage(img, offsetX, offsetY, newWidth, newHeight);

            // Get the resized image as a base64 string
            const resizedBase64 = canvas.toDataURL("image/jpeg"); // You can also use 'image/png' if needed
            resolve(resizedBase64);
         };

         img.onerror = reject;
         img.src = reader.result as string; // Set the image source to the base64 data
      };

      reader.onerror = reject;
      reader.readAsDataURL(file); // Convert file to base64
   });
}
