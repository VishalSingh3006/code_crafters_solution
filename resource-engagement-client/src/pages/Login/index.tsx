import React, { useState } from "react";
import { useAuthLogin } from "../../hooks/authHooks";
import { LoginRequest, TwoFactorVerifyRequest } from "../../types";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MUILink,
  Stack,
  Avatar,
  Divider,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { useTwoFactorVerification } from "../../hooks/twoFactorHooks";

const Login: React.FC = () => {
  const { login } = useAuthLogin();
  const { verify, loading: twoFactorLoading } = useTwoFactorVerification();
  const theme = useTheme();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [twoFactorData, setTwoFactorData] = useState<{
    required: boolean;
    email: string;
    code: string;
  }>({
    required: false,
    email: "",
    code: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);

      if (response.requiresTwoFactor) {
        setTwoFactorData({
          required: true,
          email: formData.email,
          code: "",
        });
      }
      // If no two-factor required, Redux auth state triggers navigation via ProtectedRoute
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const verifyRequest: TwoFactorVerifyRequest = {
        email: twoFactorData.email,
        code: twoFactorData.code,
      };

      await verify(verifyRequest.email, verifyRequest.code);
    } catch (error: any) {
      // Stay on 2FA page and show error - don't reset twoFactorData
      setError(
        error.response?.data?.message ||
          "Invalid verification code. Please try again.",
      );
      // Clear only the code input, keep the 2FA form visible
      setTwoFactorData((prev) => ({ ...prev, code: "" }));
    } finally {
      setLoading(false);
    }
  };

  if (twoFactorData.required) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Two-Factor Authentication
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter the 6-digit code from your authenticator app
          </Typography>
          <Box component="form" onSubmit={handleTwoFactorSubmit} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Verification Code"
                value={twoFactorData.code}
                onChange={(e) =>
                  setTwoFactorData((prev) => ({
                    ...prev,
                    code: e.target.value,
                  }))
                }
                placeholder="123456"
                inputProps={{ maxLength: 6 }}
                required
              />
              {error && <Alert severity="error">{error}</Alert>}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? "Verifying..." : "Verify"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() =>
                    setTwoFactorData({ required: false, email: "", code: "" })
                  }
                >
                  Back to Login
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="sm">
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: "primary.main",
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
              }}
            >
              <LockIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </Avatar>
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
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              Sign in to your account to continue
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                type="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
                autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
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

              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                fullWidth
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
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
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <MUILink
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  fontWeight: 600,
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: theme.palette.primary.dark,
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot your password?
              </MUILink>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <MUILink
                component={RouterLink}
                to="/register"
                sx={{
                  fontWeight: 600,
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: theme.palette.primary.dark,
                    textDecoration: "underline",
                  },
                }}
              >
                Create one now
              </MUILink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
