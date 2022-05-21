import React, { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = (props) => {
  const [status, setStatus] = useState(0);

  return (
    <UserContext.Provider
      value={{
        status,
        setStatus,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
