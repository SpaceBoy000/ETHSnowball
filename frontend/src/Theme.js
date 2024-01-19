import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(255, 255, 255)",
    },
    secondary: {
      main: "#f4b52d",
    },
    purple: {
      main: "#004AAD",
    },
    text: {
      primary: "#17215E",
    },
  },
  button: {
    primary: {
      main: "#004AAD",
    },
    secondary: {
      main: '#004AAD',
    }
  },
  typography: {
    fontFamily: "Roboto",
    body1: {
      fontSize: 20,
      fontWeight: "bolder",
    },
    body2: {
      fontSize: 16,
    },
    body5: {
      fontSize: 40,
      color: "#004AAD",
      fontWeight: 900,
    },
    body6: {
      fontSize: 40,
      color: "#004AAD",
      fontWeight: 900,
    },
    body7: {
      fontSize: 14,
      color: "#004AAD",
      fontWeight: 900,
    },
    allVariants: {
      color: "white", // "rgb(224, 224, 224)",
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
      fontSize: 46,
    },
    h4: {
      fontWeight: 600,
      fontSize: 32,
    },
    h5: {
      fontSize: 24,
      fontWeight: 500,
      color: '#004AAD',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "6px 6px 20px 6px #00000096",
          borderRadius: 20,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "12px 24px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 400,
          fontSize: "1.2rem",
          padding: "10px",
          minWidth: 138,
        },
        contained: {
          boxShadow: "6px 6px 20px 6px #00000096",
        },
        containedSecondary: {
          color: "#17215E",
        },
      },
    },
  },
});

export default function Theme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
