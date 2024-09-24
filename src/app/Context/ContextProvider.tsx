'use client'

import { createContext, useContext, useState } from "react";

interface UserDataStruc {
  UserID: number
  UserName: string
  EmailAddress: string
  Address: string
  PhoneNumber: string
  Title: string
};

const DefaultUserStatus : UserDataStruc = {
  UserID: -1,
  UserName: "",
  EmailAddress: "",
  Address: "",
  PhoneNumber: "",
  Title: ""
};

const UserContext = createContext<{
    userData: UserDataStruc;
    setUserData: React.Dispatch<React.SetStateAction<UserDataStruc>>;
  }>({
    userData: DefaultUserStatus,
    setUserData: () => {},
  });

export default function UserContextProvider({children,}: Readonly<{ children: React.ReactNode; }>) {

    const [userData, setUserData] = useState<UserDataStruc>(DefaultUserStatus);
    
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
        {children}
    </UserContext.Provider>
  );
}

export const userContext = () => useContext(UserContext)