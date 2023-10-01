import { useLoaderData, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Card from "../components/Card";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { topics } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Layout>
      {topics.length > 0 ? (
        <div className="pt-12 px-20 w-full">
          <h1 className="font-bold text-3xl">Topics.</h1>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {topics.map((el) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 1.0 }}
              >
                <Card
                  title={el.name}
                  onClick={() => navigate(`/topic/${el.id}`)}
                />
              </motion.button>
            ))}
          </div>
        </div>
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
