import React, { useEffect, useState } from "react";
import { useRolesData, useRolesAdmin } from "../../hooks/rolesHooks";
import type { Role } from "../../types";
import { DEFAULT_ROLES } from "../../types/roles";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Alert,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const RolesPage: React.FC = () => {
  const { availableRoles, usersWithRoles, loading, error, refreshUsers } =
    useRolesData();
  const {
    assign,
    remove,
    loading: adminLoading,
    error: adminError,
    success,
  } = useRolesAdmin();

  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<Role | "">("");
  const [showError, setShowError] = useState(false);
  const [showAdminError, setShowAdminError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const t = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(t);
    } else {
      setShowError(false);
    }
  }, [error]);
  useEffect(() => {
    if (adminError) {
      setShowAdminError(true);
      const t = setTimeout(() => setShowAdminError(false), 3000);
      return () => clearTimeout(t);
    } else {
      setShowAdminError(false);
    }
  }, [adminError]);
  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const t = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(t);
    } else {
      setShowSuccess(false);
    }
  }, [success]);

  const handleAssign = async () => {
    if (!email || !role) return;
    await assign({ email, role: role as Role });
    await refreshUsers();
  };

  const handleRemove = async () => {
    if (!email || !role) return;
    await remove({ email, role: role as Role });
    await refreshUsers();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Role Management
        </Typography>
        {error && showError && (
          <Alert severity="error" onClose={() => setShowError(false)}>
            {error}
          </Alert>
        )}
        {adminError && showAdminError && (
          <Alert severity="error" onClose={() => setShowAdminError(false)}>
            {adminError}
          </Alert>
        )}
        {success && showSuccess && (
          <Alert severity="success" onClose={() => setShowSuccess(false)}>
            {success}
          </Alert>
        )}

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <TextField
            label="User Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              {(availableRoles?.length ? availableRoles : DEFAULT_ROLES).map(
                (r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Button
              variant="contained"
              onClick={handleAssign}
              disabled={adminLoading}
            >
              Assign Role
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleRemove}
              disabled={adminLoading}
            >
              Remove Role
            </Button>
          </Stack>
        </Stack>

        <Box>
          <Typography variant="h6" gutterBottom>
            Users and Roles
          </Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Roles</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersWithRoles.map((u) => (
                  <TableRow key={u.userId}>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.firstName}</TableCell>
                    <TableCell>{u.lastName}</TableCell>
                    <TableCell>{u.roles.join(", ")}</TableCell>
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

export default RolesPage;
