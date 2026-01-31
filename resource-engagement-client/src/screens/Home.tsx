import {
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { HomeLayout } from "./HomeLayout";
import { PageHead } from "../components/ui/PageHead";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <HomeLayout>
      <PageHead
        title="Home"
        description="Welcome to our React application with MUI, Tailwind, Router, Redux and React Hook Form"
        keywords="react, home, welcome, typescript, mui, tailwind"
      />
      <Box className="animate-slide-up">
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          className="text-gradient"
        >
          Welcome
        </Typography>
      </Box>
      <Typography variant="body1" gutterBottom sx={{ mb: { xs: 2, md: 3 } }}>
        This is a starter with MUI + Tailwind + Router + Redux + RHF.
      </Typography>
      <Box className="bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-4 mb-4">
        <Typography variant="body2" className="text-brand-primary-700">
          🎨 New: Custom brand colors and design system now available! Check out
          the enhanced styling throughout the app.
        </Typography>
      </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={2}
        mt={2}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          fullWidth={isMobile}
          size={isMobile ? "medium" : "large"}
        >
          Login
        </Button>
        <Button
          component={RouterLink}
          to="/signup"
          variant="outlined"
          fullWidth={isMobile}
          size={isMobile ? "medium" : "large"}
        >
          Sign up
        </Button>
      </Stack>
    </HomeLayout>
  );
}
