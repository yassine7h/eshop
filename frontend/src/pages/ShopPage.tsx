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

type Review = {
   userId: number;
   reviewText: string;
   rating: number;
 };

export default function ShopPage() {
  const { value } = useGlobalContext();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const handleHttpError = useHttpErrorHandler();
  const [quantities, setQuantities] = useState<{ [key: number]: string }>({});
  
  // Review state
  const [reviews, setReviews] = useState<{ [key: number]: Review[] }>({}); // State for reviews
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
   http
  .get<Product[]>("/products")
  .then((response) => {
    setProducts(response.data);
    response.data.forEach((product: Product) => {
      http
        .get<Review[]>(`/reviews/${product.id}`)
        .then((response) => {
          setReviews((prevReviews) => ({
            ...prevReviews,
            [product.id]: response.data,
          }));
        })
        .catch((error) => enqueueSnackbar(error.message, { variant: "error" }));
    });
  })
  .catch(handleHttpError);

 }, []); // Empty dependency array to run only once
 

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
    return quantities[id] || "1";
  };

  const handleReviewSubmit = (productId: number) => {
   console.log("Review Text: ", reviewText);  // Check if it's populated
   console.log("Rating: ", rating);  // Check if it's populated
    if (!reviewText || !rating) {
      enqueueSnackbar("Please provide both a rating and a review.", { variant: "error" });
      return;
    }

    if (value?.user) {
      http
        .post("/reviews", {
          userId: value.user.id,
          productId,
          reviewText,
          rating,
        })
        .then(() => {
          enqueueSnackbar("Review submitted successfully!", { variant: "success" });
          setReviewText("");  // Clear review text after submission
          setRating(0);  // Reset rating
        })
        .catch(handleHttpError);
    } else {
      enqueueSnackbar("You must be logged in to submit a review.", { variant: "error" });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Shop</h1>
        <div className="flex flex-wrap gap-6 justify-center">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-white shadow-md rounded-md p-4">
                <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                <div className="flex justify-between">
                  <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                  <div className="w-[150px]"></div>
                  <p className="text-right text-gray-600 mb-4">{product.stock} unit</p>
                </div>
                <div className="relative flex items-center space-x-2">
                  {!value?.user?.roles.includes("CLIENT") && (
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

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Reviews</h3>
                  {reviews[product.id] && reviews[product.id].length > 0 ? (
                     reviews[product.id].map((review, index) => (
                        <div key={index} className="mb-2">
                        <p><strong>Rating:</strong> {review.rating} stars</p>
                        <p>{review.reviewText}</p>
                        </div>
                     ))
                  ) : (
                     <p>No reviews yet</p>
                  )}
                  </div>
                {/* Review Section */}
                {value?.user && (
                  <div className="mt-4">
                    <textarea
                      placeholder="Write your review"
                      className="w-full p-2 border rounded"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <div className="flex mt-2 items-center">
                      <label className="mr-2">Rating:</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="p-2 border rounded"
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <option key={star} value={star}>
                            {star}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleReviewSubmit(product.id)}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Submit Review
                    </button>
                  </div>
                )}
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