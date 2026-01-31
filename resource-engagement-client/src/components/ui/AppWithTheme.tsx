import { Suspense } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { NotificationsProvider } from "./Notifications";
import { AuthProvider } from "../../contexts/auth/AuthProvider";
import { LoadingFallback } from "./LoadingFallback";
import { useCustomTheme } from "../../hooks/useCustomTheme";
import App from "../../App";

export function AppWithTheme() {
  const { theme } = useCustomTheme();

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationsProvider>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <App />
            </Suspense>
          </AuthProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
