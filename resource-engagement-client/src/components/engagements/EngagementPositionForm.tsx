import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { EngagementPosition } from "../../types";
import { useEngagementPositionActions } from "../../hooks/useEngagementPositions";

type FormData = {
  title: string;
  requiredSkill?: string;
  requiredProficiency?: string;
};

interface EngagementPositionFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  engagementId: number;
  position?: EngagementPosition | null;
}

export const EngagementPositionForm: React.FC<EngagementPositionFormProps> = ({
  open,
  onClose,
  onSuccess,
  engagementId,
  position,
}) => {
  const isEditMode = !!position;
  const { create, update, pending, error } = useEngagementPositionActions();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      title: position?.title || "",
      requiredSkill: position?.requiredSkill || "",
      requiredProficiency: position?.requiredProficiency || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        title: position?.title || "",
        requiredSkill: position?.requiredSkill || "",
        requiredProficiency: position?.requiredProficiency || "",
      });
    }
  }, [open, position, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditMode && position) {
        await update(position.id, {
          engagementId,
          ...data,
        });
      } else {
        await create({
          engagementId,
          ...data,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save position:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditMode ? "Edit Position" : "Add New Position"}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <Controller
              name="title"
              control={control}
              rules={{
                required: "Title is required",
                maxLength: { value: 200, message: "Title too long" }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Position Title"
                  placeholder="e.g., Senior Developer, Project Manager"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  disabled={pending}
                  fullWidth
                />
              )}
            />

            <Controller
              name="requiredSkill"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Required Skill (Optional)"
                  placeholder="e.g., React, Python, Project Management"
                  error={!!errors.requiredSkill}
                  helperText={errors.requiredSkill?.message}
                  disabled={pending}
                  fullWidth
                />
              )}
            />

            <Controller
              name="requiredProficiency"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Required Proficiency Level (Optional)"
                  placeholder="e.g., Expert, Advanced, Intermediate"
                  error={!!errors.requiredProficiency}
                  helperText={errors.requiredProficiency?.message}
                  disabled={pending}
                  fullWidth
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={pending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || pending}
          >
            {isEditMode ? "Update" : "Add"} Position
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};