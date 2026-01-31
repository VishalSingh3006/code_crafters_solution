import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import { useClient } from "../../../hooks/clientsHooks";

const ClientDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id ? Number(params.id) : null;
  const { item, loading, error } = useClient(id);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">Client Details</Typography>
          <Button variant="outlined" onClick={() => navigate("/clients")}>
            Back
          </Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : item ? (
          <Stack spacing={1}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography>Email: {item.email || "-"}</Typography>
            <Typography>Contact Name: {item.contactName || "-"}</Typography>
            <Typography>Contact Phone: {item.contactPhone || "-"}</Typography>
            <Typography>ID: {item.id}</Typography>
          </Stack>
        ) : (
          <Typography>No client found.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ClientDetailPage;
