import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees, useEmployeeActions } from "../../hooks/employeesHooks";
import type { Employee } from "../../types";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Alert,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import EmployeeForm from "../../components/EmployeeForm";

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, error, reload } = useEmployees();
  const { remove, error: actionError } = useEmployeeActions(() => reload());
  const [editing, setEditing] = useState<Employee | null>(null);

  const startEdit = (emp: Employee) => {
    setEditing(emp);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Employees
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {actionError && <Alert severity="error">{actionError}</Alert>}

        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
          <Box />
          <Button
            variant="contained"
            onClick={() => navigate("/employees/create")}
          >
            Create Employee
          </Button>
        </Box>

        {editing && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Edit Employee
            </Typography>
            <EmployeeForm
              mode="edit"
              employee={editing}
              onCancel={() => setEditing(null)}
              onSuccess={async () => {
                setEditing(null);
                await reload();
              }}
            />
          </Box>
        )}

        <Box>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Employment</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((e) => (
                  <TableRow
                    key={e.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/employees/${e.id}`)}
                  >
                    <TableCell>{e.employeeCode}</TableCell>
                    <TableCell>
                      {e.firstName} {e.lastName}
                    </TableCell>
                    <TableCell>{e.email}</TableCell>
                    <TableCell>{e.phone}</TableCell>
                    <TableCell>{e.employmentType}</TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          size="small"
                          variant="contained"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            startEdit(e);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            remove(e.id);
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeesPage;
