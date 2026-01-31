import React, { useState } from "react";
import { Stack, TextField, Box, Button, Alert } from "@mui/material";
import { useClientActions } from "../../hooks/clientsHooks";
import type { CreateClientRequest } from "../../types";

interface ClientFormProps {
  onSuccess?: () => Promise<void> | void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSuccess }) => {
  const { create, pending, error } = useClientActions();
  const [form, setForm] = useState<CreateClientRequest>({
    name: "",
    email: "",
    contactName: "",
    contactPhone: "",
  });

  const handleSubmit = async () => {
    await create(form);
    setForm({ name: "", email: "", contactName: "", contactPhone: "" });
    if (onSuccess) await onSuccess();
  };

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        fullWidth
      />
      <TextField
        label="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
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
        <Button variant="contained" onClick={handleSubmit} disabled={pending}>
          Create
        </Button>
      </Box>
    </Stack>
  );
};

export default ClientForm;
