import { userContext } from "@/app/Context/ContextProvider";

export default function DeAuthorize(){
    const { userData, setUserData, isUser, setIsUser, isDoctor, setIsDoctor, isAdmin, setIsAdmin } = userContext();

    setUserData({  
        UserID: -1,
        UserName: "",
        EmailAddress: "",
        Address: "",
        PhoneNumber: "",
        Title: ""
    });
    setIsUser(false);
    setIsDoctor(false);
    setIsAdmin(false);
    
}