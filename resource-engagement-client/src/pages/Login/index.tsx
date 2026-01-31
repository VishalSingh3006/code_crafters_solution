import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LoginRequest, TwoFactorVerifyRequest } from "../../types";
import { apiService } from "../../services/api";
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
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Login: React.FC = () => {
  const { login, refreshProfile } = useAuth();
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
      const response = await login(formData);

      if (response.requiresTwoFactor) {
        setTwoFactorData({
          required: true,
          email: formData.email,
          code: "",
        });
      }
      // If no two-factor required, AuthContext handles navigation
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

      const response = await apiService.verify2FA(verifyRequest);
      // Properly handle the token and update AuthContext state
      if (response.token) {
        apiService.setAuthToken(response.token);
        await refreshProfile(); // This will update the user state in AuthContext
        // The AuthProvider will automatically redirect authenticated users
      }
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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              fullWidth
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Stack>
        </Box>
        <Box mt={2}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <MUILink component={RouterLink} to="/register">
              Register here
            </MUILink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
