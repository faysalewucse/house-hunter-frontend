import { Home } from "../pages/Home/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

export const userRouter = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <RegisterPage />,
  },
];
