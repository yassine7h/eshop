import { Link, Outlet } from "react-router-dom";
import useLogout from "../hooks/logoutHandler";
import { useState, useEffect, useRef } from "react";
import { BsPersonCircle } from "react-icons/bs";

export default function Layout() {
   const logout = useLogout();

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
                  <div className="hover:bg-blue-400 border-2 border-white bo px-4 py-2 flex items-center justify-center rounded-md font-semibold">
                     <Link to="/shop">Shop</Link>
                  </div>
                  {/* <div className="hover:bg-blue-400 border-2 border-white bo px-4 py-2 flex items-center justify-center rounded-md font-semibold">
                     <Link to="/dashboard">Dashboard</Link>
                  </div> */}
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
                        className="dropdown-menu absolute right-0 top-[50px] mt-2 w-40 bg-white rounded-md shadow-lg text-gray-700 z-10"
                     >
                        <li>
                           <Link to="/dashboard" className="block px-4 py-2 rounded-md hover:bg-gray-200">
                              Dashboard
                           </Link>
                        </li>
                        <li>
                           <Link to="/myaccount" className="block px-4 py-2 rounded-md hover:bg-gray-200">
                              My Account
                           </Link>
                        </li>
                        <li>
                           <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                              Logout
                           </button>
                        </li>
                     </ul>
                  )}
               </div>
            </div>
         </nav>

         <Outlet />
      </div>
   );
}