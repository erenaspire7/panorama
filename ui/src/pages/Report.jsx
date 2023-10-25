import Layout from "../components/Layout";
import { useLoaderData, useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import io from "socket.io-client";

export default function Report() {
  const navigate = useNavigate();
  const path = useLocation();
  const id = path.pathname.split("/")[2];
  const { reportData } = useLoaderData();

  const [links, setLinks] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("additional-links", (data) => {
      console.log(data);
      if (data["topicId"] == id) {
        setLinks(data["links"]);
      }
    });

    return () => {
      // Clean up the socket connection when the component unmounts
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

  console.log(reportData);

  return (
    <Layout>
      <div className="py-10 px-20 w-full items-center flex flex-col">
        <div>
          <h1 className="text-3xl font-bold">{reportData["title"]}.</h1>
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
              onClick={() => navigate(`/topic/${id}/flashcards`)}
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
        <div className="w-1/2">
          {hasData ? (
            <div className="space-y-4">
              <div className="w-full bg-gray-200 p-6">
                <div className="text-xs">Info</div>
                <div className="items-center justify-between">
                  <p>
                    Average Write Mode Score:{" "}
                    {reportData["avgWriteScore"] ?? "N/A"}
                  </p>
                  <p>
                    Average Quiz Mode Score:{" "}
                    {reportData["avgQuizScore"] ?? "N/A"}
                  </p>
                </div>
              </div>

              {reportData["matchModeData"] != null &&
              reportData["matchModeData"].length > 0 ? (
                <div>
                  <p>Top 5</p>
                </div>
              ) : (
                <></>
              )}

              {reportData["writtenModeData"] != null ? (
                <div className="space-y-4">
                  <p>Most Recent Written Mode</p>

                  {reportData["writtenModeData"].map((el) => (
                    <div>
                      <p>Q: {el["question"]}</p>
                      <p>A: {el["userAnswer"]}</p>
                      <p>C: {el["comments"]}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <></>
              )}

              <div>
                <p>Additional Reading!</p>

                <div className="space-y-2">
                  {links.map((el) => (
                    <p>
                      <a href={`${el["link"]}`} target="_blank">
                        {el["title"]}
                      </a>
                    </p>
                  ))}
                </div>
              </div>
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
