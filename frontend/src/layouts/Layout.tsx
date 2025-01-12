import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/logoutHandler";
import { useState, useEffect, useRef } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { useGlobalContext } from "../contexts/GlobalContext";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
   const { value } = useGlobalContext();
   const navigate = useNavigate();
   const logout = useLogout();
   const role = {
      isAdmin: value.user?.roles.includes("ADMIN"),
      isSeller: value.user?.roles.includes("SELLER"),
      isClient: value.user?.roles.includes("CLIENT"),
   };
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   const toggleDropdown = () => {
      setDropdownOpen((prev) => !prev);
   };

   const logoutHandler = () => {
      logout();
   };

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   return (
      <div className="bg-gray-100 flex flex-col">
         <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
            <div className="flex items-center">
               <div className="text-xl font-bold">EShop</div>
            </div>
            <div className="flex gap-6 items-center">
               <div className="flex gap-3">
                  <div
                     onClick={() => navigate("/shop")}
                     className="hover:bg-blue-400 border-2 cursor-pointer border-white bo px-4 py-2 flex items-center justify-center rounded-md font-semibold"
                  >
                     Shop
                  </div>
                  <div
                     onClick={() => navigate("/cart")}
                     className="hover:bg-blue-400 border-2 cursor-pointer border-white bo px-4 py-2 flex items-center justify-center rounded-md font-semibold"
                  >
                     My Cart
                  </div>
                  <div
                     onClick={() => navigate("/orders")}
                     className="hover:bg-blue-400 border-2 cursor-pointer border-white bo px-4 py-2 flex items-center justify-center rounded-md font-semibold"
                  >
                     My Orders
                  </div>
                  {(role.isAdmin || role.isSeller) && (
                     <div
                        onClick={() => navigate("/dashboard")}
                        className="hover:bg-blue-400 border-2 cursor-pointer border-white bo px-4 py-2 flex items-center justify-center rounded-md font-semibold"
                     >
                        Dashboard
                     </div>
                  )}
               </div>
               <div className="relative flex gap-4 items-center justify-center" ref={dropdownRef}>
                  <button onClick={toggleDropdown} className="focus:outline-none flex items-center gap-2">
                     <BsPersonCircle className="w-10 h-10 hover:bg-blue-400 border-white rounded-full" />
                  </button>

                  {dropdownOpen && (
                     <ul
                        onClick={() => {
                           setDropdownOpen(false);
                        }}
                        className="dropdown-menu border absolute right-0 top-[50px] mt-2 w-40 bg-white rounded-md shadow-lg text-gray-700 z-10"
                     >
                        <li>
                           <Link to="/myaccount" className="font-semibold block px-4 py-2 rounded-md hover:bg-gray-200">
                              My Account
                           </Link>
                        </li>
                        <li>
                           <button onClick={logoutHandler} className="font-semibold block w-full text-left px-4 py-2 hover:bg-gray-200">
                              Logout
                           </button>
                        </li>
                     </ul>
                  )}
               </div>
            </div>
         </nav>
         <main>{children}</main>
      </div>
   );
}