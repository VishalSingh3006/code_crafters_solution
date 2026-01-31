import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { StyledEngineProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { CustomThemeProvider } from "./contexts/theme/CustomThemeProvider";
import { AppWithTheme } from "./components/ui/AppWithTheme";
import { setStoreReference } from "./services/baseServices";


// Set store reference for HTTP service
setStoreReference(store);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <CustomThemeProvider>
            <AppWithTheme />
          </CustomThemeProvider>
        </StyledEngineProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
