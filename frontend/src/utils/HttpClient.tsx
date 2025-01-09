import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from "axios";

class HttpClient {
   private axiosInstance: AxiosInstance;
   private token: string | null;

   constructor(baseURL: string) {
      this.token = localStorage.getItem("jwt_token");
      this.axiosInstance = axios.create({
         baseURL,
         headers: {
            "Content-Type": "application/json",
         },
      });
      this.axiosInstance.interceptors.request.use(
         (config: InternalAxiosRequestConfig) => {
            if (this.token) {
               config.headers.set("Authorization", `Bearer ${this.token}`);
            }
            return config;
         },
         (error) => Promise.reject(error)
      );
   }

   getToken(): string | null {
      return this.token;
   }
   setToken(token: string): void {
      this.token = token;
      localStorage.setItem("jwt_token", token);
   }

   removeToken(): void {
      this.token = null;
      localStorage.removeItem("jwt_token");
   }

   get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.axiosInstance.get<T>(url, config);
   }

   post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.axiosInstance.post<T>(url, data, config);
   }

   put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.axiosInstance.put<T>(url, data, config);
   }

   patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.axiosInstance.patch<T>(url, data, config);
   }

   delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.axiosInstance.delete<T>(url, config);
   }
}

export const http = new HttpClient(import.meta.env.VITE_API_BASE_URL);
