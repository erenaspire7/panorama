import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useLoaderData, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Button from "../components/Button";
import SuccessModal from "../components/SuccessModal";
import axiosInstance from "../utils/axios";

let timerIds = [];
let finalTimeMin;
let finalTimeSec;

export default function MatchMode() {
  const { terms, definitions, flashcards, title } = useLoaderData();
  const navigate = useNavigate();
  const path = useLocation();
  const id = path.pathname.split("/")[2];

  const [chosenTerm, setChosenTerm] = useState(null);
  const [chosenDefinition, setChosenDefinition] = useState(null);

  const [displayedTerms, setDisplayedTerms] = useState(terms);
  const [displayedDefinitions, setDisplayedDefinitions] = useState(definitions);

  const selectTerm = (index) => {
    chosenTerm == index ? setChosenTerm(null) : setChosenTerm(index);
  };

  const [success, setSuccess] = useState(false);

  const selectDefinition = (index) => {
    chosenDefinition == index
      ? setChosenDefinition(null)
      : setChosenDefinition(index);
  };

  useEffect(() => {
    if (chosenTerm != null && chosenDefinition != null) {
      let card = flashcards.find(
        (el) => el["term"] == displayedTerms[chosenTerm]
      );

      let def = displayedDefinitions[chosenDefinition];

      if (card["definition"] == def) {
        setDisplayedTerms(
          displayedTerms.filter((el) => el != displayedTerms[chosenTerm])
        );
        setDisplayedDefinitions(
          displayedDefinitions.filter(
            (el) => el != displayedDefinitions[chosenDefinition]
          )
        );

        toast.success("Splendid Choice!", {
          theme: "colored",
          className: "text-sm",
          autoClose: 1000,
          position: "bottom-right",
        });
      } else {
        toast.error("Invalid Choice!", {
          theme: "colored",
          className: "text-sm",
          autoClose: 1000,
          position: "bottom-right",
        });
      }

      setChosenTerm(null);
      setChosenDefinition(null);
    }
  }, [chosenTerm, chosenDefinition]);

  let min = 0,
    sec = 0,
    ms = 0;

  useEffect(() => {
    if (displayedTerms.length == 0) {
      for (let timerId of timerIds) {
        clearInterval(timerId);
      }

      let time = parseInt(finalTimeMin) * 60 + parseInt(finalTimeSec);

      axiosInstance
        .post("topic/save-match-mode", {
          topicId: id,
          timeTaken: time,
        })
        .catch(() => {});

      axiosInstance
        .post("topic/log-study", {
          topicId: id,
        })
        .catch(() => {});

      setSuccess(true);
    }
  }, [displayedTerms]);

  useEffect(() => {
    let stopwatch = document.getElementById("timer");

    let id = setInterval(() => {
      ms = parseInt(ms);
      sec = parseInt(sec);
      min = parseInt(min);

      if (displayedTerms.length == 0) {
        clearInterval(id);
      }

      ms++;

      if (ms == 100) {
        sec = sec + 1;
        ms = 0;
      }
      if (sec == 60) {
        min = min + 1;
        sec = 0;
      }
      if (ms < 10) {
        ms = "0" + ms;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      if (min < 10) {
        min = "0" + min;
      }

      stopwatch.innerHTML = min + ":" + sec;

      finalTimeMin = parseInt(min);
      finalTimeSec = sec;
    }, 10);

    timerIds.push(id);
  }, []);

  return (
    <Layout>
      <div className="w-full py-10 px-20">
        <div className="flex justify-between items-center ">
          <h1 className="text-3xl font-bold">Match Mode.</h1>
          <p id="timer" className="text-2xl font-bold tracking-tighter">
            00:00
          </p>
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
              text="Flashcards"
              textSize="text-xs"
              onClick={() => navigate(`/topic/${id}/match`)}
            ></Button>
          </div>
        </div>
        <div className="flex">
          <div className="w-1/3 text-center mr-4">
            <p className="mb-4">Terms</p>

            <div className="grid grid-cols-2 gap-4">
              {displayedTerms.map((el, index) => (
                <div
                  className="transition ease-in relative cursor-pointer duration-300"
                  onClick={() => selectTerm(index)}
                >
                  <div
                    className={`h-full flex items-center justify-center ${
                      chosenTerm == index
                        ? "bg-teal-700 text-white"
                        : "bg-white"
                    } border-2 border-black p-4 relative z-50 hover:text-white hover:bg-teal-500`}
                  >
                    <p>{el}</p>
                  </div>
                  <div
                    className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-2/3 text-center">
            <p className="mb-4">Definitions</p>

            <div className="grid grid-cols-3 gap-4">
              {displayedDefinitions.map((el, index) => (
                <div
                  className="transition ease-in relative cursor-pointer duration-300"
                  onClick={() => selectDefinition(index)}
                >
                  <div
                    className={`
                    h-full flex items-center justify-center ${
                      chosenDefinition == index
                        ? "bg-teal-700 text-white"
                        : "bg-white"
                    } border-2 border-black p-4 relative z-50 hover:text-white hover:bg-teal-500`}
                  >
                    <p>{el}</p>
                  </div>
                  <div
                    className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SuccessModal
        show={success}
        setShow={setSuccess}
        title={`${flashcards.length} Terms Matched! 🎉`}
        subtitle={`Great job! You've successfully matched ${flashcards.length} terms in ${finalTimeMin} minutes and ${finalTimeSec} seconds!`}
      />
    </Layout>
  );
}
