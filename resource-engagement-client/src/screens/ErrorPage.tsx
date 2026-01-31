import { Alert, Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PageHead } from "../components/ui/PageHead";

export default function ErrorPage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={3}
    >
      <PageHead
        title="Error"
        description="Something went wrong. Please try refreshing the page or return to the home page"
        keywords="error, page not found, technical error"
      />
      <Box maxWidth={500} width="100%">
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2">
            We encountered an unexpected error. Please try refreshing the page
            or go back to the home page.
          </Typography>
        </Alert>
        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={handleReload}>
            Reload Page
          </Button>
          <Button variant="outlined" component={RouterLink} to="/">
            Go Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
