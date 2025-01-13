import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { http } from "../utils/HttpClient";
import { useHttpErrorHandler } from "../hooks/httpErrorHandler";
import { Cart, useGlobalContext, User } from "../contexts/GlobalContext";
import { useNavigate } from "react-router-dom";
import { Role } from "../ProtectedRoute";
import { AxiosResponse } from "axios";

interface LoginFormInputs {
   email: string;
   password: string;
}

interface SignupFormInputs {
   email: string;
   password: string;
   firstname: string;
   lastname: string;
   address: string;
   roles: Role[];
}

type AuthFormInputs = LoginFormInputs & SignupFormInputs;

export default function AuthPage() {
   const handleHttpError = useHttpErrorHandler();
   const { setUser, setCart } = useGlobalContext();
   const navigate = useNavigate();

   const [isLogin, setIsLogin] = useState(true);
   const [showMessage, setShowMessage] = useState(false);
   const [message, setMessage] = useState("");

   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm<AuthFormInputs>();
   const watchedRoles = watch("roles", []);
   const isClientRoleSelected = watchedRoles?.includes("CLIENT");

   const onSubmit: SubmitHandler<AuthFormInputs> = (data: AuthFormInputs) => {
      if (isLogin) {
         const formdata: LoginFormInputs = { email: data.email, password: data.password };
         http.post("/auth/login", formdata).then(handleAath).catch(handleHttpError);
      } else {
         const formdata: SignupFormInputs = {
            ...data,
            roles: data.roles.map((role) => role.toUpperCase() as Role),
         };
         http.post("/auth/signup", formdata).then(handleAath).catch(handleHttpError);
      }
   };
   const handleAath = (response: AxiosResponse<unknown, any>) => {
      const data = response?.data as any;
      if (data?.message) {
         setIsLogin(true);
         setMessage(data.message);
         setShowMessage(true);
         return;
      }
      const user: User = data.user;
      const isClient = user.roles.includes("CLIENT");
      const isSupAdmin = user.roles.includes("SUPADMIN");
      http.setToken(data.jwt_token);
      if (isClient) {
         http
            .get("/carts/mine")
            .then((response) => {
               setCart(response.data as Cart);
            })
            .finally(() => {
               setUser(user);
               navigate("/shop");
            });
         return;
      }
      setUser(user);
      if (isSupAdmin) navigate("/superadmin");
      else navigate("/dashboard");
   };

   return (
      <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
         <div className="p-8 bg-white border rounded-md shadow-lg w-96">
            <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? "Login" : "Sign Up"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                     type="email"
                     {...register("email", { required: "Email is required" })}
                     className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                     type="password"
                     {...register("password", {
                        required: isLogin ? "Password is required" : undefined,
                     })}
                     className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
               </div>
               {!isLogin && (
                  <>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                           type="text"
                           {...register("firstname", { required: "First name is required" })}
                           className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                        {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>}
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                           type="text"
                           {...register("lastname", { required: "Last name is required" })}
                           className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                        {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>}
                     </div>
                     <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Roles</label>
                        <div className="mt-1 flex border-2 rounded px-4 py-3 space-x-4 text-sm w-full justify-between">
                           <label className="flex items-center">
                              <input
                                 type="checkbox"
                                 value="CLIENT"
                                 {...register("roles", { required: "At least one role is required" })}
                                 className="mr-2"
                              />
                              Client
                           </label>
                           <label className="flex items-center">
                              <input
                                 type="checkbox"
                                 value="SELLER"
                                 {...register("roles", { required: "At least one role is required" })}
                                 className="mr-2"
                              />
                              Seller
                           </label>
                           <label className="flex items-center">
                              <input
                                 type="checkbox"
                                 value="ADMIN"
                                 {...register("roles", { required: "At least one role is required" })}
                                 className="mr-2"
                              />
                              Admin
                           </label>
                        </div>
                        {errors.roles && <p className="text-red-500 text-sm mt-1">{errors.roles.message}</p>}
                     </div>
                     {isClientRoleSelected && (
                        <div>
                           <label className="block text-sm font-medium text-gray-700">Address</label>
                           <input
                              type="text"
                              {...register("address", { required: "Address is required" })}
                              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                           />
                           {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                        </div>
                     )}
                  </>
               )}

               <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                  {isLogin ? "Login" : "Sign Up"}
               </button>
            </form>

            <p className="text-sm text-center mt-4">
               {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
               <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-medium hover:underline">
                  {isLogin ? "Sign Up" : "Login"}
               </button>
            </p>
         </div>
         {showMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
               <div className="bg-white p-6 rounded-md shadow-lg w-[500px]">
                  <h2 className="text-xl font-bold mb-4">Message</h2>
                  <div>{message}</div>
                  <div className="mt-4 flex justify-end">
                     <button
                        onClick={() => {
                           setShowMessage(false);
                        }}
                        className="mr-4 px-4 py-2 bg-green-400 hover:bg-green-500 rounded-md"
                     >
                        Ok
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
