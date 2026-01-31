import React, { useState } from "react";
import { Stack, TextField, Box, Button, Alert } from "@mui/material";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  Project,
} from "../../types";
import { useProjectActions } from "../../hooks/projectsHooks";

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
  const [form, setForm] = useState<CreateProjectRequest | UpdateProjectRequest>(
    {
      name: project?.name ?? "",
      description: project?.description ?? "",
      clientId: project?.clientId ?? 0,
    },
  );

  const handleSubmit = async () => {
    if (mode === "edit" && project) {
      await update(project.id, form as UpdateProjectRequest);
    } else {
      await create(form as CreateProjectRequest);
    }
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
        label="Description"
        value={form.description}
        onChange={(e) =>
          setForm((f) => ({ ...f, description: e.target.value }))
        }
        fullWidth
        multiline
        minRows={2}
      />
      <TextField
        label="Client ID"
        type="number"
        value={form.clientId}
        onChange={(e) =>
          setForm((f) => ({ ...f, clientId: Number(e.target.value) }))
        }
        fullWidth
      />
      <Box>
        <Button variant="contained" onClick={handleSubmit} disabled={pending}>
          {mode === "edit" ? "Update" : "Create"}
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
