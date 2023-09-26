import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Button from "../components/Button";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="bg-center bg-cover p-20 w-full flex flex-col items-start justify-center">
        <div className="">
          <p className="font-bold text-5xl">Explore, Enrich, Empower.</p>
        </div>
        <div className="max-w-xl py-6">
          <p className="">
            Our e-learning platform redefines education. Join a community of
            learners worldwide who are leveraging our innovative resources,
            AI-driven features, and expert support to transform their learning
            experience and achieve greatness.
          </p>
        </div>
        <div>
          <Button
            icon={<ArrowRightIcon className="h-3 w-3" />}
            text="Get Started"
            textSize="text-xs"
            onClick={() => navigate("/sign-up")}
          ></Button>
        </div>
      </div>
    </Layout>
  );
}
