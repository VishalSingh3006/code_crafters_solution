import React from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../../../components/forms/ProjectForm";

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">Create Project</Typography>
          <Button variant="outlined" onClick={() => navigate("/projects")}>
            Back
          </Button>
        </Box>
        <ProjectForm
          onSuccess={() => navigate("/projects", { replace: true })}
        />
      </Paper>
    </Container>
  );
};

export default CreateProjectPage;
