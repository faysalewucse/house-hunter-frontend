import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const OwnerRoute = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser?.role === "houseOwner" ? children : <Navigate to={"/"} />;
};
