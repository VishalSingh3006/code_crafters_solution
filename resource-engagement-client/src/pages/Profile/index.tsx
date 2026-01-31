import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Alert,
  Link,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setUser } from "../../store/authSlice";
import { UpdateProfileRequest } from "../../types";
import { profileService } from "../../services/profileService";
import { twoFactorService } from "../../services/twoFactorService";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateProfileRequest>({
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      zipCode: "",
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    control: twoFactorControl,
    handleSubmit: handleSubmit2FA,
    reset: reset2FA,
    formState: { isSubmitting: twoFactorLoading },
  } = useForm<{ code: string }>({
    defaultValues: { code: "" },
  });
  const [showTwoFactorDisable, setShowTwoFactorDisable] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        title: user.title ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phoneNumber: user.phoneNumber ?? "",
        address: user.address ?? "",
        zipCode: user.zipCode ?? "",
      });
    }
  }, [user, reset]);

  // Refresh profile only on component mount to get latest 2FA status
  useEffect(() => {
    (async () => {
      try {
        const profile = await profileService.getProfile();
        dispatch(setUser(profile));
      } catch {
        // ignore; errors will be shown by other mechanisms if needed
      }
    })();
  }, [dispatch]);

  const onSubmit = async (data: UpdateProfileRequest) => {
    setError("");
    setSuccess("");
    try {
      const response = await profileService.updateProfile(data);
      if (response.profile) {
        dispatch(setUser(response.profile));
      }
      setSuccess("Profile updated successfully!");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to update profile");
    }
  };

  const onDisable2FA = async ({ code }: { code: string }) => {
    if (!code?.trim()) {
      setError("Please enter your 2FA code to disable");
      return;
    }

    setError("");
    setSuccess("");
    try {
      await twoFactorService.disable(code);
      if (user) {
        dispatch(setUser({ ...user, twoFactorEnabled: false }));
      }
      setSuccess("Two-factor authentication disabled successfully!");
      setShowTwoFactorDisable(false);
      reset2FA({ code: "" });
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to disable 2FA");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">Edit Profile</Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Select {...field} displayEmpty fullWidth>
                    <MenuItem value="">Select Title</MenuItem>
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                    <MenuItem value="Ms.">Ms.</MenuItem>
                    <MenuItem value="Dr.">Dr.</MenuItem>
                  </Select>
                )}
              />

              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First name is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Last name is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Stack>

            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Phone Number" fullWidth />
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Address" fullWidth />
              )}
            />

            <Controller
              name="zipCode"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Zip Code" fullWidth />
              )}
            />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Update your account password to keep your account secure.
          </Typography>

          <Button
            type="button"
            variant="contained"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Two-Factor Authentication
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Status:{" "}
            <strong
              className={
                user?.twoFactorEnabled
                  ? "text-status-enabled"
                  : "text-status-disabled"
              }
            >
              {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
            </strong>
          </Typography>

          {!user?.twoFactorEnabled ? (
            <Stack spacing={1}>
              <Typography variant="body2">
                Enhance your account security by enabling two-factor
                authentication.
              </Typography>
              <Button href="/2fa-setup" variant="contained">
                Enable 2FA
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {!showTwoFactorDisable ? (
                <Button
                  type="button"
                  variant="outlined"
                  color="warning"
                  onClick={() => setShowTwoFactorDisable(true)}
                >
                  Disable 2FA
                </Button>
              ) : (
                <Box component="form" onSubmit={handleSubmit2FA(onDisable2FA)}>
                  <Stack spacing={2}>
                    <Typography variant="body2">
                      Enter your 2FA code to disable two-factor authentication:
                    </Typography>
                    <Controller
                      name="code"
                      control={twoFactorControl}
                      rules={{ required: "Code is required" }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="6-digit code"
                          inputProps={{ maxLength: 6 }}
                          fullWidth
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                    <Stack direction="row" spacing={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="warning"
                        disabled={twoFactorLoading}
                      >
                        {twoFactorLoading ? "Disabling..." : "Disable 2FA"}
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => {
                          setShowTwoFactorDisable(false);
                          reset2FA({ code: "" });
                          setError("");
                        }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
