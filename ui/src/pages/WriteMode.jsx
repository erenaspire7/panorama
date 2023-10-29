import Layout from "../components/Layout";
import { useLoaderData, useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";

export default function WriteMode() {
  const { questions, title } = useLoaderData();

  const navigate = useNavigate();
  const path = useLocation();
  const id = path.pathname.split("/")[2];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let arr = Object.values(data);

    let newData = questions.map((el, index) => {
      let obj = {};
      obj["question"] = el["question"];
      obj["answer"] = el["answer"];
      obj["userAnswer"] = arr[index];

      return obj;
    });

    try {
      await axiosInstance.post("topic/save-write-quiz", {
        answers: newData,
        topicId: id,
      });

      await axiosInstance.post("topic/log-study", {
        topicId: id,
      });

      toast.success("Success!", {
        theme: "colored",
        className: "text-sm",
      });

      navigate(`/topic/${id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="w-full py-10 px-20 flex flex-col items-center">
        <div>
          <h1 className="text-3xl font-bold">Write Mode.</h1>
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
              text="Match Mode"
              textSize="text-xs"
              onClick={() => navigate(`/topic/${id}/match`)}
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

        <div className="py-8 w-full">
          <div className=" w-full space-y-8">
            {questions.map((el, index) => (
              <div className="relative z-0 w-full">
                <textarea
                  type="text"
                  id="title"
                  className="resize-none block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-black dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 peer"
                  rows={2}
                  {...register(`question-${index}`, {
                    required: true,
                    minLength: 5,
                  })}
                />
                <label
                  htmlFor="title"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-teal-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  {el["question"]}
                </label>
                {errors[`question-${index}`] ? (
                  <div className="text-xs p-1 text-red-500">
                    <p>Answers must be at least 10 characters long!</p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button
              text={"Submit"}
              onClick={handleSubmit(async (data) => await onSubmit(data))}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
