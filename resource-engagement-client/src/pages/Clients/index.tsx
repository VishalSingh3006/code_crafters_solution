import React, { useState } from "react";
import { useClients, useClientActions } from "../../hooks/clientsHooks";
import { useNavigate } from "react-router-dom";
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from "../../types";
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

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, error, reload } = useClients();
  const { update, remove, pending, error: actionError } = useClientActions();

  const [form, setForm] = useState<UpdateClientRequest>({
    name: "",
    email: "",
    contactName: "",
    contactPhone: "",
  });
  const [editing, setEditing] = useState<Client | null>(null);

  const handleUpdate = async () => {
    if (!editing) return;
    const payload: UpdateClientRequest = { ...form };
    await update(editing.id, payload);
    setEditing(null);
    setForm({ name: "", email: "", contactName: "", contactPhone: "" });
    await reload();
  };

  const startEdit = (client: Client) => {
    setEditing(client);
    setForm({
      name: client.name,
      email: client.email,
      contactName: client.contactName,
      contactPhone: client.contactPhone,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Clients
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {actionError && <Alert severity="error">{actionError}</Alert>}

        {!editing ? (
          <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/clients/create")}
            >
              Create Client
            </Button>
          </Box>
        ) : (
          <Stack spacing={2} sx={{ mb: 3 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              fullWidth
            />
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Contact Name"
                value={form.contactName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactName: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Contact Phone"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactPhone: e.target.value }))
                }
                fullWidth
              />
            </Stack>
            <Box>
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={pending}
              >
                Update
              </Button>
              <Button
                sx={{ ml: 2 }}
                variant="outlined"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        )}

        <Box>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Contact Name</TableCell>
                  <TableCell>Contact Phone</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    onClick={() => navigate(`/clients/${c.id}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.contactName}</TableCell>
                    <TableCell>{c.contactPhone}</TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(c);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(c.id);
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

export default ClientsPage;
