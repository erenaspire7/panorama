import jwt_decode from "jwt-decode";
import axios from "axios";

const refreshToken = async () => {
  let payload = {};

  try {
    let response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
      payload,
      {
        withCredentials: true,
      }
    );

    return response.data["token"];
  } catch (err) {}

  return null;
};

const verifyJWT = async () => {
  let token = sessionStorage.getItem("panorama-access-token");
  let newToken = null;

  if (token != null && token != undefined) {
    try {
      var decoded = jwt_decode(token);

      if (decoded["exp"] * 1000 > Date.now()) {
        return token;
      } else {
        token = null;
      }
    } catch (err) {}
  }

  if (token == null) {
    newToken = await refreshToken();
    sessionStorage.setItem("panorama-access-token", newToken);
  }

  return newToken;
};

export default verifyJWT;
