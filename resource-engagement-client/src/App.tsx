import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { Box } from "@mui/material";
import { routes } from "./routes/index";
import { Header } from "./components/header/Header";
import { LoadingFallback } from "./components/ui/LoadingFallback";
import { TwoFactorBanner } from "./components/ui/TwoFactorBanner";

function App() {
  const element = useRoutes(routes);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <TwoFactorBanner />
      <Box sx={{ flexGrow: 1 }}>
        <Suspense fallback={<LoadingFallback />}>{element}</Suspense>
      </Box>
    </Box>
  );
}

export default App;
