import React, { useState, useEffect } from "react";
import { useAuthForgotPassword } from "../../hooks/authHooks";
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
  useTheme,
  alpha,
} from "@mui/material";
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  MarkEmailRead as MarkEmailReadIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const { forgotPassword, loading, error, success, resetState } =
    useAuthForgotPassword();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await forgotPassword(email.trim());
      setIsSubmitted(true);
    } catch (error) {
      // Error is already handled by the hook
      console.error("Forgot password error:", error);
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setEmail("");
    resetState();
  };

  if (isSubmitted && success) {
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
              textAlign: "center",
              background:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.95)
                  : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Avatar
              sx={{
                m: "0 auto 2",
                bgcolor: "success.main",
                width: { xs: 56, sm: 64 },
                height: { xs: 56, sm: 64 },
              }}
            >
              <MarkEmailReadIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
            </Avatar>

            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "success.main",
                fontSize: { xs: "1.75rem", sm: "2.125rem" },
              }}
            >
              Check Your Email
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              We've sent password reset instructions to:
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: "primary.main",
                wordBreak: "break-word",
              }}
            >
              {email}
            </Typography>

            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {success}
            </Alert>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              If you don't see the email, check your spam folder or try again
              with a different email address.
            </Typography>

            <Stack spacing={2}>
              <Button
                variant="outlined"
                onClick={handleTryAgain}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Try Different Email
              </Button>

              <MUILink
                component={RouterLink}
                to="/login"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  textDecoration: "none",
                  color: "primary.main",
                  fontWeight: 600,
                  py: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "primary.dark",
                  },
                }}
              >
                <ArrowBackIcon fontSize="small" />
                Back to Login
              </MUILink>
            </Stack>
          </Paper>
        </Container>
      </Box>
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
              <EmailIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
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
              Forgot Password?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              Enter your email address and we'll send you instructions to reset
              your password
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoComplete="email"
                autoFocus
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
                disabled={loading || !email.trim()}
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
                {loading
                  ? "Sending Instructions..."
                  : "Send Reset Instructions"}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: "center" }}>
            <MUILink
              component={RouterLink}
              to="/login"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
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
              <ArrowBackIcon fontSize="small" />
              Back to Login
            </MUILink>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
