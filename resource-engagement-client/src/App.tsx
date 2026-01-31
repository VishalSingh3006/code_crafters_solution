import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import { ThemeModeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";
import Header from "./components/Header";
import { setStoreReference } from "./services/baseService";

// Routes moved to src/routes/AppRoutes.tsx

// Wire Redux store for API token access
setStoreReference(store);

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <ThemeModeProvider>
          <Router>
            <div className="App">
              <Header />
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </div>
          </Router>
        </ThemeModeProvider>
      </AuthProvider>
    </ReduxProvider>
  );
};

export default App;
