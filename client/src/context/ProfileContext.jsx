import { createContext, useEffect, useState } from "react";
import profileService from "../services/profileService";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {

    const [profileData, setProfileData] = useState(null);

    const getProfileData = async () => {
        try {
            const response = await profileService.getProfileData();
            console.log("Response from server for get profile request :", response);

            setProfileData(response.profileData);
            return response.profileData;
        }
        catch (error) {
            console.error("Error getting profile from server :", error);
            return null;
        }
    };

    const updateProfile = async (new_data) => {
        try {
            const response = await profileService.updateProfile(new_data);
            console.log("Response from server for Edit Handles request :", response);

            getProfileData(); //For syncing the updates
            return response;
        }
        catch (error) {
            console.error("Error updating handles :", error);
            return null;
        }
    };
    const updateHandles = async (new_handles) => {
        try {
            const response = await profileService.updateHandles(new_handles);
            console.log("Response from server for Edit Handles request :", response);

            return response;
        }
        catch (error) {
            console.error("Error updating handles :", error);
            return null;
        }
    };

    const value = {
        profileData,
        setProfileData,
        getProfileData,
        updateProfile,
        updateHandles,
    };

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};