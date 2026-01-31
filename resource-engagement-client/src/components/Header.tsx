import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthLogout, useAuthState } from "../hooks/authHooks";
import { ThemeModeContext } from "../context/ThemeContext";

const Header: React.FC = () => {
  const { isAuthenticated } = useAuthState();
  const { logout } = useAuthLogout();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useContext(ThemeModeContext);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleHomeClick = () => {
    navigate(isAuthenticated ? "/dashboard" : "/login", { replace: true });
  };

  return (
    <AppBar position="sticky" color="primary" elevation={1} enableColorOnDark>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          onClick={handleHomeClick}
          sx={{ flexGrow: 1, cursor: "pointer" }}
        >
          Resource Engagement Tracking
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            color="inherit"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mode === "dark" ? "☀️" : "🌙"}
          </Button>

          {isAuthenticated && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={RouterLink} to="/resource-tracking">
                Resource Tracking
              </Button>
              <Button color="inherit" component={RouterLink} to="/profile">
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
