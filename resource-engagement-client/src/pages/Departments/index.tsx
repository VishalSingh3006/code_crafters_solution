import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDepartments,
  useDepartmentActions,
} from "../../hooks/departmentsHooks";
import type { Department } from "../../types/departments";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Alert,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import DepartmentForm from "../../components/DepartmentForm";
import { Add } from "@mui/icons-material";

const DepartmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, error, reload } = useDepartments();
  const { remove, error: actionError } = useDepartmentActions(() => reload());
  const [editing, setEditing] = useState<Department | null>(null);

  const startEdit = (dept: Department) => {
    setEditing(dept);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      await remove(id);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Departments
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {actionError && <Alert severity="error">{actionError}</Alert>}

        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
          <Box />
          <Button
            id="create-department-btn"
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/departments/create")}
          >
            Create Department
          </Button>
        </Box>

        {editing && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Edit Department
            </Typography>
            <DepartmentForm
              mode="edit"
              department={editing}
              onSuccess={() => {
                setEditing(null);
                reload();
              }}
              onCancel={() => setEditing(null)}
            />
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          {loading ? (
            <Typography>Loading departments...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Manager ID</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>{dept.id}</TableCell>
                    <TableCell>{dept.name}</TableCell>
                    <TableCell>{dept.description || "-"}</TableCell>
                    <TableCell>{dept.managerId || "-"}</TableCell>
                    <TableCell>
                      {new Date(dept.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          id={`edit-department-${dept.id}-btn`}
                          size="small"
                          variant="contained"
                          onClick={() => startEdit(dept)}
                        >
                          Edit
                        </Button>
                        <Button
                          id={`delete-department-${dept.id}-btn`}
                          size="small"
                          variant="contained"
                          onClick={() => handleDelete(dept.id)}
                          color="error"
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No departments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default DepartmentsPage;
