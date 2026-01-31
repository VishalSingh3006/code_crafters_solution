import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  Smartphone,
  Key,
  Refresh,
  Warning,
  CheckCircle,
} from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { twoFactorService } from "../../services/twoFactorService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { updateUserTwoFactor } from "../../store/auth/authSlice";
import type { ITwoFactorStatus } from "../../types/twoFactor";

type DisableFormData = {
  code: string;
};

export default function TwoFactorManage() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<ITwoFactorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [disableLoading, setDisableLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DisableFormData>();

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

  const handleDisable = async (data: DisableFormData) => {
    try {
      setDisableLoading(true);
      await twoFactorService.disable(data.code);
      // Update the user's 2FA status in Redux store
      dispatch(updateUserTwoFactor(false));
      setShowDisableDialog(false);
      reset();
      loadStatus();
    } catch (error) {
      console.error("2FA disable failed:", error);
      setError("Invalid verification code");
    } finally {
      setDisableLoading(false);
    }
  };

  const regenerateBackupCodes = async () => {
    try {
      setLoading(true);
      const result = await twoFactorService.regenerateBackupCodes();
      setBackupCodes(result.backupCodes);
      setShowBackupCodes(true);
      loadStatus();
    } catch (error) {
      console.error("Failed to regenerate backup codes:", error);
      setError("Failed to regenerate backup codes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  if (!status?.isEnabled) {
    return (
      <DashboardLayout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="info">
            Two-factor authentication is not enabled on your account.
          </Alert>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <CheckCircle color="success" />
                  <Typography variant="h6">
                    Two-Factor Authentication Active
                  </Typography>
                </Box>

                <Alert severity="success">
                  Your account is protected with two-factor authentication.
                </Alert>

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Smartphone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Authenticator App"
                      secondary="Connected and active"
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Key />
                    </ListItemIcon>
                    <ListItemText
                      primary="Backup Codes"
                      secondary={`${status.backupCodesCount} codes remaining`}
                    />
                  </ListItem>
                </List>

                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={regenerateBackupCodes}
                    disabled={loading}
                  >
                    Regenerate Backup Codes
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Warning />}
                    onClick={() => setShowDisableDialog(true)}
                  >
                    Disable 2FA
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Disable 2FA Dialog */}
          <Dialog open={showDisableDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={1}>
                <Warning color="warning" />
                Disable Two-Factor Authentication
              </Box>
            </DialogTitle>

            <DialogContent>
              <Stack spacing={3}>
                <Alert severity="warning">
                  Disabling two-factor authentication will make your account
                  less secure. Are you sure you want to continue?
                </Alert>

                <Typography variant="body2">
                  Enter a verification code from your authenticator app to
                  confirm:
                </Typography>

                <form onSubmit={handleSubmit(handleDisable)} id="disable-form">
                  <Controller
                    name="code"
                    control={control}
                    rules={{
                      required: "Verification code is required",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Code must be 6 digits",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Verification Code"
                        placeholder="123456"
                        error={!!errors.code}
                        helperText={errors.code?.message}
                        inputProps={{ maxLength: 6 }}
                        fullWidth
                        autoFocus
                      />
                    )}
                  />
                </form>
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => {
                  setShowDisableDialog(false);
                  setError(null);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="disable-form"
                color="error"
                disabled={disableLoading}
              >
                {disableLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "Disable 2FA"
                )}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Backup Codes Dialog */}
          <Dialog open={showBackupCodes} maxWidth="sm" fullWidth>
            <DialogTitle>New Backup Codes Generated</DialogTitle>

            <DialogContent>
              <Stack spacing={2}>
                <Alert severity="warning">
                  Your old backup codes are no longer valid. Save these new
                  codes in a safe place.
                </Alert>

                <Box
                  sx={{
                    fontFamily: "monospace",
                    backgroundColor: "grey.100",
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  {backupCodes.map((code, index) => (
                    <Typography key={index} variant="body2">
                      {code}
                    </Typography>
                  ))}
                </Box>

                <Button
                  variant="outlined"
                  onClick={() =>
                    navigator.clipboard.writeText(backupCodes.join("\n"))
                  }
                >
                  Copy All Codes
                </Button>
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => setShowBackupCodes(false)}
                variant="contained"
              >
                I've Saved My Codes
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Container>
    </DashboardLayout>
  );
}
