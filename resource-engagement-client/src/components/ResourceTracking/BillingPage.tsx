import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BillingList from "./BillingList";

export default function BillingPage() {
  const navigate = useNavigate();

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" component="h1">
          Billing Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          onClick={() => navigate("/billing/rates")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Billing Rates
        </Button>
      </Stack>
      <BillingList />
    </Box>
  );
}
