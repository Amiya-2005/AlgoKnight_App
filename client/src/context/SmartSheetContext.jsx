import { createContext } from "react";
import smartsheetService from "../services/smartsheetService";

export const SmartSheetContext = createContext();

export const SmartSheetProvider = ({ children }) => {

    const getFullSheet = async () => {        
        try {
            const response = await smartsheetService.getFullSheet();
            console.log("Response from server for Smart Sheet request :", response);

            return response.smartSheet;
        }
        catch (error) {
            console.error("Error fetching smartsheet data:", error);
            return null;
        }
    };

    const value = {
        getFullSheet
    };

    return <SmartSheetContext.Provider value={value}>{children}</SmartSheetContext.Provider>;
};