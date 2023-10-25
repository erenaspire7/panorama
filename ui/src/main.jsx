import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import en from "javascript-time-ago/locale/en.json";
import TimeAgo from "javascript-time-ago";
// import { requestPermission } from "./../public/firebase-messaging-sw";

import "./index.css";
import verifyJWT from "./utils/verifyJWT";
import axiosInstance from "./utils/axios";
import { shuffle } from "./utils/helper";
import { requestPermission } from "./utils/firebase";

import Analogy from "./pages/Analogy";
import SignUp from "./pages/SignUp";
import CreateTopic from "./pages/CreateTopic";
import Notifications from "./pages/Notifications";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Topic from "./pages/Topic";
import Flashcard from "./pages/Flashcard";
import MatchMode from "./pages/MatchMode";
import WriteMode from "./pages/WriteMode";
import Quiz from "./pages/Quiz";
import Report from "./pages/Report";

import Settings from "./pages/Settings";
import EditNotificationSchedules from "./pages/EditNotificationSchedules";

TimeAgo.addDefaultLocale(en);
const root = ReactDOM.createRoot(document.getElementById("root"));

async function navInterceptor({ request }) {
  let authPaths = ["/sign-in", "/sign-up"];
  let topics,
    notifications,
    flashcards,
    terms,
    definitions,
    questions,
    analogyHistory,
    title,
    schedules,
    reportData;

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
    requestPermission();

    let response = await axiosInstance.get("topic/retrieve");

    topics = response.data["results"];
  }

  if (isAuthenticated) {
    let response = await axiosInstance.post("notifications/retrieve");
    notifications = response.data["results"];
  }

  if (isAuthenticated && path.includes("analogy-bot")) {
    let response = await axiosInstance.post("analogy/history");
    analogyHistory = response.data;
  }

  if (
    isAuthenticated &&
    (path.includes("flashcards") || path.includes("match"))
  ) {
    const topicId = path.split("/")[2];

    let response = await axiosInstance.post("topic/flashcards", {
      topicId: topicId,
    });

    flashcards = response.data["results"];
    title = response.data["title"];

    terms = flashcards.map((el) => el["term"]);
    definitions = flashcards.map((el) => el["definition"]);

    shuffle(terms);
    shuffle(definitions);
  }

  if (isAuthenticated && path.includes("write")) {
    const topicId = path.split("/")[2];

    let response = await axiosInstance.post("topic/questions", {
      topicId: topicId,
      mode: "write",
    });

    questions = response.data["results"];
    title = response.data["title"];
  }

  if (isAuthenticated && path.includes("edit-notification-schedule")) {
    const topicId = path.split("/")[2];

    let response = await axiosInstance.post("topic/retrieve-schedules", {
      topicId: topicId,
    });

    schedules = response.data["results"];
    title = response.data["title"];
  }

  if (isAuthenticated && path.includes("report")) {
    const topicId = path.split("/")[2];

    let response = await axiosInstance.post("topic/generate-report", {
      topicId: topicId,
    });

    reportData = response.data;
  }

  if (isAuthenticated && path.includes("quiz")) {
    const topicId = path.split("/")[2];

    let response = await axiosInstance.post("topic/questions", {
      topicId: topicId,
      mode: "quiz",
    });

    questions = response.data["results"];
  }

  return {
    isAuthenticated,
    topics,
    notifications,
    flashcards,
    terms,
    definitions,
    questions,
    analogyHistory,
    title,
    schedules,
    reportData,
  };
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
  {
    path: "/topic/:topicId/match",
    element: <MatchMode />,
    loader: navInterceptor,
  },
  {
    path: "/topic/:topicId/write",
    element: <WriteMode />,
    loader: navInterceptor,
  },
  {
    path: "/topic/:topicId/quiz",
    element: <Quiz />,
    loader: navInterceptor,
  },
  {
    path: "/topic/:topicId/edit-notification-schedule",
    element: <EditNotificationSchedules />,
    loader: navInterceptor,
  },
  {
    path: "/topic/:topicId/report",
    element: <Report />,
    loader: navInterceptor,
  },
  {
    path: "/settings",
    element: <Settings />,
    loader: navInterceptor,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
