import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { ProfileContext } from './ProfileContext';
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "algoknight-25.firebaseapp.com",
  projectId: "algoknight-25",
  storageBucket: "algoknight-25.firebasestorage.app",
  messagingSenderId: "75728146250",
  appId: "1:75728146250:web:d5402373ce36b3402f7bb3",
  measurementId: "G-9V77Y1WSVW"
};

export const app = initializeApp(firebaseConfig);
export const AuthContext = createContext();

export let logoutUser = null; //To be used by api.js (so created separately)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(loading);
  const [fadeOutLoader, setFadeOutLoader] = useState(!loading);

  const { profileData, getProfileData } = useContext(ProfileContext);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await getProfileData();  
      } catch (err) {
        console.error('Authentication error:', err);
        authService.logout();
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (!profileData) initAuth();
    else setCurrentUser(profileData.personal);
  }, [profileData]);


  const login = async (credentials) => {
    const response = await authService.login(credentials);

    if (response.success === true) {
      const userData = await getProfileData();
      setCurrentUser(userData.personal);
    }
    return response;
  };

  const register = async (credentials) => {
    let response = await authService.register(credentials);

    if (response.success === true) return(login(credentials))

    return response;
  };

  const OAuth = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const result = await signInWithPopup(auth, provider);

    const response = await authService.gsign({
      fullName: result.user.displayName,
      userName: result.user.displayName.toLowerCase().split(' ')[0],
      email: result.user.email,
    })

    if (response.success === true) {
      const userData = await getProfileData();
      setCurrentUser(userData.personal);
    }

    console.log("Google-Auth successful !");
    return response;
  }

  const logout = () => {
    authService.logout();
    setCurrentUser(null);

    console.log("Logged out message from auth context...");

    return {
      success: true,
      message: "Logged out successfully"
    }
  };

  logoutUser = logout; //For use in non-react files (api.js)

  const value = {
    currentUser,
    loading,
    setLoading,
    showLoader,
    setShowLoader,
    fadeOutLoader,
    setFadeOutLoader,
    login,
    register,
    OAuth,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

