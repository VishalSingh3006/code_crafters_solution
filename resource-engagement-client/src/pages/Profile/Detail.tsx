import React from "react";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";

const ProfileDetail: React.FC = () => {
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" fontWeight={700}>
              Profile
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="body1">{user?.title || "—"}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="body1">
                  {user?.firstName || "—"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1">{user?.lastName || "—"}</Typography>
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{user?.email || "—"}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1">
                  {user?.phoneNumber || "—"}
                </Typography>
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">{user?.address || "—"}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Zip Code
                </Typography>
                <Typography variant="body1">{user?.zipCode || "—"}</Typography>
              </Box>
            </Stack>

            <Stack>
              <Typography variant="caption" color="text.secondary">
                Two-Factor Authentication
              </Typography>
              <Typography variant="body1">
                {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfileDetail;
