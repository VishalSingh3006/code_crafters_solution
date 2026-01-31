import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { baseServices } from "../../services/baseService";

interface DesignationFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editing: { id: number; name: string; description?: string } | null;
}

type FormValues = {
  name: string;
  description?: string;
};

const DesignationForm: React.FC<DesignationFormProps> = ({
  open,
  onClose,
  onSuccess,
  editing,
}) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: editing || { name: "", description: "" },
  });

  React.useEffect(() => {
    reset(editing || { name: "", description: "" });
  }, [editing, reset]);

  const onSubmit = async (data: FormValues) => {
    if (editing) {
      await baseServices.put<void>(`designations/${editing.id}`, data);
    } else {
      await baseServices.post<void>("designations", data);
    }
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {editing ? "Edit Designation" : "Add Designation"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Name"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  minRows={2}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DesignationForm;
