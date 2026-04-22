import { useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Paper,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { RouteSearchForm } from "./components/RouteSearchForm";
import { MainTabs } from "./components/MainTabs";
import type { RouteQueryParams } from "./hooks/route.hooks";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#355C7D",
      light: "#6E89A0",
      dark: "#23425C",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#61758A",
    },
    background: {
      default: "#F5F7FA",
      paper: "#FCFDFE",
    },
    text: {
      primary: "#1B2733",
      secondary: "#5F6E7C",
    },
    divider: "#D9E0E7",
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: `"Segoe UI", "Inter", "Helvetica Neue", Arial, sans-serif`,
    h3: {
      fontSize: "2.25rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingInline: 18,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 999,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 48,
          fontWeight: 700,
        },
      },
    },
  },
});

function App() {
  const [routeParams, setRouteParams] = useState<RouteQueryParams | null>(null);
  const routeSearchKey = routeParams
    ? [
        routeParams.trainCategory,
        routeParams.trainNumber,
        routeParams.fromEVAStationId,
        routeParams.toEVAStationId,
        routeParams.departureDate.toISOString(),
      ].join(":")
    : null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          py: { xs: 3, md: 5 },
          background: `linear-gradient(180deg, ${alpha("#355C7D", 0.08)} 0%, #F5F7FA 240px)`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "grid", gap: 3 }}>
            <Box sx={{ px: { xs: 0.5, sm: 1 } }}>
              <Typography variant="h3">Biebrza Checker</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Trasa, sklad i wagony w jednym miejscu.
              </Typography>
            </Box>

            <RouteSearchForm onSubmit={setRouteParams} />

            {routeParams ? (
              <MainTabs key={routeSearchKey ?? undefined} routeParams={routeParams} />
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  textAlign: "center",
                  color: "text.secondary",
                  backgroundColor: alpha("#FFFFFF", 0.72),
                }}
              >
                <Typography variant="subtitle1">Wyszukaj pociag, aby zobaczyc szczegoly.</Typography>
              </Paper>
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
