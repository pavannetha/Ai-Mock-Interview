import React, { createContext, useEffect, useState } from "react";
export const UserProvider = createContext();

export default function ContextProvider({ children }) {
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    const newUserDetails = JSON.parse(localStorage.getItem("user"));
    setUserDetails(newUserDetails);
  }, []);
  return (
    <UserProvider.Provider value={{ userDetails }}>
      {children}
    </UserProvider.Provider>
  );
}
