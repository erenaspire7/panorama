import { useLoaderData, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import SuccessModal from "../components/SuccessModal";
import Button from "../components/Button";
import axiosInstance from "../utils/axios";

export default function Flashcard() {
  const { flashcards } = useLoaderData();
  const navigate = useNavigate();
  const path = useLocation();
  const id = path.pathname.split("/")[2];

  const [index, setIndex] = useState(0);
  const [key, setKey] = useState("term");
  const [opacity, setOpacity] = useState(1);
  const cardRef = useRef();

  const [scope, animate] = useAnimate();

  const [success, setSuccess] = useState(false);

  const flip = () => {
    const contentStyle = document.getElementById("content").style;
    const cardStyle = cardRef.current.style;
    setOpacity(0);

    if (key == "term") {
      cardStyle.transform = "rotate3d(1, 0, 0, 180deg)";
      contentStyle.transform = "rotate3d(1, 0, 0, 180deg)";
    } else {
      cardStyle.transform = "rotate3d(1, 0, 0, 0)";
      contentStyle.transform = "rotate3d(1, 0, 0, 0)";
    }

    setTimeout(() => {
      if (key == "term") {
        setKey("definition");
      } else {
        setKey("term");
      }
      setOpacity(1);
    }, 500);
  };

  return (
    <Layout>
      <div className="py-10 px-20 w-full flex flex-col items-center">
        <div>
          <h1 className="text-3xl font-bold">Flashcards.</h1>
        </div>
        <div className="mt-2 mb-6 flex items-center">
          <div className="mr-2">
            <Button
              icon={<ArrowLeftIcon className="h-3 w-3" />}
              onClick={() => navigate(`/topic/${id}`)}
            />
          </div>
          <span>|</span>
          <div className="ml-2 mr-3">
            <Button
              text="Quiz"
              textSize="text-xs"
              onClick={() => navigate(`/topic/${id}/quiz`)}
            ></Button>
          </div>
          <span>|</span>
          <div className="ml-2 mr-3">
            <Button
              text="Write Mode"
              textSize="text-xs"
              onClick={() => navigate(`/topic/${id}/write`)}
            ></Button>
          </div>
          <span>|</span>
          <div className="ml-2">
            <Button
              text="Match Mode"
              textSize="text-xs"
              onClick={() => navigate(`/topic/${id}/match`)}
            ></Button>
          </div>
        </div>
        <div>
          <AnimatePresence>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{
                scale: 0.9,
              }}
              onTap={() => flip()}
              ref={scope}
            >
              <div
                className="h-96 w-[50vw] transition ease-in relative cursor-pointer duration-300	"
                ref={cardRef}
              >
                <div className="h-full flex items-center justify-center bg-white border-2 border-black p-4 relative z-10 hover:text-white hover:bg-teal-500">
                  <p
                    className="text-lg transition-opacit"
                    id="content"
                    style={{ opacity: opacity }}
                  >
                    {flashcards[index][key]}
                  </p>
                </div>
                <div
                  className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
                ></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex items-center w-[50vw] justify-center">
          <div className="flex items-center space-x-4">
            <div
              onClick={async () => {
                if (index > 0) {
                  await animate(scope.current, { opacity: 0 });
                  setIndex(index - 1);
                  setKey("term");
                  await animate(scope.current, { opacity: 100 });
                }
              }}
              className="cursor-pointer"
            >
              <ArrowLeftCircleIcon
                className={`${index == 0 ? "opacity-50" : ""} w-8 h-8`}
              />
            </div>

            <div>
              {index + 1} / {flashcards.length}
            </div>

            <div
              onClick={async () => {
                if (index < flashcards.length - 1) {
                  await animate(scope.current, { opacity: 0 });
                  setIndex(index + 1);
                  setKey("term");
                  await animate(scope.current, { opacity: 100 });
                }

                if (index == flashcards.length - 1) {
                  try {
                    await axiosInstance.post("topic/log-study", {
                      topicId: id,
                    });
                  } catch (err) {}

                  setSuccess(true);
                }
              }}
              className="cursor-pointer"
            >
              <ArrowRightCircleIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
      <SuccessModal
        show={success}
        setShow={setSuccess}
        title={`${flashcards.length} Terms Reviewed! 🎉`}
        subtitle={`Great job! You've successfully reviewed ${flashcards.length} terms.`}
        extraButton={
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => navigate(`/topic/${id}/match`)}
          >
            Go to Match Mode!
          </button>
        }
      />
    </Layout>
  );
}
