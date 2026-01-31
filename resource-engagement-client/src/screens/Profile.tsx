import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { Person, Email, Security } from "@mui/icons-material";
import DashboardLayout from "../components/layout/DashboardLayout";
import { PageHead } from "../components/ui/PageHead";

export default function Profile() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <PageHead
        title="Profile"
        description={`Profile page for ${user?.name || user?.email || "User"} - Manage your account information and settings`}
        keywords="profile, account, settings, user information, personal"
      />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
          <Box sx={{ minWidth: { md: "300px" } }}>
            <Card>
              <CardContent>
                <Stack spacing={3} alignItems="center">
                  <Avatar
                    sx={{
                      width: { xs: 80, md: 120 },
                      height: { xs: 80, md: 120 },
                      bgcolor: "primary.main",
                      fontSize: { xs: "2rem", md: "3rem" },
                    }}
                  >
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : user?.email
                        ? user.email.charAt(0).toUpperCase()
                        : "U"}
                  </Avatar>

                  <Stack spacing={1} alignItems="center">
                    <Typography variant="h5">
                      {user?.name || user?.email || "User"}
                    </Typography>

                    <Chip
                      icon={<Security />}
                      label={
                        user?.twoFactorEnabled ? "2FA Enabled" : "2FA Disabled"
                      }
                      color={user?.twoFactorEnabled ? "success" : "warning"}
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Person color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">
                        {user?.name || "Not provided"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Email color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1">
                        {user?.email || "Not available"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Security color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body1">
                        {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Typography>
                      {!user?.twoFactorEnabled && (
                        <Typography variant="body2" color="text.secondary">
                          Enable 2FA to secure your account
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Person color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        User ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {user?.id || "Not available"}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Container>
    </DashboardLayout>
  );
}
