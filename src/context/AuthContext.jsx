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
    const userEmail = localStorage.getItem("user-email");
    if (userEmail) {
      axios
        .get(`${import.meta.env.VITE_BASE_API_URL}/users/${userEmail}`)
        .then(({ data }) => {
          console.log(data.email);
          setLoading(false);
          setCurrentUser(data.email);
        });
    } else {
      setLoading(false);
      setCurrentUser(null);
    }
  }, []);

  const register = async (userInfo) => {
    setLoading(true);
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_API_URL}/jwt`,
      {
        email: userInfo.email,
      }
    );

    if (response.status === 200) {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/register`,
        userInfo
      );

      console.log(res);
      if (res.status === 200) {
        setCurrentUser(userInfo.email);
        setLoading(false);
        localStorage.setItem("access-token", response.data.token);
        localStorage.setItem("user-email", userInfo.email);
        return res;
      }
    }
  };

  const login = async (userInfo) => {
    setLoading(true);
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_API_URL}/jwt`,
      {
        email: userInfo.email,
      }
    );

    if (response.status === 200) {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/login`,
        userInfo
      );

      console.log(res);
      if (res.status === 200) {
        setCurrentUser(userInfo.email);
        setLoading(false);
        localStorage.setItem("access-token", response.data.token);
        localStorage.setItem("user-email", userInfo.email);
        return res;
      }
    }
  };

  const value = {
    currentUser,
    loading,
    setCurrentUser,
    open,
    setOpen,
    isOpen,
    setIsOpen,
    register,
    login,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loading size="lg" />
        </div>
      )}
    </AuthContext.Provider>
  );
}
