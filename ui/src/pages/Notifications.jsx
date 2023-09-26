import Layout from "../components/Layout";
import { useNavigate, useLoaderData } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function Notifications() {
  const { isAuthenticated, notifications } = useLoaderData();

  return (
    <Layout>
      <div className="w-full flex flex-col items-center">
        <div className="w-1/2 pt-12 flex items-center justify-between">
          <p className="font-bold text-3xl">Notifications.</p>

          <div>Unread/All</div>
        </div>

        {notifications.length > 0 ? (
          <div className="mt-4 w-1/2 space-y-6">
            {notifications.map((el) => (
              <div className="w-full bg-gray-200 p-6">
                <div className="text-xs">
                  <ReactTimeAgo date={el["regDate"]} locale="en-US" />
                </div>
                <div className="flex items-center justify-between">
                  <span>{el["text"]}</span>
                  <span>
                    <CheckCircleIcon className="h-5 w-5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          "No Notifications"
        )}
      </div>
    </Layout>
  );
}
