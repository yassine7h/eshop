import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGlobalContext, User } from "../contexts/GlobalContext";
import { http } from "../utils/HttpClient";
import { useHttpErrorHandler } from "../hooks/httpErrorHandler";
import Layout from "../layouts/Layout";

type UserInfo = {
   firstname?: string;
   lastname?: string;
   password?: string;
   address?: string;
};

const MyAccountPage = () => {
   const { value, setUser } = useGlobalContext();
   const user = value.user;
   if (!user) return null;
   const defaultValues: UserInfo = {
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.address,
   };
   const [isEditing, setIsEditing] = useState(false);
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<UserInfo>({
      defaultValues: defaultValues,
   });
   const handleHttpError = useHttpErrorHandler();

   const onSubmit = (data: UserInfo) => {
      if (!user) return;
      http
         .patch(`/users/${user.id}`, data)
         .then((response) => {
            setUser(response.data as User);
            setIsEditing(false);
         })
         .catch(handleHttpError);
   };

   const handleCancel = () => {
      setIsEditing(false);
      reset(user);
   };

   if (!user) return <p>Loading user data...</p>;

   return (
      <Layout>
         <div className="max-w-md w-full mx-auto p-6 bg-white shadow-md rounded-md mt-10">
            <h1 className="w-full text-xl font-bold mb-4">My Account</h1>
            {!isEditing ? (
               <div>
                  <div className="flex">
                     <div className="font-semibold w-[100px]">Email:</div> <div> {user.email}</div>
                  </div>
                  <div className="flex">
                     <div className="font-semibold w-[100px]">Firstname:</div> <div> {user.firstname}</div>
                  </div>
                  <div className="flex">
                     <div className="font-semibold w-[100px]">Lastname:</div> <div> {user.lastname}</div>
                  </div>
                  {user.roles.includes("CLIENT") && (
                     <div className="flex">
                        <div className="font-semibold w-[100px]">Address:</div> <div> {user.address}</div>
                     </div>
                  )}
                  <div className="flex w-full justify-end">
                     <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Modify
                     </button>
                  </div>
               </div>
            ) : (
               <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                     <label className="block mb-2 font-semibold">Firstname</label>
                     <input
                        type="text"
                        {...register("firstname", { required: "Firstname should not be empty" })}
                        className="w-full px-4 py-2 border rounded-md"
                        autoComplete="off"
                     />
                     {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>}
                  </div>
                  <div className="mb-4">
                     <label className="block mb-2 font-semibold">Lastname</label>
                     <input
                        type="text"
                        {...register("lastname", { required: "Lastname should not be empty" })}
                        className="w-full px-4 py-2 border rounded-md"
                        autoComplete="off"
                     />
                     {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>}
                  </div>
                  {user.roles.includes("CLIENT") && (
                     <div className="mb-4">
                        <label className="block mb-2 font-semibold">Address</label>
                        <input
                           type="text"
                           {...register("address", { required: "Address should not be empty" })}
                           className="w-full px-4 py-2 border rounded-md"
                           autoComplete="off"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                     </div>
                  )}
                  <div className="mb-4">
                     <label className="block mb-2 font-semibold">New password</label>
                     <input type="password" {...register("password")} className="w-full px-4 py-2 border rounded-md" autoComplete="off" />
                     <p className="text-sm mt-1">Leave the password empty if you do not want to change it.</p>
                  </div>
                  <div className="mt-4 flex justify-end gap-4">
                     <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                        Cancel
                     </button>
                     <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Submit
                     </button>
                  </div>
               </form>
            )}
         </div>
      </Layout>
   );
};

export default MyAccountPage;
