import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import "./index.css";
import verifyJWT from "./utils/verifyJWT";
import Analogy from "./pages/Analogy";
import SignUp from "./pages/SignUp";
import CreateTopic from "./pages/CreateTopic";
import axiosInstance from "./utils/axios";
import Notifications from "./pages/Notifications";

import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import Topic from "./pages/Topic";
import Flashcard from "./pages/Flashcard";

TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(document.getElementById("root"));

async function navInterceptor({ request }) {
  let authPaths = ["/sign-in", "/sign-up"];
  let topics, notifications, flashcards;

  const path = new URL(request.url).pathname;
  const token = await verifyJWT();

  const isAuthenticated = token != null;

  if (path != "/") {
    if (!isAuthenticated && !authPaths.includes(path)) {
      return redirect("/sign-in");
    }

    if (isAuthenticated && authPaths.includes(path)) {
      return redirect("/");
    }
  }

  if (path == "/" && isAuthenticated) {
    let response = await axiosInstance.get("topic/retrieve");

    topics = response.data["results"];
  }

  if (isAuthenticated) {
    let response = await axiosInstance.post("notifications/retrieve");
    notifications = response.data["results"];
  }

  if (isAuthenticated && path.includes("flashcards")) {
    const topicId = path.split("/")[2];

    let response = await axiosInstance.post("topic/flashcards", {
      topicId: topicId,
    });

    flashcards = response.data["results"];
  }

  return { isAuthenticated, topics, notifications, flashcards };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: navInterceptor,
  },
  {
    path: "/sign-in",
    element: <Login />,
    loader: navInterceptor,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
    loader: navInterceptor,
  },
  {
    path: "/analogy-bot",
    element: <Analogy />,
    loader: navInterceptor,
  },
  {
    path: "/create-topic",
    element: <CreateTopic />,
    loader: navInterceptor,
  },
  {
    path: "/notifications",
    element: <Notifications />,
    loader: navInterceptor,
  },
  {
    path: "/topic/:topicId",
    element: <Topic />,
    loader: navInterceptor,
  },
  {
    path: "/topic/:topicId/flashcards",
    element: <Flashcard />,
    loader: navInterceptor,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
