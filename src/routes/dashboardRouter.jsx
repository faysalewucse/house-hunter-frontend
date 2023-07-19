import Dashboard from "../pages/Dashboard/Dashboard";
import ManageHouses from "../pages/Dashboard/ManageHouses";
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
    path: "manage-houses",
    element: (
      <OwnerRoute>
        <ManageHouses />
      </OwnerRoute>
    ),
  },
];
