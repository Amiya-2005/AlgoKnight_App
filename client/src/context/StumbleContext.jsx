import { createContext } from "react";
import stumbleService from "../services/stumbleService";

export const StumbleContext = createContext();

export const StumbleProvider = ({ children }) => {

    const getAllStumbles = async () => {
        try {
            const response = await stumbleService.getAllStumbles();

            console.log("Response form server for get stumbles : ", response);
            return response.allStumbles;
        }
        catch (error) {
            console.log("Server call failed for get stumbles")
        }
    }
    const addStumble = async (problem_data) => {
        try {
            const response = await stumbleService.addStumble(problem_data);

            console.log("Response form server for add stumble : ", response);
            return response;
        }
        catch (error) {
            console.log("Server call failed for add stumble")
        }
    }
    const removeStumble = async (index) => {
        try {
            const response = await stumbleService.removeStumble(index);

            console.log("Response form server for remove stumble : ", response);
            return response;
        }
        catch (error) {
            console.log("Server call failed for remove stumble")
        }
    }


    const value = {
        getAllStumbles,
        addStumble,
        removeStumble,
    }
    return <StumbleContext.Provider value={value}>{children}</StumbleContext.Provider>
}