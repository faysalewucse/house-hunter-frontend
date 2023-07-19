import Dashboard from "../pages/Dashboard/Dashboard";
import ManageBooking from "../pages/Dashboard/ManageBooking";
import ManageHouses from "../pages/Dashboard/ManageHouses";
import { OwnerRoute } from "./OwnerRoute";
import PrivateRoute from "./PrivateRoute";
import { RenterRoute } from "./RenterRoute";

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
  {
    path: "manage-bookings",
    element: (
      <RenterRoute>
        <ManageBooking />
      </RenterRoute>
    ),
  },
];
