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
import { useEmployee } from "../../../hooks/employeesHooks";

const EmployeeDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id ? Number(params.id) : null;
  const { item, loading, error } = useEmployee(id);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">Employee Details</Typography>
          <Button variant="outlined" onClick={() => navigate("/employees")}>
            Back
          </Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : item ? (
          <Stack spacing={1}>
            <Typography variant="h6">
              {item.firstName} {item.lastName}
            </Typography>
            <Typography>Employee Code: {item.employeeCode || "-"}</Typography>
            <Typography>Email: {item.email || "-"}</Typography>
            <Typography>Phone: {item.phone || "-"}</Typography>
            <Typography>
              Employment Type: {item.employmentType || "-"}
            </Typography>
            <Typography>ID: {item.id}</Typography>
          </Stack>
        ) : (
          <Typography>No employee found.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default EmployeeDetailPage;
