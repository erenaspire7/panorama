import Button from "../components/Button";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";

export default function CreateTopic() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post("topic/create", data);

      toast.success("Create Topic Successful!", {
        theme: "colored",
        className: "text-sm",
      });

      navigate("/");
    } catch (err) {
      if (err.response != undefined) {
        toast.error(err.response.data["message"], {
          theme: "colored",
          className: "text-sm",
        });
      }
    }
  };

  return (
    <Layout>
      <div className="px-20 pt-16 w-1/2">
        <h1 className="font-bold text-3xl">Create.</h1>

        <div className="p-8 w-full space-y-8">
          <div className="relative z-0 w-full">
            <input
              type="text"
              id="title"
              className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-black dark:border-gray-600 dark:focus:border-emerald-500 focus:outline-none focus:ring-0 peer"
              placeholder=" "
              {...register("title", {
                required: true,
                minLength: 10,
              })}
            />
            <label
              htmlFor="title"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-emerald-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Title
            </label>
            {errors.title ? (
              <div className="text-xs p-1 text-red-500">
                <p>Title must be at least 10 characters long!</p>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="relative z-0 w-full">
            <textarea
              type="text"
              id="floating_standard"
              className="resize-none block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-black dark:border-gray-600 dark:focus:border-emerald-500 focus:outline-none focus:ring-0 peer"
              placeholder=" "
              rows={16}
              {...register("content", {
                required: true,
                minLength: 10,
              })}
            />
            <label
              htmlFor="floating_standard"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-emerald-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Note
            </label>
            {errors.content ? (
              <div className="text-xs p-1 text-red-500">
                <p>Content must be at least 10 characters long!</p>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="flex justify-end">
            <Button
              text={"Submit"}
              onClick={handleSubmit(async (data) => await onSubmit(data))}
            />
          </div>
        </div>
      </div>
      <div className="w-1/2 bg-emerald-800"></div>
    </Layout>
  );
}
