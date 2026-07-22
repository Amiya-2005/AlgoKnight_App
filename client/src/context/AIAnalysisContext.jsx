import { createContext, useContext, useState } from 'react';
import aiAnalysisService from '../services/aiAnalysisService';

export const AIAnalysisContext = createContext();

export const AIAnalysisProvider = ({ children }) => {
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);

    const fetchAnalysis = async (refresh = false) => {
        setLoadingAnalysis(true);
        setAnalysisError(null);
        try {
            const response = await aiAnalysisService.getAnalysis(refresh);
            console.log("Response from server for AI Analysis request :", response);

            if (response.success) {
                setAiAnalysis(response.aiAnalysis);
            } else {
                setAnalysisError(response.message || "Could not generate AI analysis.");
                if (response.aiAnalysis) setAiAnalysis(response.aiAnalysis);
            }
            setHasFetched(true);
            return response;
        }
        catch (error) {
            console.error("Error fetching AI analysis:", error);
            setAnalysisError("Could not reach the AI analyzer.");
            setHasFetched(true);
            return null;
        }
        finally {
            setLoadingAnalysis(false);
        }
    };

    const value = {
        aiAnalysis,
        loadingAnalysis,
        analysisError,
        hasFetched,
        fetchAnalysis
    };

    return <AIAnalysisContext.Provider value={value}>{children}</AIAnalysisContext.Provider>;
};

export const useAIAnalysis = () => useContext(AIAnalysisContext);
