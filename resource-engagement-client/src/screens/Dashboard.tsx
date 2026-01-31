import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { TwoFactorBanner } from "../components/ui/TwoFactorBanner";
import DashboardLayout from "../components/layout/DashboardLayout";
import { PageHead } from "../components/ui/PageHead";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <PageHead
        title="Dashboard"
        description={`Dashboard for ${user?.name || user?.email || "User"} - View your account overview and statistics`}
        keywords="dashboard, account, overview, statistics, user"
      />
      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 2, md: 4 },
          mb: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
          pl: { xs: 7, sm: 8, md: 2 }, // Extra left padding to avoid toggle button
        }}
      >
        <TwoFactorBanner />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Welcome to your dashboard, {user?.name || user?.email || "User"}!
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 3 }}
            sx={{ mt: { xs: 2, md: 3 } }}
          >
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your account overview and statistics.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your recent account activities and updates.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.twoFactorEnabled
                      ? "Two-factor authentication is enabled"
                      : "Consider enabling two-factor authentication"}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Stack>
        </Box>
      </Container>
    </DashboardLayout>
  );
}
