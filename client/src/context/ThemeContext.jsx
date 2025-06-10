import { createContext, useState, useEffect, useContext } from 'react';
import { ProfileContext } from './ProfileContext';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState('dark');

  useEffect(() => {

    if(theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};