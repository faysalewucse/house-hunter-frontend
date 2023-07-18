import Dashboard from "../pages/Dashboard/Dashboard";
import MyHouses from "../pages/Dashboard/MyHouses";
import { OwnerRoute } from "./OwnerRoute";
import PrivateRoute from "./PrivateRoute";

export const dashboardRouter = [
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "selectedClasses",
    element: (
      <OwnerRoute>
        <MyHouses />
      </OwnerRoute>
    ),
  },
];
