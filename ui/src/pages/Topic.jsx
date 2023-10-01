import { useLoaderData, useLocation, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

export default function Topic() {
  const path = useLocation();
  const navigate = useNavigate();

  const id = path.pathname.split("/")[2];

  return (
    <Layout>
      <div className="pt-12 px-20 w-3/4 mx-auto">
        <h1 className="font-bold text-3xl">What will you like to do today?</h1>

        <div className="grid grid-cols-4 gap-4 pt-4">
          <div className="relative cursor-pointer">
            <div className="h-full bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-emerald-500">
              <EllipsisHorizontalIcon className="h-6 w-6" />
              <p className="text-lg">Quizzes</p>
            </div>
            <div
              className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
            ></div>
          </div>
          <div
            className="h-64 relative cursor-pointer"
            onClick={() => navigate(`/topic/${id}/write`)}
          >
            <div className="h-full bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-emerald-500">
              <EllipsisHorizontalIcon className="h-6 w-6" />
              <p className="text-lg">Write-Mode</p>
            </div>
            <div
              className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
            ></div>
          </div>
          <div
            className="h-64 relative cursor-pointer"
            onClick={() => navigate(`/topic/${id}/match`)}
          >
            <div className="h-full bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-emerald-500">
              <EllipsisHorizontalIcon className="h-6 w-6" />
              <p className="text-lg">Match-Mode</p>
            </div>
            <div
              className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
            ></div>
          </div>
          <div
            className="h-64 relative cursor-pointer"
            onClick={() => navigate(`/topic/${id}/flashcards`)}
          >
            <div className="h-full bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-emerald-500">
              <EllipsisHorizontalIcon className="h-6 w-6" />
              <p className="text-lg">Flashcards</p>
            </div>
            <div
              className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
            ></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
