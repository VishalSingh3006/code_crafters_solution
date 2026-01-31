import React from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DepartmentForm from "../../../components/DepartmentForm";

const CreateDepartmentPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">Create Department</Typography>
          <Button variant="outlined" onClick={() => navigate("/departments")}>
            Back to Departments
          </Button>
        </Box>
        <DepartmentForm
          mode="create"
          onSuccess={() => navigate("/departments", { replace: true })}
          onCancel={() => navigate("/departments")}
        />
      </Paper>
    </Container>
  );
};

export default CreateDepartmentPage;