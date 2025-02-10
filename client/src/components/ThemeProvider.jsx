import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  useEffect(() => {
    // Add the theme class (e.g., "dark" or "") to the body element
    document.body.className = theme;
  }, [theme]);
  return (
    <div
      className={`${theme} min-h-screen bg-white text-gray-700 dark:bg-[rgb(16,23,42)] dark:text-gray-200`}
    >
      {children}
    </div>
  );
};

export default ThemeProvider;
