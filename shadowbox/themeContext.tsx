import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

type ThemeMode = "dark" | "light";
type LanguageMode = "es" | "en";

type ThemeContextType = {
  theme: ThemeMode;
  isDark: boolean;
  language: LanguageMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: LanguageMode) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  isDark: true,
  language: "es",
  toggleTheme: () => {},
  setTheme: () => {},
  setLanguage: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [language, setLanguageState] = useState<LanguageMode>("es");

  const isDark = theme === "dark";

  useEffect(() => {
    loadUserPreferences();
  }, []);

  async function loadUserPreferences() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();

        if (data.theme === "light" || data.theme === "dark") {
          setThemeState(data.theme);
        }

        if (data.language === "es" || data.language === "en") {
          setLanguageState(data.language);
        }
      }
    } catch (error) {
      console.log("ERROR CARGANDO PREFERENCIAS:", error);
    }
  }

  async function savePreference(field: "theme" | "language", value: string) {
    try {
      const user = auth.currentUser;

      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          [field]: value,
        });
      }
    } catch (error) {
      console.log("ERROR GUARDANDO PREFERENCIA:", error);
    }
  }

  function setTheme(value: ThemeMode) {
    setThemeState(value);
    savePreference("theme", value);
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }

  function setLanguage(value: LanguageMode) {
    setLanguageState(value);
    savePreference("language", value);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        language,
        toggleTheme,
        setTheme,
        setLanguage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}