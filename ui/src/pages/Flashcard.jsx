import { useLoaderData } from "react-router-dom";
import Layout from "../components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

export default function Flashcard() {
  const { flashcards } = useLoaderData();

  const [index, setIndex] = useState(0);
  const [key, setKey] = useState("term");
  const [opacity, setOpacity] = useState(1);
  const cardRef = useRef();

  const previous = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      setIndex(flashcards.length - 1);
    }

    setKey("term");
  };

  const next = () => {
    if (index < flashcards.length) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }

    setKey("term");
  };

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
      <div className="-mt-12 px-20 w-full">
        <div className="flex items-center space-x-8 justify-center h-full">
          <div onClick={() => previous()} className="cursor-pointer">
            <ArrowLeftCircleIcon className="w-8 h-8" />
          </div>
          <AnimatePresence>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{
                scale: 0.9,
              }}
              onTap={() => flip()}
              className=""
            >
              <div
                className="h-96 w-[50vw] transition ease-in relative cursor-pointer duration-300	"
                ref={cardRef}
              >
                <div className="h-full flex items-center justify-center bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-emerald-500">
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
          <div onClick={() => next()} className="cursor-pointer">
            <ArrowRightCircleIcon className="w-8 h-8" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
