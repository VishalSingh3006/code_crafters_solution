import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Link,
  Divider,
} from "@mui/material";
import { Security, Help } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { AuthLayout } from "./AuthLayout";
import { twoFactorService } from "../../services/twoFactorService";
import { useNavigate } from "react-router-dom";

type VerifyFormData = {
  code: string;
};

type TwoFactorVerifyProps = {
  onSuccess?: (token: string) => void;
  onCancel?: () => void;
  email?: string;
};

export default function TwoFactorVerify(props: TwoFactorVerifyProps = {}) {
  const { onSuccess, onCancel, email } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default callbacks for navigation
  const handleSuccess =
    onSuccess ||
    ((token: string) => {
      console.log("2FA verification successful, token:", token);
      navigate("/dashboard");
    });
  const handleCancel = onCancel || (() => navigate("/dashboard"));
  const [useBackupCode, setUseBackupCode] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerifyFormData>();

  const onSubmit = async (data: VerifyFormData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await twoFactorService.verify({
        code: data.code,
        isBackupCode: useBackupCode,
      });

      if (result.success && result.token) {
        handleSuccess(result.token);
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("2FA verification failed:", error);
      setError(
        useBackupCode
          ? "Invalid backup code. Please check and try again."
          : "Invalid verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleBackupCode = () => {
    setUseBackupCode(!useBackupCode);
    setError(null);
    reset();
  };

  return (
    <AuthLayout title="Two-Factor Authentication" maxWidth={420}>
      <Card elevation={2}>
        <CardContent>
          <Stack spacing={3}>
            <Box textAlign="center">
              <Security color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Security Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {email &&
                  `We sent a verification request to your authenticator app for ${email}`}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Controller
                  name="code"
                  control={control}
                  rules={{
                    required: `${
                      useBackupCode ? "Backup code" : "Verification code"
                    } is required`,
                    pattern: useBackupCode
                      ? undefined
                      : {
                          value: /^\d{6}$/,
                          message: "Verification code must be 6 digits",
                        },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        useBackupCode ? "Backup Code" : "Verification Code"
                      }
                      placeholder={useBackupCode ? "XXXXXXXX" : "123456"}
                      error={!!errors.code}
                      helperText={errors.code?.message}
                      inputProps={{
                        maxLength: useBackupCode ? 8 : 6,
                        style: {
                          textAlign: "center",
                          fontSize: "1.2em",
                          letterSpacing: "0.2em",
                        },
                      }}
                      fullWidth
                      autoFocus
                    />
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  size="large"
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </Stack>
            </form>

            <Divider />

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Having trouble?
              </Typography>

              <Stack spacing={1}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={toggleBackupCode}
                  sx={{ textDecoration: "none" }}
                >
                  {useBackupCode
                    ? "Use authenticator app instead"
                    : "Use a backup code instead"}
                </Link>

                {handleCancel && (
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={handleCancel}
                    sx={{ textDecoration: "none", color: "text.secondary" }}
                  >
                    Back to login
                  </Link>
                )}
              </Stack>
            </Box>

            <Alert severity="info" icon={<Help />}>
              <Typography variant="body2">
                {useBackupCode
                  ? "Enter one of your 8-character backup codes. Each code can only be used once."
                  : "Open your authenticator app and enter the 6-digit code for this account."}
              </Typography>
            </Alert>
          </Stack>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
