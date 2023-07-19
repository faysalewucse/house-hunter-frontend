import About from "../pages/About";
import { Home } from "../pages/Home/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PublicRoute from "./PublicRoute";

export const userRouter = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/sign-in",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
];
