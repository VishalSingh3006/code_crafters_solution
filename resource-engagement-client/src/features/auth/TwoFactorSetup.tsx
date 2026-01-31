import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ContentCopy, CheckCircle } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { twoFactorService } from "../../services/twoFactorService";
import type { ITwoFactorSetup } from "../../types/twoFactor";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { PageHead } from "../../components/ui/PageHead";
import { updateUserTwoFactor } from "../../store/auth/authSlice";

type SetupFormData = {
  code: string;
};

type TwoFactorSetupProps = {
  onComplete?: () => void;
  onCancel?: () => void;
};

export default function TwoFactorSetup(props: TwoFactorSetupProps = {}) {
  const { onComplete, onCancel } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);
  const [setupData, setSetupData] = useState<ITwoFactorSetup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Default callbacks for navigation
  const handleComplete = onComplete || (() => navigate("/2fa/status"));
  const handleCancel = onCancel || (() => navigate("/dashboard"));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupFormData>();

  const steps = ["Setup", "Verify", "Backup Codes"];

  useEffect(() => {
    initializeSetup();
  }, []);

  const initializeSetup = async () => {
    try {
      setLoading(true);
      const data = await twoFactorService.setup();
      console.log("2FA Setup data received:", data);
      setSetupData(data);
      setActiveStep(1);
    } catch (error) {
      console.error("Setup initialization failed:", error);
      setError("Failed to initialize 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SetupFormData) => {
    if (!setupData) return;

    try {
      setLoading(true);
      await twoFactorService.enable({ code: data.code });
      console.log("2FA enabled successfully, updating Redux state...");
      // Update the user's 2FA status in Redux store
      dispatch(updateUserTwoFactor(true));
      console.log("Redux action dispatched");
      setActiveStep(2);
      setShowBackupCodes(true);
    } catch (error) {
      console.error("2FA enable failed:", error);
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleFinish = () => {
    setShowBackupCodes(false);
    handleComplete();
  };

  if (loading && !setupData) {
    return (
      <DashboardLayout>
        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: 2, md: 4 },
            mb: { xs: 2, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHead
        title="Two-Factor Authentication Setup"
        description="Set up two-factor authentication to secure your account with an additional layer of protection"
        keywords="2fa, two factor authentication, security, setup, protection"
      />
      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 2, md: 4 },
          mb: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Card>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={{ xs: 2, md: 3 }}>
              <Typography variant={isMobile ? "h6" : "h5"}>
                Setup Two-Factor Authentication
              </Typography>

              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {activeStep === 1 && setupData && (
                <Stack spacing={3}>
                  <Typography variant="body2">
                    1. Install an authenticator app (Google Authenticator,
                    Authy, etc.)
                  </Typography>

                  <Box textAlign="center" sx={{ px: { xs: 2, md: 0 } }}>
                    {setupData.qrCodeDataUrl ? (
                      <img
                        src={setupData.qrCodeDataUrl}
                        alt="2FA QR Code"
                        style={{
                          maxWidth: "100%",
                          width: "auto",
                          height: "auto",
                          maxHeight: "200px",
                        }}
                        onError={(e) => {
                          console.error(
                            "QR Code failed to load:",
                            setupData.qrCodeDataUrl,
                          );
                          console.error("Error:", e);
                        }}
                        onLoad={() => {
                          console.log("QR Code loaded successfully");
                        }}
                      />
                    ) : (
                      <Typography color="error">
                        QR Code not available
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="body2">
                    2. Scan the QR code or manually enter this secret:
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip label={setupData.manualEntryKey} variant="outlined" />
                    <Button
                      size="small"
                      startIcon={<ContentCopy />}
                      onClick={() => copyToClipboard(setupData.manualEntryKey)}
                    >
                      Copy
                    </Button>
                  </Box>

                  <Typography variant="body2">
                    3. Enter the 6-digit code from your authenticator app:
                  </Typography>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                      <Controller
                        name="code"
                        control={control}
                        rules={{
                          required: "Code is required",
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
                          />
                        )}
                      />

                      <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        gap={2}
                        sx={{ mt: 2 }}
                      >
                        <Button
                          onClick={handleCancel}
                          fullWidth={isSmallScreen}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => navigate("/dashboard")}
                          variant="outlined"
                          fullWidth={isSmallScreen}
                        >
                          Skip for Now
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          fullWidth={isSmallScreen}
                        >
                          {loading ? (
                            <CircularProgress size={20} />
                          ) : (
                            "Verify & Enable"
                          )}
                        </Button>
                      </Box>
                    </Stack>
                  </form>
                </Stack>
              )}

              <Dialog open={showBackupCodes} maxWidth="sm" fullWidth>
                <DialogTitle>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle color="success" />
                    2FA Enabled Successfully
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Stack spacing={2}>
                    <Typography variant="body2">
                      Save these backup codes in a safe place. You can use them
                      to access your account if you lose your authenticator
                      device.
                    </Typography>

                    <Alert severity="warning">
                      Each backup code can only be used once!
                    </Alert>

                    {setupData?.backupCodes && (
                      <Box
                        sx={{
                          fontFamily: "monospace",
                          backgroundColor: "grey.100",
                          p: 2,
                          borderRadius: 1,
                        }}
                      >
                        {setupData.backupCodes.map((code, index) => (
                          <Typography key={index} variant="body2">
                            {code}
                          </Typography>
                        ))}
                      </Box>
                    )}

                    <Button
                      startIcon={<ContentCopy />}
                      onClick={() =>
                        copyToClipboard(setupData?.backupCodes.join("\n") || "")
                      }
                    >
                      Copy All Codes
                    </Button>
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleFinish} variant="contained">
                    I've Saved My Backup Codes
                  </Button>
                </DialogActions>
              </Dialog>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  );
}
