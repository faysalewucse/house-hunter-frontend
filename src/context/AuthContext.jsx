import { Loading } from "@nextui-org/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      axios
        .get(`${import.meta.env.VITE_BASE_API_URL}/users/${user.email}`)
        .then(({ data }) => {
          setLoading(false);
          setCurrentUser(data);
        });
    } else {
      setLoading(false);
      setCurrentUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user-email");
    localStorage.removeItem("access-token");
    setCurrentUser(null);
  };
  const value = {
    currentUser,
    loading,
    setCurrentUser,
    open,
    setOpen,
    isOpen,
    setIsOpen,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loading size="lg" color={"success"} />
        </div>
      )}
    </AuthContext.Provider>
  );
}
