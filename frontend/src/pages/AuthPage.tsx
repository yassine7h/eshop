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
   role: String;
   roles: Role[];
}

type AuthFormInputs = LoginFormInputs & SignupFormInputs;

export default function AuthPage() {
   const handleHttpError = useHttpErrorHandler();
   const { setUser, setCart } = useGlobalContext();
   const navigate = useNavigate();

   const [isLogin, setIsLogin] = useState(true);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<AuthFormInputs>();

   const onSubmit: SubmitHandler<AuthFormInputs> = (data: AuthFormInputs) => {
      if (isLogin) {
         const formdata: LoginFormInputs = { email: data.email, password: data.password };
         http.post("/auth/login", formdata).then(handleAath).catch(handleHttpError);
      } else {
         const formdata: SignupFormInputs = data as SignupFormInputs;
         formdata.roles = [formdata.role.toUpperCase() as Role];
         http.post("/auth/signup", formdata).then(handleAath).catch(handleHttpError);
      }
   };
   const handleAath = (response: AxiosResponse<unknown, any>) => {
      const data = response?.data as any;
      const user: User = data.user;
      const isClient = user.roles.includes("CLIENT");
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
      } else {
         setUser(user);
         navigate("/dashboard");
      }
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

                     <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <div className="mt-1 flex space-x-4">
                           <label className="flex items-center">
                              <input type="radio" value="CLIENT" {...register("role", { required: "Role is required" })} className="mr-2" />
                              Client
                           </label>
                           <label className="flex items-center">
                              <input type="radio" value="SELLER" {...register("role", { required: "Role is required" })} className="mr-2" />
                              Seller
                           </label>
                           <label className="flex items-center">
                              <input type="radio" value="ADMIN" {...register("role", { required: "Role is required" })} className="mr-2" />
                              Admin
                           </label>
                        </div>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                     </div>
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
      </div>
   );
}
