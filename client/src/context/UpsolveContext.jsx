import { createContext } from "react";
import contestService from "../services/contestService";

export const UpsolveContext = createContext();

export const UpsolveProvider = ({ children }) => {

    const getUpsolve = async () => {
        try {
            const response = await contestService.getUpsolve();

            console.log("Response form server for upsolve contests : ", response);
            return response.recent_contests;
        }
        catch (error) {
            console.log("Server call failed for upsolve contests")
        }
    }
    const getFavorites = async () => {
        try {
            const response = await contestService.getFavorites();

            console.log("Response form server for get fav contests : ", response);
            return response.favorites;
        }
        catch (error) {
            console.log("Server call failed for get fav contests")
        }
    }
    const addToFavorite = async (contest_data) => {
        try {
            const response = await contestService.addToFavorite(contest_data);

            console.log("Response form server for add to fav contests : ", response);
            return response;
        }
        catch (error) {
            console.log("Server call failed for add to fav contests")
        }
    }
    const removeFromFavorite = async (url) => {
        try {
            const response = await contestService.removeFromFavorite(url);

            console.log("Response form server for remove from fav contests : ", response);
            return response;
        }
        catch (error) {
            console.log("Server call failed for remove from fav contests")
        }
    }


    const value = {
        getUpsolve,
        getFavorites,
        addToFavorite,
        removeFromFavorite
    }
    return <UpsolveContext.Provider value={value}>{children}</UpsolveContext.Provider>
}