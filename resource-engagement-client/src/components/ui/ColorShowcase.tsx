import React from "react";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";
import {
  getBrandColor,
  getStatusColor,
  brandColors,
} from "../../styles/colors";

export const ColorShowcase: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Brand Colors & Design System
      </Typography>

      {/* Brand Colors */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Brand Colors
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Box className="text-center">
              <div
                className="w-16 h-16 rounded-lg mb-2 bg-brand-primary-500"
                style={{ backgroundColor: getBrandColor(500) }}
              />
              <Typography variant="caption">Primary</Typography>
            </Box>
            <Box className="text-center">
              <div
                className="w-16 h-16 rounded-lg mb-2"
                style={{ backgroundColor: brandColors.secondary[500] }}
              />
              <Typography variant="caption">Secondary</Typography>
            </Box>
            <Box className="text-center">
              <div
                className="w-16 h-16 rounded-lg mb-2"
                style={{ backgroundColor: brandColors.accent[500] }}
              />
              <Typography variant="caption">Accent</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Status Colors */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Status Colors
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Box className="text-center">
              <div
                className="w-16 h-16 rounded-lg mb-2"
                style={{ backgroundColor: getStatusColor("success") }}
              />
              <Typography variant="caption">Success</Typography>
            </Box>
            <Box className="text-center">
              <div
                className="w-16 h-16 rounded-lg mb-2"
                style={{ backgroundColor: getStatusColor("warning") }}
              />
              <Typography variant="caption">Warning</Typography>
            </Box>
            <Box className="text-center">
              <div
                className="w-16 h-16 rounded-lg mb-2"
                style={{ backgroundColor: getStatusColor("error") }}
              />
              <Typography variant="caption">Error</Typography>
            </Box>
            <Box className="text-center">
              <div
                className="w-16 h-16 rounded-lg mb-2"
                style={{ backgroundColor: getStatusColor("info") }}
              />
              <Typography variant="caption">Info</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* SCSS Utility Examples */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            SCSS Utility Classes
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Custom Buttons
              </Typography>
              <Stack direction="row" spacing={2}>
                <button className="btn-brand">Brand Button</button>
                <button className="btn-outline">Outline Button</button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Status Badges
              </Typography>
              <Stack direction="row" spacing={1}>
                <span className="badge success">Success</span>
                <span className="badge warning">Warning</span>
                <span className="badge error">Error</span>
                <span className="badge info">Info</span>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Gradient Text
              </Typography>
              <h2 className="text-gradient">Beautiful Gradient Text</h2>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Cards with Elevation
              </Typography>
              <Stack direction="row" spacing={2}>
                <div className="card-elevated">
                  <h4>Elevated Card</h4>
                  <p>This card has custom shadow on hover</p>
                </div>
                <div className="card-glass">
                  <h4>Glass Card</h4>
                  <p>This card has glass morphism effect</p>
                </div>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Tailwind + Brand Colors */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tailwind with Brand Colors
          </Typography>
          <Stack spacing={2}>
            <Box className="bg-brand-primary-100 text-brand-primary-900 p-4 rounded-lg">
              <Typography>Using Tailwind classes with brand colors</Typography>
            </Box>
            <Box className="bg-status-success-100 text-status-success-900 p-4 rounded-lg">
              <Typography>Success background with success text</Typography>
            </Box>
            <Box className="bg-gradient-to-r from-brand-primary-500 to-brand-accent-500 text-white p-4 rounded-lg">
              <Typography>
                Gradient background from primary to accent
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ColorShowcase;
