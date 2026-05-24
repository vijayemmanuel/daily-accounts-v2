import { createTheme, ThemeProvider as MUIThemeProvider,  PaletteMode, useColorScheme } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import { useContext, ReactNode, createContext, useMemo, useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from "@mui/material/useMediaQuery";

export interface ThemeContextType {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

// We define the context to hold our Theme object
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function MyThemeProvider({ children }: ThemeProviderProps) {
  const scheme = useColorScheme();

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Initialize state based on system preference
  const [mode, setMode] = useState<PaletteMode>(prefersDarkMode ? 'dark' : 'light');

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      console.log('Toggled color mode to:', mode === 'light' ? 'dark' : 'light');
    },
    mode}), 
  [mode]); 

  // 1. Create the theme dynamically based on the current 'mode'
  const theme = useMemo(() => createTheme({
    palette: {
      mode, // This tells MUI to use its built-in dark or light defaults
      primary: {
        main: blueGrey[900],
      },
      secondary: {
        main: '#f44336',
      }
    }
   }), 
    [mode]);
  
  /*
  const theme = createTheme({
    //colorSchemes: {
    //dark: true
    //},
    palette: {

    primary: {
      main: purple[500],
    },
    secondary: {
      main: '#f44336',
    },
  },
});
*/


  return (
    <ThemeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={theme}>
        {/* CssBaseline kicks off the global CSS reset and sets background colors */}
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook for custom components to access theme variables
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  // Optional: Throw an error if hook is used outside of provider
  if (!context) {
    // This handles the edge case where the hook is used outside the provider
    throw new Error("useAppTheme must be used within a MyThemeProvider");

  }
  console.log('useAppTheme called, current mode:', context?.mode);
  return context;
};


//export default theme;