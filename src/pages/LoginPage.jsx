import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Button from "../components/Shared/Button";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LoginPage = () => {
  const { setIsOpen, setOpen, setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (userInfo) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/jwt`,
        {
          email: userInfo.email,
        }
      );

      if (response.status === 200) {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}/login`,
          userInfo
        );

        if (res.status === 200) {
          axios
            .get(`${import.meta.env.VITE_BASE_API_URL}/users/${userInfo.email}`)
            .then(({ data }) => {
              setLoading(false);
              setCurrentUser(data);
              localStorage.setItem("access-token", response.data.token);
              localStorage.setItem("user", JSON.stringify(data));
            });
        }
        return res;
      }

      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
    setIsOpen(false);
  }, [setOpen, setIsOpen]);

  return (
    <div className="p-5 flex items-center justify-center min-h-[80vh]">
      <div className="max-w-lg mx-auto bg-primary bg-opacity-10 shadow p-6 rounded-md">
        <h2 className="text-center text-primary text-3xl font-bold mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 font-semibold dark:text-white"
            >
              Email <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                errors.email ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors.email && errors.email.type === "required" && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
            {errors.email && errors.email.type === "pattern" && (
              <span className="text-red-500 text-sm">
                Please enter a valid email address
              </span>
            )}
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block mb-2 font-semibold dark:text-white"
            >
              Password <span className="text-primary">*</span>
            </label>
            <input
              type={`${!showPassword ? "password" : "text"}`}
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/,
                  message:
                    "Password must contain at least one capital letter and one special character",
                },
              })}
              className="w-full px-4 py-2 rounded text-slate-700 focus:outline-none shadow"
            />
            <div
              className="absolute top-11 right-2 text-xl cursor-pointer dark:text-black"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button disable={loading} loading={loading} width="100%">
            Login
          </Button>
        </form>
        <p className="text-center mt-5 dark:text-white">
          Don't have an account?
          <Link to="/sign-up" className="font-semibold ml-1 text-primary">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
