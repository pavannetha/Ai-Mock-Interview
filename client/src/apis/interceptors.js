import axios from "axios";
import { toast } from "react-toastify";

export const api = axios.create({ baseURL: `http://localhost:4000` });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (err) => {
    const errMessage = err?.response?.data?.message;

    if (
      err.status == 401 &&
      (errMessage == "Invalid Token" || errMessage == "Token Expired")
    ) {
      localStorage.clear();
      window.location.href = "http://localhost:5173/login";
      toast.error(errMessage);
      return;
    }
    return Promise.reject(err);
  },
);
