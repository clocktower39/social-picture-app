import { createTheme } from "@mui/material";
import { store } from './Redux/store';

const baseTypography = {
  fontFamily: '"Space Grotesk", "Archivo", "Segoe UI", sans-serif',
  h1: { fontWeight: 700, letterSpacing: "-0.02em" },
  h2: { fontWeight: 700, letterSpacing: "-0.02em" },
  h3: { fontWeight: 700, letterSpacing: "-0.02em" },
  h4: { fontWeight: 700, letterSpacing: "-0.01em" },
  h5: { fontWeight: 600, letterSpacing: "-0.01em" },
  h6: { fontWeight: 600 },
  subtitle1: { fontWeight: 500 },
  subtitle2: { fontWeight: 500 },
  body1: { fontSize: "1rem", lineHeight: 1.6 },
  body2: { fontSize: "0.95rem", lineHeight: 1.6 },
  button: { textTransform: "none", fontWeight: 600 },
};

const baseComponents = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        minHeight: "100%",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 45%), radial-gradient(circle at 80% 0%, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 40%)",
      },
      "::selection": {
        backgroundColor: "rgba(78, 192, 170, 0.35)",
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 18,
        backgroundImage: "none",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 14,
        padding: "10px 18px",
      },
      contained: {
        boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 14,
      },
      notchedOutline: {
        borderColor: "rgba(0,0,0,0.16)",
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 999,
        fontWeight: 600,
      },
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: {
        borderTop: "1px solid rgba(0,0,0,0.08)",
        backdropFilter: "blur(12px)",
      },
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        paddingTop: 8,
        paddingBottom: 10,
      },
      label: {
        fontWeight: 600,
        fontSize: "0.75rem",
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 22,
        padding: "6px 2px",
      },
    },
  },
};

const lightTheme = {
  palette: {
    mode: "light",
    primary: {
      main: "#137B6A",
      light: "#2E9B89",
      dark: "#0E554B",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F05D23",
      light: "#FF7D4F",
      dark: "#B84214",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F7F4F0",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1B1F23",
      secondary: "#4B5563",
    },
    divider: "rgba(0,0,0,0.08)",
  },
  typography: baseTypography,
  shape: { borderRadius: 16 },
  components: {
    ...baseComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          ...baseComponents.MuiCard.styleOverrides.root,
          border: "1px solid rgba(16,24,40,0.08)",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          ...baseComponents.MuiBottomNavigation.styleOverrides.root,
          backgroundColor: "rgba(255,255,255,0.9)",
        },
      },
    },
  },
};

const darkTheme = {
  palette: {
    mode: "dark",
    primary: {
      main: "#4FD1C5",
      light: "#79E7DD",
      dark: "#2AA99D",
      contrastText: "#0B1C1A",
    },
    secondary: {
      main: "#FFB347",
      light: "#FFD08A",
      dark: "#C77F1F",
      contrastText: "#1A1209",
    },
    background: {
      default: "#0E1416",
      paper: "#151D20",
    },
    text: {
      primary: "#E6EDF3",
      secondary: "#9AA5B1",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: baseTypography,
  shape: { borderRadius: 16 },
  components: {
    ...baseComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100%",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(79,209,197,0.12) 0%, rgba(0,0,0,0) 35%), radial-gradient(circle at 85% 0%, rgba(255,179,71,0.08) 0%, rgba(0,0,0,0) 40%)",
        },
        "::selection": {
          backgroundColor: "rgba(79, 209, 197, 0.45)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 18px 46px rgba(0,0,0,0.45)",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          ...baseComponents.MuiBottomNavigation.styleOverrides.root,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "rgba(14,20,22,0.85)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
        notchedOutline: {
          borderColor: "rgba(255,255,255,0.2)",
        },
      },
    },
  },
};

export const theme = () =>
  createTheme(store.getState().user.themeMode === "dark" ? darkTheme : lightTheme);

