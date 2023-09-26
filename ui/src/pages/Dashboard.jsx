import { useLoaderData, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function Dashboard() {
  const { topics } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Layout>
      {topics.length > 0 ? (
        "Topics Present"
      ) : (
        <div
          className={`bg-center bg-cover px-20 pb-20 w-full flex flex-col items-start justify-center`}
        >
          <div className="">
            <p className="font-bold text-5xl">Get Started.</p>
          </div>
          <div className="max-w-xl py-6">
            <p className="">
              Welcome To Panorama! Ready to embark on your learning journey? The
              possibilities are endless, and it all starts with your unique
              topic.
            </p>
          </div>
          <div>
            <Button
              icon={<ArrowRightIcon className="h-3 w-3" />}
              text="Create Topic"
              textSize="text-xs"
              onClick={() => navigate("/create-topic")}
            ></Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
