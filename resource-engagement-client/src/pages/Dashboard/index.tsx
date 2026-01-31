import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.firstName} {user.lastName}!
      </Typography>
      <Button variant="outlined" onClick={handleLogout} sx={{ mb: 2 }}>
        Logout
      </Button>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Profile
        </Typography>
        <Stack spacing={1}>
          <Typography>Title: {user.title}</Typography>
          <Typography>
            Name: {user.firstName} {user.lastName}
          </Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Phone: {user.phoneNumber || "Not provided"}</Typography>
          <Typography>Address: {user.address || "Not provided"}</Typography>
          <Typography>Zip Code: {user.zipCode || "Not provided"}</Typography>
          <Typography>
            2FA Enabled: {user.twoFactorEnabled ? "Yes" : "No"}
          </Typography>
        </Stack>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Button variant="contained" href="/profile">
            Edit Profile
          </Button>
          {!user.twoFactorEnabled && (
            <Button variant="outlined" href="/2fa-setup">
              Setup 2FA
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Dashboard;
