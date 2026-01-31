import { Box } from "@mui/material";
import type { ReactNode } from "react";

type HomeLayoutProps = {
  children: ReactNode;
};

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={{ xs: 2, sm: 3, md: 4 }}
    >
      <Box
        maxWidth={600}
        width="100%"
        sx={{
          textAlign: { xs: "center", sm: "left" },
          px: { xs: 1, sm: 2 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
