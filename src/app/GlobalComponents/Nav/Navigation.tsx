'use client'

import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor";
import { useEffect, useRef, useState } from "react";
import MobileNavBar from "./NavComponents/MobileScreenNavigation";
import WideScreenNavBar from "./NavComponents/WideScreenNavigation";

export interface NotificationStructure {
    NotificationID: number
    Urgency: number
    RequesterID: number
    RequesterName: string
    RequesteeID: number
    RequesteeName: string
    NotificationText: string
    Date: string
    RequestType: string
    CompletedStatus: boolean
}
export interface UpdateStruc {
    (NotificationID: number, status: boolean): void;
}
export default function NavBar() {
    const { userData, setUserData, isUser, setIsUser, isAdmin, setIsAdmin, doctorData, setDoctorData, isDoctor, setIsDoctor, wantLogOut, setWantLogOut } = userContext();
    const [wantedScreen, setWantedScreen] = useState<string>("Wide");
    const [ notifications, setNotifications ] = useState<NotificationStructure[]>([]);

    useEffect(() => {
        if (wantLogOut == true) {
            setIsUser(false);
            setIsAdmin(false);
            setIsDoctor(false);

            setUserData({
                UserID: -1,
                UserName: "",
                EmailAddress: "",
                Address: "",
                PhoneNumber: "",
                Title: ""
            });

            setWantLogOut(false);

            console.log("Logged Out")
        }
    },[wantLogOut])

    async function existingSessionCheck() {
        try {
            console.log("Checking for previous Session");

            const response = await API.get("/api/Authorize/PreviousSession");

            if (response.status === 200) {
                setIsUser(true);
                console.log(response.data.userData);
                setUserData(response.data.userData);
            } else if (response.status === 401) {
                console.log("no previous session");
            }
        } catch (error) {
            console.error(error);
        } finally {
            sessionStorage.setItem("PreviousSessionChecked", "True");
        }
    }

    async function refreshToken() {
        try {
            if (!isUser && !isAdmin && !isDoctor) {return};
            const response = await API.post("/api/Authorization/RefreshToken",{ isUser,isDoctor,isAdmin });

            if (response.status === 200) {
                console.log("Token Refreshed");
            }
        } catch (error) {
            console.error(error);
        }
    };

    async function collectNotifications(){
        let cache = [];

        if (isDoctor) {
            console.log(`Collecting Doctor Notifications ${doctorData.id}`);
            const response = await API.get(`/api/Notifications/CollectDoctorNotifications/${doctorData.id}`);

            if (response.status == 200){
                cache = response.data.results;
            }
        } else if (isUser) {
            console.log("Collecting User Notifications");
            const response = await API.get(`/api/Notifications/CollectUserNotifications/${userData.UserID}`);
            
            if (response.status == 200){
                cache = response.data.results;
            }
        } else if (isAdmin) {
            console.log("Collecting Admin Notifications");
            const response = await API.get(`/api/SYSTEM/SYSTEMNOTIFICATIONS/COLLECT`);
            
            if (response.status == 200){
                cache = response.data.results;
            }
        } else {
            setNotifications([{
                NotificationID: -1,
                Date: new Date().toString(),
                RequesteeID: -1,
                RequesteeName: userData.UserName,
                RequesterID: userData.UserID,
                RequesterName: "SYSTEM",
                Urgency: 0,
                NotificationText: "Oops No data",
                RequestType: "No Notifications",
                CompletedStatus: false
            }]);
        };
        if (cache.length !== 0){
            setNotifications(cache);
        } else {
            setNotifications([{
                NotificationID: -1,
                Date: new Date().toString(),
                RequesteeID: -1,
                RequesteeName: userData.UserName,
                RequesterID: userData.UserID,
                RequesterName: "SYSTEM",
                Urgency: 0,
                NotificationText: "Oops No data",
                RequestType: "No Notifications",
                CompletedStatus: false
            }]);
        }
    };

    async function HandleNotificationUpdate(NotificationID : number, status : boolean){
        try {
            const choice = status == true ? "unComplete" : "complete";
            console.log(NotificationID, choice, status);
            
            const response = await API.patch(`/api/Notifications/${NotificationID}/${choice}`, {isUser: isUser, isDoctor: isDoctor, isAdmin: isAdmin});

            if (response.status == 200){
                collectNotifications();
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (sessionStorage.getItem("PreviousSessionChecked") !== "True") {
            existingSessionCheck();
        }
        refreshToken();
        collectNotifications();
        const RefreshInterval = setTimeout(() => {
            refreshToken();
            collectNotifications();
        }, 600000); // Call refresh after 240 seconds
    
        // Set Nav for screen size
        if (window.innerWidth < 750) {
            setWantedScreen("Mobile");
        } else {
            setWantedScreen("Wide");
        }
    
        // Cleanup on unmount
        return () => {
            clearTimeout(RefreshInterval);
        };
    }, []);

    useEffect(() => {
        if (isUser || isAdmin || isDoctor){
            collectNotifications();
        }
    },[isUser, isAdmin, isDoctor]);

    return (
        <>
            {wantedScreen === "Mobile" ? 
                <MobileNavBar wantUpdate={HandleNotificationUpdate} notifications={notifications} isUser={isUser} isAdmin={isAdmin} /> 
                : 
                <WideScreenNavBar wantUpdate={HandleNotificationUpdate} notifications={notifications} isUser={isUser} isAdmin={isAdmin} />
            }
        </>
    );
};