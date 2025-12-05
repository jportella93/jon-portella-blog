import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setMounted(true);
    // Get theme from localStorage or default to 'system'
    const savedTheme = (localStorage.getItem("theme") || "system") as Theme;
    setTheme(savedTheme);

    // Set initial system preference
    setSystemPrefersDark(
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const root = window.document.documentElement;

    // Only remove classes if we're changing the theme (not on initial mount)
    // This prevents flicker on initial load
    const currentClasses = root.classList;
    const hasLight = currentClasses.contains("light");
    const hasDark = currentClasses.contains("dark");

    let targetClass = "";
    if (theme === "system") {
      targetClass = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      targetClass = theme;
    }

    // Only update if the class needs to change
    if (targetClass === "light" && !hasLight) {
      root.classList.remove("dark");
      root.classList.add("light");
    } else if (targetClass === "dark" && !hasDark) {
      root.classList.remove("light");
      root.classList.add("dark");
    } else if (!hasLight && !hasDark) {
      // No class set yet, add the target class
      root.classList.add(targetClass);
    }

    // Save to localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== "system" || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setSystemPrefersDark(mediaQuery.matches);
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  // During static generation, use light theme as default
  const isDarkMode = mounted
    ? theme === "dark" || (theme === "system" && systemPrefersDark)
    : false;

  const value = {
    theme,
    setTheme,
    mounted,
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // During static generation, provide default values
    return {
      theme: "system",
      setTheme: () => {},
      mounted: false,
      isDarkMode: false,
    };
  }
  return context;
}
