import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";
import { ThemeModeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";
import Header from "./components/Header";
import { setStoreReference } from "./services/baseService";
import SideNav from "./components/SideNav";
import { Box, Toolbar } from "@mui/material";
import { useAppSelector } from "./store/hooks";

// Wire Redux store for API token access
setStoreReference(store);

const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const sideNavOpen = useAppSelector((s) => s.ui.sideNavOpen);

  return (
    <Router>
      <div className="App">
        <Header />
        <Box sx={{ display: "flex" }}>
          {isAuthenticated && <SideNav />}
          <ErrorBoundary>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              {/* Spacer to account for sticky Header height */}
              <Toolbar />
              <AppRoutes />
            </Box>
          </ErrorBoundary>
        </Box>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <ThemeModeProvider>
          <AppLayout />
        </ThemeModeProvider>
      </AuthProvider>
    </ReduxProvider>
  );
};

export default App;
