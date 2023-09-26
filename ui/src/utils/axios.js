import axios from "axios";
import verifyJWT from "./verifyJWT";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/",
  headers: {
    "x-access-token": sessionStorage.getItem("panorama-access-token"),
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // Refresh Token
    let token = config.headers["x-access-token"];

    if (token != null || token != undefined) {
      let newToken = await verifyJWT(token);

      config.headers["x-access-token"] = newToken;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
