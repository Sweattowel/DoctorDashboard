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

    isUser: boolean;
    setIsUser: React.Dispatch<React.SetStateAction<boolean>>;

    isDoctor: boolean;
    setIsDoctor: React.Dispatch<React.SetStateAction<boolean>>;

    isAdmin: boolean;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  }>({
    userData: DefaultUserStatus,
    setUserData: () => {},

    isUser: false,
    setIsUser: () => {},

    isDoctor: false,
    setIsDoctor: () => {},

    isAdmin: false,
    setIsAdmin: () => {},
  });

export default function UserContextProvider({children,}: Readonly<{ children: React.ReactNode; }>) {

    const [userData, setUserData] = useState<UserDataStruc>(DefaultUserStatus);
    const [isUser, setIsUser] = useState<boolean>(false);
    const [isDoctor, setIsDoctor] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    
  return (
    <UserContext.Provider 
      value={
        { 
          userData, setUserData,
          isUser, setIsUser,
          isDoctor, setIsDoctor,
          isAdmin, setIsAdmin,
        }
      }
    >
        {children}
    </UserContext.Provider>
  );
}

export const userContext = () => useContext(UserContext)