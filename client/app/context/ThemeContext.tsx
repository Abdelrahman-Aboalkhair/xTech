import { createContext, useContext, ReactNode } from "react";
import { useGetThemeByIdQuery } from "../store/apis/ThemeApi";

interface Theme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  isActive: boolean;
  fontFamily: string;
  // Optional properties like accentColor, textColor, backgroundColor, etc.
}

const ThemeContext = createContext<Theme | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { data, isLoading, error } = useGetThemeByIdQuery(1);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading theme.</div>;

  return (
    <ThemeContext.Provider value={data?.theme ?? null}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
