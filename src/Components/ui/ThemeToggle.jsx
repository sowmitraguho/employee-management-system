
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { ThemeContext } from "../../Contexts/ThemeContext/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
