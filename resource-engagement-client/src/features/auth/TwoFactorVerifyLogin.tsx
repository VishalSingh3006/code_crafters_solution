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
import { Security } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { AuthLayout } from "./AuthLayout";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import type { IApiError } from "../../types/apiError";

type VerifyFormData = {
  code: string;
};

export default function TwoFactorVerifyLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyTwoFactor, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [useBackupCode, setUseBackupCode] = useState(false);

  // Get email from location state
  const email = location.state?.email;
  const from = location.state?.from;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerifyFormData>();

  const onSubmit = async (data: VerifyFormData) => {
    try {
      setError(null);
      await verifyTwoFactor(data.code, email || "");

      // Navigate to the original destination or dashboard
      const redirectTo = from?.pathname ?? "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (e) {
      const err = e as IApiError;
      console.error("2FA Verification error:", err);
      setError(
        useBackupCode
          ? "Invalid backup code. Please check and try again."
          : "Invalid verification code. Please try again."
      );
    }
  };

  const toggleBackupCode = () => {
    setUseBackupCode(!useBackupCode);
    setError(null);
    reset();
  };

  const handleCancel = () => {
    navigate("/login", { replace: true });
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
              {email && (
                <Typography variant="body2" color="text.secondary">
                  Enter the verification code for {email}
                </Typography>
              )}
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
                    required: "Verification code is required",
                    pattern: useBackupCode
                      ? {
                          value: /^[0-9]{6}$/,
                          message: "Backup code must be 6 digits",
                        }
                      : {
                          value: /^[0-9]{6}$/,
                          message: "Code must be 6 digits",
                        },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        useBackupCode
                          ? "Enter Backup Code"
                          : "Enter Verification Code"
                      }
                      placeholder={useBackupCode ? "123456" : "123456"}
                      error={!!errors.code}
                      helperText={
                        errors.code?.message ||
                        (useBackupCode
                          ? "Enter one of your backup codes"
                          : "Enter the 6-digit code from your authenticator app")
                      }
                      inputProps={{ maxLength: 6 }}
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

                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button onClick={handleCancel} size="small">
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>

            <Divider />

            <Stack spacing={2} alignItems="center">
              <Link
                component="button"
                variant="body2"
                onClick={toggleBackupCode}
                underline="hover"
              >
                {useBackupCode
                  ? "Use authenticator app instead"
                  : "Use backup code instead"}
              </Link>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
