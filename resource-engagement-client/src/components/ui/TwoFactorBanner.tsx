import { useState } from "react";
import { Alert, AlertTitle, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/auth/authThunks";

export function TwoFactorBanner() {
  const [dismissed, setDismissed] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  console.log(
    "TwoFactorBanner - Component mounted, isAuthenticated:",
    isAuthenticated
  );
  console.log("TwoFactorBanner - User:", user);

  const handleSetupNow = () => {
    setDismissed(true);
    navigate("/2fa/setup");
  };

  const handleSetupLater = () => {
    setDismissed(true);
  };
  console.log(
    "TwoFactorBanner - user.twoFactorEnabled:",
    user?.twoFactorEnabled
  );
  // Don't show banner if:
  // - User not authenticated
  // - No user data
  // - 2FA already enabled
  // - User dismissed the banner
  if (!isAuthenticated || !user || user.twoFactorEnabled || dismissed) {
    console.log("TwoFactorBanner - Not showing banner", {
      isAuthenticated,
      user: !!user,
      twoFactorEnabled: user?.twoFactorEnabled,
      dismissed,
    });
    return null;
  }

  console.log("TwoFactorBanner - Showing banner");
  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, pt: 1, mb: { xs: 2, md: 0 } }}>
      <Alert
        severity="info"
        variant="outlined"
        onClose={handleSetupLater}
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              minWidth: { xs: 120, sm: "auto" },
            }}
          >
            <Button
              color="inherit"
              size="small"
              onClick={handleSetupLater}
              sx={{
                whiteSpace: "nowrap",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Later
            </Button>
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              onClick={handleSetupNow}
              sx={{
                whiteSpace: "nowrap",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Set Up Now
            </Button>
          </Box>
        }
      >
        <AlertTitle>Secure Your Account</AlertTitle>
        Enhance your account security by enabling two-factor authentication
        (2FA).
      </Alert>
    </Box>
  );
}
