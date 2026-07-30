import React, { createContext, useEffect, useState } from "react";
export const UserProvider = createContext();

export default function ContextProvider({ children }) {
  const [userDetails, setUserDetails] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserDetails(JSON.parse(storedUser));
    }
  }, []);

  const updateUserDetails = (updatedUser) => {
    setUserDetails(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <UserProvider.Provider value={{ userDetails, updateUserDetails }}>
      {children}
    </UserProvider.Provider>
  );
}
