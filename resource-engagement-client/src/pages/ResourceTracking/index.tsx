import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardActionArea,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
} from "@mui/material";
import {
  CheckCircleOutline,
  People,
  AttachMoney,
  Work,
  ChevronRight,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ResourceAnalytics } from "../../types/resourceTracking";
import resourceTrackingService from "../../services/resourceTrackingService";

const ResourceTrackingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<ResourceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await resourceTrackingService.getResourceAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(
        "Failed to load analytics: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography>Loading analytics...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        bgcolor:
          theme.palette.mode === "dark"
            ? "#1e293b" // dark theme: darker background
            : "#fefde8", // light theme: lighter tone of primary color
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 6px rgba(0, 0, 0, 0.3)"
            : "0 4px 6px rgba(0, 0, 0, 0.1)",
      })}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Resource Tracking Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Overview of deliveries, staffing, billing, and recruitment metrics
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {analytics && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              gap: 3,
              mb: 4,
              "& > *": {
                flex: "1 1 0",
                minWidth: 0,
              },
            }}
          >
            {/* Delivery Metrics */}
            <Card sx={{ p: 3, border: 1, borderColor: "primary.main" }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "info.light", color: "info.main" }}>
                  <CheckCircleOutline />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="semibold">
                    Deliveries
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {analytics.totalDeliveries}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {analytics.completedDeliveries} completed •{" "}
                    {analytics.onTimeDeliveries} on time
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Staffing Metrics */}
            <Card sx={{ p: 3, border: 1, borderColor: "primary.main" }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{ bgcolor: "success.light", color: "success.main" }}
                >
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="semibold">
                    Staffing
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {analytics.activeStaffing}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active • {analytics.utilizationRate.toFixed(1)}% utilization
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Billing Metrics */}
            <Card sx={{ p: 3, border: 1, borderColor: "primary.main" }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{ bgcolor: "warning.light", color: "warning.main" }}
                >
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="semibold">
                    Billing
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="warning.main"
                  >
                    ${analytics.totalBillingAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${analytics.paidAmount.toLocaleString()} paid • $
                    {analytics.pendingAmount.toLocaleString()} pending
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Recruitment Metrics */}
            <Card sx={{ p: 3, border: 1, borderColor: "primary.main" }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{ bgcolor: "secondary.light", color: "secondary.main" }}
                >
                  <Work />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="semibold">
                    Recruitment
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="secondary.main"
                  >
                    {analytics.activeRecruitments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active positions • {analytics.filledPositions} filled
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Box>
        )}

        {/* Navigation Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            gap: 3,
            "& > *": {
              flex: "1 1 0",
              minWidth: 0,
            },
          }}
        >
          <Card>
            <CardActionArea
              onClick={() => navigate("/resource-tracking/deliveries")}
              sx={{ p: 3 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Deliveries
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage project deliveries and track progress
                  </Typography>
                </Box>
                <ChevronRight color="action" />
              </Stack>
            </CardActionArea>
          </Card>

          <Card>
            <CardActionArea
              onClick={() => navigate("/resource-tracking/staffing")}
              sx={{ p: 3 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Staffing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage employee assignments and allocations
                  </Typography>
                </Box>
                <ChevronRight color="action" />
              </Stack>
            </CardActionArea>
          </Card>

          <Card>
            <CardActionArea
              onClick={() => navigate("/resource-tracking/billing")}
              sx={{ p: 3 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Billing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track billing records and payment status
                  </Typography>
                </Box>
                <ChevronRight color="action" />
              </Stack>
            </CardActionArea>
          </Card>

          <Card>
            <CardActionArea
              onClick={() => navigate("/resource-tracking/recruitment")}
              sx={{ p: 3 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Recruitment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage job postings and hiring processes
                  </Typography>
                </Box>
                <ChevronRight color="action" />
              </Stack>
            </CardActionArea>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default ResourceTrackingDashboard;
