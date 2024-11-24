import React, { createContext, useContext, useState } from "react";
import { http } from "../utils/HttpClient";

export interface User {
   id: string;
   firstname: string;
   lastname: string;
   email: string;
   roles: string[];
   address?: string;
}

interface GlobalContextValueType {
   user: User | null;
}

interface GlobalContextType {
   value: GlobalContextValueType;
   setUser: (user: User) => void;
   setValue: (value: GlobalContextValueType) => void;
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
   const [value, setValueState] = useState<GlobalContextValueType>({ user: null });
   const [render, setRender] = useState<Boolean>(false);

   const setValue = (value: GlobalContextValueType) => {
      setValueState(value);
   };
   const setUser = (user: User) => {
      setValueState((value) => {
         value.user = user;
         return value;
      });
   };
   const clear = () => {
      setValueState({
         user: null,
      });
   };

   (function () {
      http
         .get("/users/me")
         .then((response) => {
            const user = response?.data as User;
            setUser(user);
         })
         .finally(() => {
            setRender(true);
         });
   })();

   if (render) return <GlobalContext.Provider value={{ value, setUser, setValue, clear }}>{children}</GlobalContext.Provider>;
};
