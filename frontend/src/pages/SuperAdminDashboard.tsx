import Layout from "../layouts/Layout";
import { useEffect, useState } from "react";
import { useHttpErrorHandler } from "../hooks/httpErrorHandler";
import { http } from "../utils/HttpClient";

type UserRole = "ADMIN" | "USER";

type UserType = {
   id?: number;
   email: string;
   firstname: string;
   lastname: string;
   roles: UserRole[];
   isActive: boolean;
};

export default function SuperAdminDashboard() {
   const handleHttpError = useHttpErrorHandler();

   const [users, setUsers] = useState<UserType[]>([]);
   const [showActionModal, setShowActionModal] = useState(false);
   const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
   const [actionType, setActionType] = useState<"activate" | "deactivate" | null>(null);

   useEffect(() => {
      fetchUsers();
   }, []);

   const fetchUsers = () => {
      http
         .get("/users/all")
         .then((response) => {
            setUsers(response.data as UserType[]);
         })
         .catch(handleHttpError);
   };

   const handleUserAction = (user: UserType | null, action: "activate" | "deactivate") => {
      if (!user) return;
      const isActive = action === "activate";
      http
         .post(`/users/activate`, { userId: user.id, isActive })
         .then(() => {
            setShowActionModal(false);
            fetchUsers();
            closeActionModal();
         })
         .catch(handleHttpError);
   };

   const openActionModal = (user: UserType | null, action: "activate" | "deactivate") => {
      if (!user) return;
      setSelectedUser(user);
      setActionType(action);
      setShowActionModal(true);
   };

   const closeActionModal = () => {
      setSelectedUser(null);
      setActionType(null);
      setShowActionModal(false);
   };

   return (
      <>
         <Layout>
            <div className="max-w-screen-xl w-full mx-auto p-6 bg-white shadow-md rounded-md mt-10 mb-10">
               <table className="w-full border-collapse border border-gray-200">
                  <thead className="bg-gray-200">
                     <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left w-[50px]">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Roles</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {users.length > 0 ? (
                        users.map((user) => (
                           <tr key={user.id} className="">
                              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                              <td className="border border-gray-300 px-4 py-2">{user.firstname}</td>
                              <td className="border border-gray-300 px-4 py-2">{user.lastname}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                 {user.roles.map((role, index) => (
                                    <span key={index} className="px-2 py-1 rounded-full text-sm mr-1 bg-blue-100 text-blue-700">
                                       {role}
                                    </span>
                                 ))}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                 <span
                                    className={
                                       (user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700") + " px-2 py-1 rounded-full text-sm"
                                    }
                                 >
                                    {user.isActive ? "Active" : "Inactive"}
                                 </span>
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                 {user.isActive ? (
                                    <button
                                       onClick={() => openActionModal(user, "deactivate")}
                                       className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                       Deactivate
                                    </button>
                                 ) : (
                                    <button
                                       onClick={() => openActionModal(user, "activate")}
                                       className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                    >
                                       Activate
                                    </button>
                                 )}
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={7} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                              No users found
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>

               {/* Confirmation Modal */}
               {showActionModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                     <div className="bg-white p-6 rounded-md shadow-lg w-[500px]">
                        <h2 className="text-xl font-bold mb-4">{actionType === "activate" ? "Activate" : "Deactivate"} User Account</h2>
                        <p>
                           Are you sure you want to {actionType === "activate" ? "activate" : "deactivate"} the account#{selectedUser?.id} for{" "}
                           <span className="font-semibold">
                              {selectedUser?.firstname} {selectedUser?.lastname}
                           </span>
                           ?
                        </p>
                        <div className="mt-4 flex justify-between">
                           <button onClick={closeActionModal} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">
                              Cancel
                           </button>
                           <button
                              onClick={() => handleUserAction(selectedUser, actionType!)}
                              className={
                                 "px-4 py-2 text-white rounded-md " +
                                 (actionType === "activate" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600")
                              }
                           >
                              Confirm {actionType === "activate" ? "Activation" : "Deactivation"}
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </Layout>
      </>
   );
}
