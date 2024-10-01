import { userContext } from "@/app/Context/ContextProvider";

const useDeAuthorize = () => {
    const { setUserData, setIsUser, setIsDoctor, setIsAdmin } = userContext();

    const deAuthorize = () => {
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
    };
    console.log("Deauthorizing");
    
    return { deAuthorize };
};

export default useDeAuthorize;
