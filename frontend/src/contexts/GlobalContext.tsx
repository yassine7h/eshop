import React, { createContext, useContext, useState } from "react";
import { http } from "../utils/HttpClient";

type Product = { id?: number; name: string; stock: number; price: number };

export interface Cart {
   id: number;
   products: Product[];
}

export interface User {
   id: number;
   firstname: string;
   lastname: string;
   email: string;
   roles: string[];
   address?: string;
}

interface GlobalContextValueType {
   user: User | null;
   cart: Cart | null;
}

interface GlobalContextType {
   value: GlobalContextValueType;
   setUser: (user: User) => void;
   setCart: (value: Cart) => void;
   clear: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = (): GlobalContextType => {
   const context = useContext(GlobalContext);
   if (!context) {
      throw new Error("useUserContext must be used within a UserProvider");
   }
   return context;
};

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [value, setValueState] = useState<GlobalContextValueType>({ user: null, cart: null });
   const [render, setRender] = useState<Boolean>(false);

   const setUser = (user: User) => {
      setValueState((value) => {
         value.user = user;
         return value;
      });
   };
   const setCart = (cart: Cart) => {
      setValueState((value) => {
         value.cart = cart;
         return value;
      });
   };
   const clear = () => {
      setValueState({
         user: null,
         cart: null,
      });
   };

   (function () {
      http
         .get("/users/me")
         .then((response) => {
            const user = response?.data as User;
            const isClient = user.roles.includes("CLIENT");
            if (isClient) {
               http.get("/carts/mine").then((response) => {
                  setCart(response.data as Cart);
               });
            }
            setUser(user);
         })
         .finally(() => {
            setRender(true);
         });
   })();

   if (render) return <GlobalContext.Provider value={{ value, setUser, setCart, clear }}>{children}</GlobalContext.Provider>;
};
