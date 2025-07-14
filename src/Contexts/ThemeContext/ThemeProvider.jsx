import { React, useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import Spinner from "../../Components/Spinner/Spinner";



const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light');
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
   // console.log(prefersDark, storedTheme);
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme(prefersDark ? "dark" : "light");
    }
    // Allow theme to apply before showing the app
    setTimeout(() => setLoading(false), 0); // optional small delay to ensure DOM updates
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    //console.log('inside useEffect', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    //console.log(theme);
  }

  if(loading) {
    return <Spinner/>
  }

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
};

export default ThemeProvider;