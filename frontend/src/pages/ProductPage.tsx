import Layout from "../layouts/Layout";
import { useEffect, useState } from "react";
import { http } from "../utils/HttpClient";
import { useHttpErrorHandler } from "../hooks/httpErrorHandler";
import { useGlobalContext } from "../contexts/GlobalContext";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import RatingSelecter from "../components/RatingSelecter";
import StaticRating from "../components/StaticRating";

type Product = {
   id: number;
   name: string;
   price: number;
   stock: number;
   picture: string;
};

type Review = {
   userId: number;
   reviewText: string;
   rating: number;
   user: { firstname: string; lastname: string };
};

export default function ProductPage() {
   const { id } = useParams();
   const { value } = useGlobalContext();
   const { enqueueSnackbar } = useSnackbar();
   const [product, setProduct] = useState<Product>();
   const [quantity, setQuantity] = useState<number>(1);
   const [showReviewModal, setShowReviewModal] = useState(false);
   const handleHttpError = useHttpErrorHandler();
   const PICTURES_URL = import.meta.env.VITE_PICTURES_URL;

   const [reviews, setReviews] = useState<Review[]>([]);
   const [reviewText, setReviewText] = useState<string>("");
   const [rating, setRating] = useState<number>(0);

   const fetchData = () => {
      http
         .get<Product>(`/products/${id}`)
         .then((response) => {
            setProduct(response.data);
         })
         .catch(handleHttpError);
      http
         .get<Review[]>(`/reviews/${id}`)
         .then((response) => {
            setReviews(response.data);
            console.log(response.data);
         })
         .catch(handleHttpError);
   };
   useEffect(fetchData, []);

   const isNotValidQuantity = quantity == null || Number.isNaN(quantity);
   const addToCart = () => {
      if (isNotValidQuantity) return;
      http
         .post(`/carts/${value?.cart?.id}`, { quantity, productId: product?.id, append: true })
         .then(() => {
            fetchData();
            enqueueSnackbar(`${quantity} items of product #${id} has been added to your cart`, { variant: "success" });
         })
         .catch(handleHttpError);
   };

   const handleReviewSubmit = () => {
      if (!reviewText || !rating) {
         enqueueSnackbar("Please provide both a rating and a review.", { variant: "error" });
         return;
      }
      if (value?.user) {
         http
            .post("/reviews", {
               userId: value.user.id,
               productId: product?.id,
               reviewText,
               rating,
            })
            .then(() => {
               enqueueSnackbar("Review submitted successfully!", { variant: "success" });
               setReviewText("");
               setRating(0);
               setShowReviewModal(false);
               fetchData();
            })
            .catch(handleHttpError);
      } else {
         enqueueSnackbar("You must be logged in to submit a review.", { variant: "error" });
      }
   };
   return (
      <Layout>
         <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Product #{id}</h1>
            <div className=" mb-6 w-full flex flex-wrap justify-between bg-white shadow-md rounded-md p-4">
               <div className="w-[350px] aspect-square bg-gray-300">
                  <img src={`${PICTURES_URL}${product?.picture}`} alt="" />
               </div>
               <div className="flex flex-col justify-between grow px-4">
                  <div>
                     <p className="text-2xl font-bold mb-6">{product?.name}</p>
                     <div className="flex items-center mb-2 gap-4">
                        <p className="text-xl font-semibold">Price :</p>
                        <p className="text-xl text-blue-700 font-semibold">{product?.price}$</p>
                     </div>
                     <div className="flex items-center mb-2 gap-4">
                        <p className="text-xl font-semibold">Items in stock :</p>
                        <p className="text-xl text-blue-700 font-semibold">{product?.stock}</p>
                     </div>
                  </div>
                  <div>
                     <p className="text-xl font-semibold mb-4">Add To Cart</p>
                     <div className="flex justify-between items-stretch">
                        <div className="flex gap-4 items-stretch">
                           <div className="flex items-center text-md font-semibold">Quantity :</div>
                           <input
                              type="number"
                              value={quantity}
                              onChange={(e) => {
                                 const value = Math.max(1, parseInt(e.target.value));
                                 setQuantity(value);
                              }}
                              className="w-[10ch] text-center border-gray-700 border-2 rounded-md"
                           />
                        </div>
                        <button onClick={addToCart} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                           Add to Cart
                        </button>
                     </div>
                     {isNotValidQuantity && <div className="text-red-500 text-sm mt-1">Please enter a valid quantity</div>}
                  </div>
               </div>
            </div>
            <div className="w-full bg-white shadow-md rounded-md p-4 mb-[80px]">
               <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-bold">Reviews</div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => setShowReviewModal(true)}>
                     add
                  </button>
               </div>
               <div className="mt-4">
                  {reviews.length > 0 ? (
                     reviews.map((review, index) => (
                        <div key={index} className="mb-2 border rounded-md p-2">
                           <p className="flex items-center justify-between">
                              <strong>{review.user.firstname + " " + review.user.lastname + " "}</strong>
                              <StaticRating rating={review.rating} />
                           </p>
                           <p>{review.reviewText}</p>
                        </div>
                     ))
                  ) : (
                     <div className="flex justify-center items-center p-10">
                        <p>No reviews yet</p>
                     </div>
                  )}
               </div>
               {showReviewModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                     <div className="bg-white p-6 rounded-md shadow-lg w-[500px]">
                        <h2 className="text-xl font-bold mb-4">Add a Review</h2>
                        <div className="mt-4">
                           <textarea
                              placeholder="Write your review"
                              className="w-full p-2 border rounded"
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                           />
                           <div className="mt-2">
                              <RatingSelecter
                                 onChange={(val) => {
                                    setRating(val);
                                 }}
                              />
                           </div>
                           <div className="mt-4 flex justify-end gap-2">
                              <button
                                 onClick={() => setShowReviewModal(false)}
                                 className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                              >
                                 cancel
                              </button>
                              <button onClick={handleReviewSubmit} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                 Submit Review
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </Layout>
   );
}
