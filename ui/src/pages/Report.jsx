import Layout from "../components/Layout";
import { useLoaderData, useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import ChangingProgressProvider from "../components/ChangingProgressProvider";
import "react-circular-progressbar/dist/styles.css";
import { isNumeric } from "../utils/helper";

export default function Report() {
  const navigate = useNavigate();
  const path = useLocation();
  const id = path.pathname.split("/")[2];
  const { reportData } = useLoaderData();

  const [links, setLinks] = useState([]);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_URL}`);

    socket.on("additional-links", (data) => {
      if (data["topicId"] == id) {
        setLinks(data["links"]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  let keys = [
    "writtenModeData",
    "bestMatchModeScore",
    "avgQuizScore",
    "avgWriteScore",
  ];

  let hasData = keys.some(
    (prop) => reportData[prop] != undefined && reportData[prop] != null
  );

  const generatePDF = async () => {
    let content = document.getElementsByTagName("body")[0];

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF({
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight()
      );
      pdf.save("report.pdf");
    });
  };

  console.log(reportData);

  return (
    <Layout>
      <div className="py-10 px-20 w-full items-center flex flex-col">
        <div>
          <h1 className="text-3xl font-bold">Report.</h1>
        </div>
        <div className="mt-4 mb-12 flex items-center">
          <div className="mr-2">
            <Button
              icon={<ArrowLeftIcon className="h-3 w-3" />}
              onClick={() => navigate(`/topic/${id}`)}
            />
          </div>
          <span>|</span>

          <div className="ml-2 mr-3">
            <Button
              text="Flashcards"
              textSize="text-xs"
              onClick={() => navigate(`/topic/${id}/flashcards`)}
            ></Button>
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
          <div className="ml-2 mr-3">
            <Button
              text="Match Mode"
              textSize="text-xs"
              onClick={() => navigate(`/topic/${id}/match`)}
            ></Button>
          </div>
          <span>|</span>
          <div className="ml-2">
            <Button
              text="PDF"
              textSize="text-xs"
              onClick={async () => await generatePDF()}
            ></Button>
          </div>
        </div>

        <div className="lg:w-3/4 space-y-8">
          {hasData ? (
            <div className="space-y-8">
              <div className="flex space-x-8 w-full">
                <div className="flex w-1/3 space-x-4 items-center justify-center p-4 rounded-lg bg-[#14b8a6]">
                  <div className="flex flex-col items-center mb-2">
                    <div style={{ width: 100, height: 100 }}>
                      <CircularProgressbarWithChildren
                        value={reportData["avgWriteScore"] * 10}
                        className="font-bold"
                        text={`${
                          isNumeric(reportData["avgWriteScore"])
                            ? reportData["avgWriteScore"] * 10 + "%"
                            : "N/A"
                        }`}
                        circleRatio={0.75}
                        styles={buildStyles({
                          rotation: 1 / 2 + 1 / 8,
                          trailColor: "#fff",
                          pathColor: "#F6CB51",
                          textColor: "#F6CB51",
                          textSize: 16,
                        })}
                      ></CircularProgressbarWithChildren>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white text-center">
                        Avg Write Mode Score
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center mb-2">
                    <div style={{ width: 100, height: 100 }}>
                      <CircularProgressbarWithChildren
                        value={reportData["avgQuizScore"]}
                        className="font-bold"
                        text={`${
                          isNumeric(reportData["avgQuizScore"])
                            ? reportData["avgQuizScore"].toFixed(2) + "%"
                            : "N/A"
                        }`}
                        circleRatio={0.75}
                        styles={buildStyles({
                          rotation: 1 / 2 + 1 / 8,
                          trailColor: "#fff",
                          pathColor: "#F6CB51",
                          textColor: "#F6CB51",
                          textSize: 16,
                        })}
                      ></CircularProgressbarWithChildren>
                    </div>
                    <div className="">
                      <p className="text-sm font-bold text-white text-center">
                        Avg Quiz Mode Score
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-2/3 p-8 bg-[#F6CC52] rounded-lg text-black">
                  <p className="text-xl font-bold ">Additional Reading</p>

                  <div className="space-y-2">
                    {links.map((el) => (
                      <li>
                        <a href={`${el["link"]}`} target="_blank">
                          {el["link"]}
                        </a>
                      </li>
                    ))}
                  </div>
                </div>
              </div>

              {reportData["writtenModeData"] != null ? (
                <div className="bg-[#E6E9F3] w-full rounded-lg p-8">
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <p className=" font-bold text-xl ">
                        Most Recent Written Mode
                      </p>

                      {reportData["writtenModeData"].map((el) => (
                        <div>
                          <p>Q: {el["question"]}</p>
                          <p>A: {el["userAnswer"]}</p>
                          <p>C: {el["comment"]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div className="w-full bg-gray-200 p-6">
              <div className="text-xs">Info</div>
              <div className="flex items-center justify-between">
                <span>
                  Please do some quizzes / matches to have an actual report!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
