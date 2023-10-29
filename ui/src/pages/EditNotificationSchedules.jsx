import { useLoaderData, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { isSameDay } from "date-fns";
import Button from "../components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";

export default function EditNotificationSchedules() {
  const { schedules, title } = useLoaderData();

  const [displayedSchedules, setDisplayedSchedules] = useState(
    JSON.parse(JSON.stringify(schedules))
  );

  // setDisplayedSchedules(schedules)

  const navigate = useNavigate();
  const path = useLocation();
  const id = path.pathname.split("/")[2];

  const update = () => {
    const payload = {
      newDates: displayedSchedules,
      topicId: id,
    };

    axiosInstance
      .post("topic/edit-spaced-schedules", payload)
      .then(() => {
        toast.success("Success!", {
          theme: "colored",
          className: "text-sm",
        });

        setTimeout(() => {
          navigate(`/topic/${id}`);
        }, 1000);
      })
      .catch(() => {});

    // Update and Navigate Back
  };

  return (
    <Layout>
      <div className="pt-16 p-20 w-full flex flex-col items-center">
        <div>
          <h1 className="text-3xl font-bold">Edit Notification Schedules.</h1>
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
          <div className="ml-2">
            <Button
              text="Match Mode"
              textSize="text-xs"
              onClick={() => navigate(`/topic/${id}/match`)}
            ></Button>
          </div>
        </div>

        <div></div>

        {displayedSchedules.map((el, index) => {
          let date = new Date(el["expectedCompletionDate"]);
          let today = new Date();
          let ogDate = new Date(schedules[index]["expectedCompletionDate"]);

          return (
            <div className="flex space-x-2 space-y-4 items-center">
              <div>{index + 1}</div>

              <Datepicker
                asSingle={true}
                value={{
                  startDate: date,
                  endDate: date,
                }}
                useRange={false}
                onChange={(newValue) => {
                  el["expectedCompletionDate"] = newValue["startDate"];
                  setDisplayedSchedules([...displayedSchedules]);
                }}
                disabled={
                  el["completed"] ||
                  el["notified"] ||
                  isSameDay(ogDate, today) ||
                  today > ogDate
                }
              />
            </div>
          );
        })}

        <div className="flex justify-end mt-6 z-0">
          <Button text={"Submit"} onClick={() => update()} />
        </div>
      </div>
    </Layout>
  );
}
