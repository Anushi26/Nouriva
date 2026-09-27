import axios from "axios";
import { useContext, useMemo } from "react";
import { AuthContext } from "../Provider/AuthProvider";

const useAxiosSecure = () => {
  const { logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("nouriva_token");

  return useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    });

    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logoutUser();
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [token, logoutUser]);
};

export default useAxiosSecure;
