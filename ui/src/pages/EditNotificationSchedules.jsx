import { useLoaderData, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { isSameDay } from "date-fns";
import Button from "../components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function EditNotificationSchedules() {
  const { schedules, title } = useLoaderData();

  const [displayedSchedules, setDisplayedSchedules] = useState(schedules);

  const navigate = useNavigate();
  const path = useLocation();
  const id = path.pathname.split("/")[2];

  const update = () => {
    const payload = {
      newDates: displayedSchedules,
      topicId: id,
    };

    // Update and Navigate Back
  };

  return (
    <Layout>
      <div className="p-20">
        <div className="mb-6 flex items-center space-x-4">
          <button onClick={() => navigate(`/topic/${id}`)}>
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <h1 className="text-3xl font-bold">{title}.</h1>
        </div>
        <div>Edit Notification Schedule</div>
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

        <div className="flex justify-end mt-6">
          <Button text={"Submit"} onClick={() => update()} />
        </div>
      </div>
    </Layout>
  );
}
