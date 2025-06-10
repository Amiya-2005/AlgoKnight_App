import { createContext } from "react";
import networkService from "../services/networkService";

export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {

    const getAllConnections = async () => {
        try {
            const response = await networkService.getAllConnections();
            console.log("All network fetched successfully");
            return response.networkData;
        }
        catch (error) {
            console.log("Network fetch failed, ERROR : ", error);
        }
    }

    const toggleConnection = async (cid) => {
        try{
            const response = await networkService.toggleConnection(cid);
            console.log("Connection toggled successfully");
            return response;
        }
        catch(error){
            console.log("Connection toggle failed, ERROR : ", error);
        }
    }

    const searchUser = async (keyword) => {
        try{
            const response = await networkService.searchUsers(keyword);
            console.log("Search results fetched successfully", response.searchResults);
            return response.searchResults;
        }
        catch(error){
            console.log("Search failed, ERROR : ", error);
        }
    }

    const value = {
        getAllConnections,
        toggleConnection,
        searchUser
    }
    return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
}