import React, { useContext, useEffect, useState } from "react";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("userEmail")) {
      setCurrentUser(localStorage.getItem("userEmail"));
    }
  }, []);
  const value = {
    currentUser,
    setCurrentUser,
    open,
    setOpen,
    isOpen,
    setIsOpen,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
