import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../Layout/MainLayout";
import { userRouter } from "./userRoute";
import { DashboardLayout } from "../Layout/DashboardLayout";
import { dashboardRouter } from "./dashboardRouter";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: userRouter,
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: dashboardRouter,
  },
]);
