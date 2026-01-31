import React from "react";
import { Container, Paper, Typography } from "@mui/material";
import EmployeeForm from "../../../components/EmployeeForm";
import { useNavigate } from "react-router-dom";

const CreateEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create Employee
        </Typography>
        <EmployeeForm
          mode="create"
          onSuccess={() => navigate("/employees")}
          onCancel={() => navigate("/employees")}
        />
      </Paper>
    </Container>
  );
};

export default CreateEmployeePage;
