import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

export default function Topic() {
  const path = useLocation();
  const navigate = useNavigate();
  const id = path.pathname.split("/")[2];

  const validate = async (url) => {
    try {
      let checkFlashcards = await axiosInstance.post("topic/flashcards", {
        topicId: id,
      });

      let checkQuestions = await axiosInstance.post("topic/questions", {
        topicId: id,
      });

      if (checkFlashcards.status == 200 && checkQuestions.status == 200) {
        navigate(url);
      }
    } catch (err) {
      toast.info("Content is still being generated. Please be patient.", {
        theme: "colored",
        className: "text-sm",
      });
    }
  };

  return (
    <Layout>
      <div className="pt-16 w-full">
        <h1 className="font-bold text-3xl px-20">
          Explore Today's Study Choices.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 px-20 pb-20">
          <div className="grid gap-4">
            <div
              className="relative cursor-pointer"
              onClick={async () => await validate(`/topic/${id}/flashcards`)}
            >
              <div className="h-full bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-teal-500">
                <EllipsisHorizontalIcon className="h-6 w-6" />
                <p className="text-lg">Flashcards</p>
              </div>
              <div
                className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
              ></div>
            </div>
          </div>
          <div className="grid gap-4">
            <div
              className="relative cursor-pointer"
              onClick={async () => await validate(`/topic/${id}/quiz`)}
            >
              <div className="h-full bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-teal-500">
                <EllipsisHorizontalIcon className="h-6 w-6" />
                <p className="text-lg">Quizzes</p>
              </div>
              <div
                className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
              ></div>
            </div>
            <div
              className=" relative cursor-pointer"
              onClick={async () => await validate(`/topic/${id}/report`)}
            >
              <div className="h-full bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-teal-500">
                <EllipsisHorizontalIcon className="h-6 w-6" />
                <p className="text-lg">View Report</p>
              </div>
              <div
                className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
              ></div>
            </div>
          </div>
          <div className="grid gap-4">
            <div
              className="relative cursor-pointer"
              onClick={async () => await validate(`/topic/${id}/match`)}
            >
              <div className="h-full bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-teal-500">
                <EllipsisHorizontalIcon className="h-6 w-6" />
                <p className="text-lg">Match-Mode</p>
              </div>
              <div
                className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
              ></div>
            </div>
            <div
              className="relative cursor-pointer"
              onClick={async () => await validate(`/topic/${id}/write`)}
            >
              <div className="h-full bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-teal-500">
                <EllipsisHorizontalIcon className="h-6 w-6" />
                <p className="text-lg">Write-Mode</p>
              </div>
              <div
                className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
              ></div>
            </div>
            <div
              className="relative cursor-pointer"
              onClick={() =>
                navigate(`/topic/${id}/edit-notification-schedule`)
              }
            >
              <div className="h-full bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-teal-500">
                <EllipsisHorizontalIcon className="h-6 w-6" />
                <p className="text-lg">Edit Spaced Reminders</p>
              </div>
              <div
                className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
