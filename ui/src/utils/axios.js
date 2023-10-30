import axios from "axios";
import verifyJWT from "./verifyJWT";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let newToken = await verifyJWT();
    config.headers["x-access-token"] = newToken;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
