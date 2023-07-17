import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../Layout/MainLayout";
import { userRouter } from "./userRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: userRouter,
  },
]);
