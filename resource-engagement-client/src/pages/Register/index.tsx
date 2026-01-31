import React, { useState } from "react";
import { RegisterRequest } from "../../types";
import { baseServices } from "../../services/baseService";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link as MUILink,
  Stack,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Link as RouterLink } from "react-router-dom";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    title: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    zipCode: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await baseServices.post("auth/register", formData);
      setSuccess("Registration successful! You can now login.");
      setFormData({
        email: "",
        password: "",
        title: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        zipCode: "",
      });
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Register
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="title-label">Title</InputLabel>
                <Select
                  labelId="title-label"
                  id="title"
                  label="Title"
                  value={formData.title}
                  onChange={(e: SelectChangeEvent) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                >
                  <MenuItem value="">Select Title</MenuItem>
                  <MenuItem value="Mr.">Mr.</MenuItem>
                  <MenuItem value="Mrs.">Mrs.</MenuItem>
                  <MenuItem value="Ms.">Ms.</MenuItem>
                  <MenuItem value="Dr.">Dr.</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
                }
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
                }
                required
              />
            </Box>

            <TextField
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
              }
              required
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
                }
                required
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                type="tel"
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
                }
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={(e) =>
                  handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
                }
              />
            </Box>

            <TextField
              fullWidth
              label="Zip Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={(e) =>
                handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
              }
            />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Stack>
        </Box>

        <Box mt={2}>
          <Typography variant="body2">
            Already have an account?{" "}
            <MUILink component={RouterLink} to="/login">
              Login here
            </MUILink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
