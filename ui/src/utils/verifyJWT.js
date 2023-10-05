import jwt_decode from "jwt-decode";
import axios from "axios";

const refreshToken = async () => {
  let payload = {};

  try {
    let response = await axios.post(
      "http://localhost:4000/api/auth/refresh-token",
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
        newToken = await refreshToken();
      }
    } catch (err) {}
  } else {
    newToken = await refreshToken();
  }

  sessionStorage.setItem("panorama-access-token", newToken);

  return newToken;
};

export default verifyJWT;
