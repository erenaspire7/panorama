import Layout from "../components/Layout";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    let response = await axiosInstance.post("auth/sign-up", data);

    sessionStorage.setItem("panorama-access-token", response.data["token"]);

    toast.success("Registration Successful!", {
      theme: "colored",
      className: "text-sm",
    });

    navigate("/");
    try {
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
      <div className="w-full lg:w-1/2 justify-center flex pt-16 lg:pt-20">
        <div className="w-3/4 lg:w-1/2">
          <h1 className="font-bold text-3xl">Register.</h1>

          <div className="my-8 space-y-4">
            <div className="flex max-w-md space-x-2">
              <div
                style={{
                  width: "calc(50% - 0.25rem)",
                }}
              >
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-gray-300 ">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                      placeholder="John"
                      {...register("firstName", {
                        required: true,
                      })}
                    />
                  </div>
                  {errors.firstName ? (
                    <div className="text-xs p-1 text-red-500">
                      <p>Please provide your first name!</p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div
                style={{
                  width: "calc(50% - 0.25rem)",
                }}
              >
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-gray-300  ">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                      placeholder="Doe"
                      {...register("lastName", {
                        required: true,
                      })}
                    />
                  </div>
                  {errors.lastName ? (
                    <div className="text-xs p-1 text-red-500">
                      <p>Please provide your last name!</p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-gray-300  sm:max-w-md">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                    placeholder="erenyeager@gmail.com"
                    {...register("email", {
                      required: true,
                      pattern:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    })}
                  />
                </div>
                {errors.email ? (
                  <div className="text-xs p-1 text-red-500">
                    <p>Please provide a valid email!</p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-gray-300  sm:max-w-md">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                    placeholder="*******"
                    {...register("password", {
                      required: true,
                    })}
                  />
                </div>
                {errors.password ? (
                  <div className="text-xs p-1 text-red-500">
                    <p>Please provide a password!</p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              text={"Sign Up"}
              onClick={handleSubmit(async (data) => await onSubmit(data))}
            />
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-1/2 bg-teal-800"></div>
    </Layout>
  );
}
