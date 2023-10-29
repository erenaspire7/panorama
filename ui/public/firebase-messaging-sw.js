importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);


var firebaseConfig = {
  apiKey: "AIzaSyCk97rfItCf5OfOc2zlEzYhn2eOYN31L_Q",
  authDomain: "panorama-b0e75.firebaseapp.com",
  projectId: "panorama-b0e75",
  storageBucket: "panorama-b0e75.appspot.com",
  messagingSenderId: "205061102543",
  appId: "1:205061102543:web:38751e21e0636141b650ba",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
