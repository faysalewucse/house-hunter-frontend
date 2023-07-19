import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const RenterRoute = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser?.role === "houseRenter" ? children : <Navigate to={"/"} />;
};
