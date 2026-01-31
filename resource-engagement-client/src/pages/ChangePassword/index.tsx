import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (data: ChangePasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (data.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    setError("");
    setSuccess("");
    try {
      await authService.changePassword(data.currentPassword, data.newPassword);
      setSuccess("Password changed successfully!");
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Navigate back to profile after 2 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: 2, sm: 3 },
            background:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.95)
                : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                : "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <IconButton
              onClick={() => navigate("/profile")}
              sx={{
                color: "primary.main",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LockIcon
                sx={{
                  color: "primary.main",
                  fontSize: { xs: 28, sm: 32 },
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1.75rem", sm: "2.125rem" },
                }}
              >
                Change Password
              </Typography>
            </Box>
          </Stack>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Update your account password to keep your account secure. Make sure
            to choose a strong password that you don't use elsewhere.
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Controller
                name="currentPassword"
                control={control}
                rules={{ required: "Current password is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Current Password"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? "0 4px 20px rgba(255, 255, 255, 0.1)"
                              : "0 4px 20px rgba(0, 0, 0, 0.1)",
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="newPassword"
                control={control}
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="New Password"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? "0 4px 20px rgba(255, 255, 255, 0.1)"
                              : "0 4px 20px rgba(0, 0, 0, 0.1)",
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Confirm New Password"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? "0 4px 20px rgba(255, 255, 255, 0.1)"
                              : "0 4px 20px rgba(0, 0, 0, 0.1)",
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      },
                    }}
                  />
                )}
              />

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    "& .MuiAlert-message": {
                      fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    },
                  }}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  sx={{
                    borderRadius: 2,
                    "& .MuiAlert-message": {
                      fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    },
                  }}
                >
                  {success}
                </Alert>
              )}

              <Stack direction="row" spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transform: "translateY(-2px)",
                    },
                    "&:disabled": {
                      background: theme.palette.action.disabledBackground,
                      boxShadow: "none",
                    },
                  }}
                >
                  {isSubmitting ? "Changing Password..." : "Change Password"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate("/profile")}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChangePassword;
