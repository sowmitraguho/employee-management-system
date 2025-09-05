
import { Moon, Sun } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useContext } from "react";
import { ThemeContext } from "../../Contexts/ThemeContext/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="
        relative overflow-hidden
        border border-gray-300 dark:border-gray-700
        rounded-full
        hover:border-transparent
        hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-pink-500
        text-gray-700 dark:text-gray-300
        hover:text-white
        transition-all duration-300 ease-in-out
        shadow-sm hover:shadow-md
      "
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </Button>
  );
};

export default ThemeToggle;
