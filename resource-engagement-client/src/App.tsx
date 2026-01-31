import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
// AuthContext removed; use Redux-based auth state
import "./App.css";
import { ThemeModeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";
import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import Header from "./components/Header";
import { setStoreReference } from "./services/baseService";
import SideNav from "./components/SideNav";
import { Box, Toolbar } from "@mui/material";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { setCredentials } from "./store/authSlice";
import AppBreadcrumbs from "./components/AppBreadcrumbs";

// Wire Redux store for API token access
setStoreReference(store);

const AppLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const sideNavOpen = useAppSelector((s) => s.ui.sideNavOpen);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize auth state from localStorage on app startup
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
          const user = JSON.parse(userStr);
          dispatch(setCredentials({ token, user }));
        }
      } catch (error) {
        console.error("Failed to initialize auth from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } finally {
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Don't render anything until auth is initialized
  if (!authInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header />
        {isAuthenticated ? (
          <>
            <Box sx={{ display: "flex" }}>
              {isAuthenticated && <SideNav />}
              <ErrorBoundary>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  {/* Spacer to account for sticky Header height */}
                  {isAuthenticated && <AppBreadcrumbs />}
                  <AppRoutes />
                </Box>
              </ErrorBoundary>
            </Box>
          </>
        ) : (
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        )}
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeModeProvider>
          <AppLayout />
        </ThemeModeProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;
