import { createContext } from "react";
import smartsheetService from "../services/smartsheetService";

export const SmartSheetContext = createContext();

export const SmartSheetProvider = ({ children }) => {

    const getFullSheet = async (refresh = false) => {
        try {
            const response = await smartsheetService.getFullSheet(refresh);
            console.log("Response from server for Smart Sheet request :", response);

            return {
                sheet: response.smartSheet,
                personalized: response.personalized ?? false,
                lastUpdated: response.lastUpdated ?? null,
            };
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