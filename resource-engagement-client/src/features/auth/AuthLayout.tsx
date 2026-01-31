import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
  maxWidth?: number;
};

export function AuthLayout({
  title,
  children,
  maxWidth = 480,
}: AuthLayoutProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={3}
    >
      <Box maxWidth={maxWidth} width="100%">
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {children}
      </Box>
    </Box>
  );
}
