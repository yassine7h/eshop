import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../utils/HttpClient";
import { useGlobalContext } from "../contexts/GlobalContext";

const useLogout = () => {
   const navigate = useNavigate();
   const { clear } = useGlobalContext();

   const logout = useCallback(() => {
      http.removeToken();
      clear();
      navigate("/auth", { replace: true });
   }, [navigate]);

   return logout;
};

export default useLogout;
