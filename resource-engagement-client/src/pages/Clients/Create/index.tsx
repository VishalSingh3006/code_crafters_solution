import React from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ClientForm from "../../../components/forms/ClientForm";

const CreateClientPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">Create Portfolio Company</Typography>
          <Button variant="outlined" onClick={() => navigate("/clients")}>
            Back
          </Button>
        </Box>
        <ClientForm onSuccess={() => navigate("/clients", { replace: true })} />
      </Paper>
    </Container>
  );
};

export default CreateClientPage;
