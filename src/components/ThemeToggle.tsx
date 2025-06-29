
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="relative h-9 w-9 p-0 border-purple-200 hover:border-purple-300 dark:border-purple-700 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/50"
    >
      <motion.div
        key={theme}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center"
      >
        {theme === 'light' ? (
          <Sun className="h-4 w-4 text-purple-600" />
        ) : (
          <Moon className="h-4 w-4 text-purple-400" />
        )}
      </motion.div>
    </Button>
  );
};
