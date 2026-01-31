import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useCustomTheme } from "../../hooks/useCustomTheme";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated, useAuth } from "../../hooks/useAuth";

export function Header() {
  const { mode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
        <Typography
          variant={isMobile ? "body1" : "h6"}
          component="div"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
            "&:hover": {
              opacity: 0.8,
            },
          }}
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
        >
          Hackathon App
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          {isAuthenticated && (
            <Button
              color="inherit"
              onClick={logout}
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: { xs: 1, sm: 2 },
              }}
            >
              Logout
            </Button>
          )}
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
          >
            {mode === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
