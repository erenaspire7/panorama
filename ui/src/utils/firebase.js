import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axiosInstance from "./axios";
import { toast } from "react-toastify";

var firebaseConfig = {
  apiKey: "AIzaSyCk97rfItCf5OfOc2zlEzYhn2eOYN31L_Q",
  authDomain: "panorama-b0e75.firebaseapp.com",
  projectId: "panorama-b0e75",
  storageBucket: "panorama-b0e75.appspot.com",
  messagingSenderId: "205061102543",
  appId: "1:205061102543:web:38751e21e0636141b650ba",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

onMessage(messaging, (payload) => {
  toast.info(payload.notification.body, {
    theme: "colored",
    className: "text-sm",
  });
});

const requestPermission = () => {
  if (
    localStorage.getItem("fcm_id") == null ||
    localStorage.getItem("fcm_id") == undefined
  ) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey:
            "BDpvRlrNEttsJv-hcjXk_4T4uX5Eyd9nplm6RSQUCkdHUfA-RgqHw2umRveENjr8QWXR-9tZO6iLhmdn4roOjBw",
        })
          .then((currentToken) => {
            localStorage.setItem("fcm_id", currentToken);
            if (currentToken) {
              axiosInstance.post("notifications/add-device", {
                notificationToken: currentToken,
              });
            } else {
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
      }
    });
  }
};

export { requestPermission };
