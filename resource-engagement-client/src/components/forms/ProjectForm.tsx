import React, { useState } from "react";
import { Stack, TextField, Box, Button, Alert, MenuItem } from "@mui/material";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  Project,
} from "../../types";
import { useProjectActions } from "../../hooks/projectsHooks";
import { useClients } from "../../hooks/clientsHooks";

interface ProjectFormProps {
  mode?: "create" | "edit";
  project?: Project | null;
  onSuccess?: () => Promise<void> | void;
  onCancel?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  mode = "create",
  project,
  onSuccess,
  onCancel,
}) => {
  const { create, update, pending, error } = useProjectActions();
  const { items: clients, loading: clientsLoading, error: clientsError } = useClients();
  const [form, setForm] = useState<CreateProjectRequest | UpdateProjectRequest>(
    {
      name: project?.name ?? "",
      description: project?.description ?? "",
      clientId: project?.clientId ?? 0,
    },
  );

  const handleSubmit = async () => {
    // Basic validation
    if (!form.name.trim()) {
      setError("Project name is required");
      return;
    }
    if (!form.clientId || form.clientId === 0) {
      setError("Please select a valid client");
      return;
    }
    
    try {
      setError(null);
      if (mode === "edit" && project) {
        await update(project.id, form as UpdateProjectRequest);
      } else {
        await create(form as CreateProjectRequest);
      }
      if (onSuccess) await onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to save project");
    }
  };

  const setError = (message: string | null) => {
    // Since the hook doesn't expose setError, we'll handle errors through the hook's error state
    // The error will be displayed through the hook's error state
  };

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        fullWidth
        required
        error={!form.name.trim()}
        helperText={!form.name.trim() ? "Project name is required" : ""}
      />
      <TextField
        label="Description"
        value={form.description}
        onChange={(e) =>
          setForm((f) => ({ ...f, description: e.target.value }))
        }
        fullWidth
        multiline
        minRows={2}
      />
      {clientsError && <Alert severity="error">{clientsError}</Alert>}
      <TextField
        select
        label="Client Name"
        value={form.clientId}
        onChange={(e) =>
          setForm((f) => ({ ...f, clientId: Number(e.target.value) }))
        }
        fullWidth
        required
        error={!form.clientId || form.clientId === 0}
        helperText={!form.clientId || form.clientId === 0 ? "Please select a client" : ""}
        disabled={clientsLoading}
      >
        <MenuItem value={0} disabled>
          {clientsLoading ? "Loading clients..." : "Select a client"}
        </MenuItem>
        {clients.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>
      <Box>
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={pending || !form.name.trim() || !form.clientId || form.clientId === 0}
        >
          {pending ? "Saving..." : (mode === "edit" ? "Update" : "Create")}
        </Button>
        {mode === "edit" && onCancel && (
          <Button sx={{ ml: 2 }} variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Box>
    </Stack>
  );
};

export default ProjectForm;
