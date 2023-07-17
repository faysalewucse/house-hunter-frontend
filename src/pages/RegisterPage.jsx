import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { userName, role, password, phoneNumber, email } = data;

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_API_URL}/user`,
      {
        userName,
        role,
        password,
        phoneNumber,
        email,
      }
    );

    if (response.status === 200) {
      navigate("/");
    }
  };

  return (
    <div className="p-5 flex items-center justify-center min-h-[80vh]">
      <div className="max-w-md mx-auto bg-primary bg-opacity-10 shadow p-6 rounded-md">
        <h2 className="text-center text-primary text-3xl font-bold mb-6">
          Registration Form
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block mb-2 font-semibold dark:text-white"
            >
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="userName"
              {...register("userName", { required: true })}
              className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                errors.userName ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors.userName && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          <div className="flex mb-4 gap-2">
            <div className="w-1/2">
              <label
                htmlFor="role"
                className="block mb-2 font-semibold dark:text-white"
              >
                Role <span className="text-primary">*</span>
              </label>
              <select
                id="role"
                {...register("role", { required: true })}
                className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none w-full ${
                  errors.role ? "ring-2 ring-red-500" : ""
                }`}
              >
                <option value="">Select Role</option>
                <option value="houseOwner">House Owner</option>
                <option value="houseRenter">House Renter</option>
              </select>
              {errors.role && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>

            <div className="w-1/2">
              <label
                htmlFor="phoneNumber"
                className="block mb-2 font-semibold dark:text-white"
              >
                Phone Number <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                {...register("phoneNumber", {
                  required: true,
                  pattern: /^\d+$/,
                })}
                className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                  errors.phoneNumber ? "ring-2 ring-red-500" : ""
                }`}
              />
              {errors.phoneNumber && errors.phoneNumber.type === "required" && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
              {errors.phoneNumber && errors.phoneNumber.type === "pattern" && (
                <span className="text-red-500 text-sm">
                  Please enter a valid phone number
                </span>
              )}
            </div>
          </div>

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

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-5 dark:text-white">
          Already Have an account?
          <Link to="/sign-in" className="font-semibold ml-1 text-primary">
            Sing In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
