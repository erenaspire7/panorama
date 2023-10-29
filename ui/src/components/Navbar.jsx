import { ArrowRightIcon } from "@heroicons/react/24/solid";
import {
  BoltIcon,
  PlusIcon,
  FolderOpenIcon,
  LightBulbIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";

import Button from "./Button";
import { useNavigate, useLoaderData, useLocation } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import axiosInstance from "../utils/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const path = useLocation();

  const { isAuthenticated, notifications } = useLoaderData();

  const isLanding = !isAuthenticated && path.pathname == "/";

  const createLinks = [
    {
      icon: <LightBulbIcon className="h-4 w-4 mr-2" />,
      text: "Topic",
      onClick: () => navigate("/create-topic"),
    },
    {
      icon: <FolderOpenIcon className="h-4 w-4 mr-2" />,
      text: "Folder",
    },
  ];

  const profileLinks = [
    {
      icon: <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />,
      text: "Sign Out",
      onClick: async () => {
        await axiosInstance.post("auth/sign-out");
        sessionStorage.removeItem("panorama-access-token");
        await navigate("/");
      },
    },
  ];

  return (
    <div
      className={`${
        isLanding ? "fixed" : "sticky "
      } bg-white flex w-full items-center justify-between py-4 px-8 lg:px-16 shadow-md top-0`}
      style={{
        zIndex: 1100,
      }}
    >
      <h1
        className="font-bold text-lg hover:cursor-pointer"
        onClick={() => navigate("/")}
      >
        Panorama
      </h1>

      {!isAuthenticated ? (
        <div className="flex space-x-4 lg:space-x-8 text-xs">
          <button
            className={`${
              ["/sign-in", "/sign-up"].includes(path.pathname) ? "hidden" : ""
            }`}
            onClick={() => navigate("/sign-in")}
          >
            Log In
          </button>

          <Button
            icon={<ArrowRightIcon className="h-3 w-3" />}
            text={`${path.pathname == "/sign-up" ? "Sign In" : "Join Now"} `}
            textSize="text-xs"
            onClick={() => {
              path.pathname == "/sign-up"
                ? navigate("/sign-in")
                : navigate("/sign-up");
            }}
          ></Button>
        </div>
      ) : (
        <div className="flex space-x-8 text-xs items-center">
          <Button
            icon={<BoltIcon className="h-3 w-3" />}
            text="AnalogyBot"
            textSize="text-xs"
            onClick={() => navigate("/analogy-bot")}
          ></Button>

          <DropdownMenu
            menuButton={
              <div className="relative">
                <Menu.Button className="w-full bg-white flex border-2 border-black py-2 px-4 space-x-2 z-50 relative items-center ">
                  <PlusIcon className="h-4 w-4" />
                </Menu.Button>
                <div className="bg-black w-full h-full absolute top-1 left-1 z-0"></div>
              </div>
            }
            links={createLinks}
          />

          <button
            className="relative"
            onClick={() => navigate("/notifications")}
          >
            <BellIcon className="h-5 w-5" />
            {notifications.length > 0 ? (
              <div className="top-0 right-0 absolute h-2 w-2 bg-teal-500 rounded-full"></div>
            ) : (
              <></>
            )}
          </button>

          <DropdownMenu
            menuButton={
              <div className="relative">
                <Menu.Button className="rounded-full bg-teal-500 w-9 h-9 "></Menu.Button>
              </div>
            }
            links={profileLinks}
          />
        </div>
      )}
    </div>
  );
}
