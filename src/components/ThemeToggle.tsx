
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      {theme === 'light' ? (
        <Sun className="h-4 w-4 text-gray-600" />
      ) : (
        <Moon className="h-4 w-4 text-gray-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
