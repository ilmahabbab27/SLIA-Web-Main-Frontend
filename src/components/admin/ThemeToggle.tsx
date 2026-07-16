import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ADMIN_THEME_KEY = "admin-theme";

export const useAdminTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem(ADMIN_THEME_KEY);
    return (stored as "light" | "dark") || "dark";
  });

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(ADMIN_THEME_KEY, next);
      return next;
    });
  };

  return { theme, toggleTheme };
};

export const ThemeToggle = ({ theme, onToggle }: { theme: "light" | "dark"; onToggle: () => void }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg transition-colors"
      style={{
        backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        color: theme === "dark" ? "#94a3b8" : "#64748b",
      }}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
