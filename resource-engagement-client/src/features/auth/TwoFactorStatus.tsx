import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Security, CheckCircle, Warning } from "@mui/icons-material";
import { twoFactorService } from "../../services/twoFactorService";
import type { ITwoFactorStatus } from "../../types/twoFactor";
import TwoFactorSetup from "./TwoFactorSetup";

export default function TwoFactorStatus() {
  const [status, setStatus] = useState<ITwoFactorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await twoFactorService.getStatus();
      setStatus(data);
    } catch (error) {
      console.error("Failed to load 2FA status:", error);
      setError("Failed to load 2FA status");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    loadStatus();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (showSetup) {
    return (
      <TwoFactorSetup
        onComplete={handleSetupComplete}
        onCancel={() => setShowSetup(false)}
      />
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Security color={status?.isEnabled ? "primary" : "disabled"} />
            <Typography variant="h6">Two-Factor Authentication</Typography>
            <Chip
              label={status?.isEnabled ? "Enabled" : "Disabled"}
              color={status?.isEnabled ? "success" : "default"}
              icon={status?.isEnabled ? <CheckCircle /> : <Warning />}
            />
          </Box>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary">
            Two-factor authentication adds an extra layer of security to your
            account.
            {status?.isEnabled &&
              ` You have ${status.backupCodesCount} backup codes remaining.`}
          </Typography>

          {status?.isEnabled ? (
            <Stack spacing={2}>
              <Alert severity="success">
                Two-factor authentication is active on your account.
              </Alert>
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setShowSetup(true)}
                >
                  Disable 2FA
                </Button>
              </Box>
            </Stack>
          ) : (
            <Button
              variant="contained"
              onClick={() => setShowSetup(true)}
              startIcon={<Security />}
            >
              Enable Two-Factor Authentication
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
