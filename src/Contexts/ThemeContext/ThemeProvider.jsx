import {React, useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";



const ThemeProvider = ( {children}) => {
     const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    return (
        // <ThemeContext value={{ theme, toggleTheme }}>
        //     {children}
        // </ThemeContext>
        <ThemeContext value={{ theme, toggleTheme }}>
             {children}
        </ThemeContext>
    );
};

export default ThemeProvider;