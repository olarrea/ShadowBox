import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

type ThemeMode = "dark" | "light";

type ThemeContextType = {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  const isDark = theme === "dark";

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
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
      }
    } catch (error) {
      console.log("ERROR CARGANDO TEMA:", error);
    }
  }

  async function saveTheme(value: ThemeMode) {
    try {
      const user = auth.currentUser;

      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          theme: value,
        });
      }
    } catch (error) {
      console.log("ERROR GUARDANDO TEMA:", error);
    }
  }

  function setTheme(value: ThemeMode) {
    setThemeState(value);
    saveTheme(value);
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}