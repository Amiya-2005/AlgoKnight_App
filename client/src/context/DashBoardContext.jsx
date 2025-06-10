import { createContext, useContext, useState } from 'react';
import dashboardService from '../services/dashboardService';

// Separate contexts for different data
export const DashboardDataContext = createContext();
export const ChallengeContext = createContext();
export const ContestsContext = createContext();

// Dashboard Data Provider (used by main dashboard components)
export const DashboardDataProvider = ({ children }) => {
    const getFullData = async () => {        
        try {
            const response = await dashboardService.getFullData();
            console.log("Response from server for Dashboard Data request :", response);

            return response.fullData;
        }
        catch (error) {
            console.error("Error fetching Dashboard data:", error);
            return null;
        }
    };
    const value = {
        getFullData
    };
    return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
};

// Challenge Provider (used by POTD component)
export const ChallengeProvider = ({ children }) => {
    const [challenge, setChallenge] = useState(null);

    const fetchDaily = async () => {
        if (challenge) return challenge;

        try {
            let daily = await fetch('https://leetcode-api-osgb.onrender.com/daily');
            daily = await daily.json();

            console.log("POTD was fetched");

            if (daily?.questionLink) {
                setChallenge(daily);
                return daily;
            }
        }
        catch (error) {
            console.error("Error fetching POTD:", error);
            console.error(error);
        }
    };

    const value = {
        fetchDaily
    };

    return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>;
};

// Contests Provider (used by upcoming contests component)
export const ContestsProvider = ({ children }) => {
    const [contests, setContests] = useState(null);

    const upcomingContests = async () => {
        if (contests) return contests;

        try {
            let contests = await fetch('https://competeapi.vercel.app/contests/upcoming/');
            contests = await contests.json();

            const response = [
                ...(contests.map(c => {
                    if (c.site === 'leetcode') c.duration /= 60;
                    if (c.site === 'codeforces') c.url = c.url.replace('contest', 'contests');
                    return {
                        name: c.title,
                        startTime: new Date(c.startTime).toISOString(),
                        duration: c.duration / 60000,   // minutes
                        url: c.url,
                        platform: c.site
                    }
                }))
            ];

            response.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

            console.log("Fetched upcoming contests:", response);

            setContests(response);
            return response;
        }
        catch (error) {
            console.error("Error fetching upcoming contest:", error);
            return [];
        }
    };

    const value = {
        upcomingContests
    };

    return <ContestsContext.Provider value={value}>{children}</ContestsContext.Provider>;
};

// Combined Provider (wrap your app with this)
export const DashBordProvider = ({ children }) => {
    return (
        <DashboardDataProvider>
            <ChallengeProvider>
                <ContestsProvider>
                    {children}
                </ContestsProvider>
            </ChallengeProvider>
        </DashboardDataProvider>
    );
};

// Custom hooks for easy access
export const useDashboardData = () => useContext(DashboardDataContext);
export const useChallenge = () => useContext(ChallengeContext);
export const useContests = () => useContext(ContestsContext);