import React, { useState, useEffect } from "react";
import type {
  CreateDepartmentRequest,
  Department,
  UpdateDepartmentRequest,
} from "../types/departments";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDepartmentActions } from "../hooks/departmentsHooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type Mode = "create" | "edit";

interface DepartmentFormProps {
  mode: Mode;
  department?: Department | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const schema: yup.ObjectSchema<CreateDepartmentRequest> = yup
  .object({
    name: yup.string().trim().required("Department name is required"),
    description: yup.string().trim().optional(),
    managerId: yup
      .number()
      .transform((v, orig) => (orig === "" || orig === null ? undefined : v))
      .optional(),
  })
  .required();

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  mode,
  department,
  onSuccess,
  onCancel,
}) => {
  const { create, update, pending, error } = useDepartmentActions(onSuccess);

  const defaultValues: CreateDepartmentRequest = {
    name: "",
    description: "",
    managerId: undefined,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDepartmentRequest>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (mode === "edit" && department) {
      reset({
        name: department.name,
        description: department.description || "",
        managerId: department.managerId || undefined,
      });
    } else if (mode === "create") {
      reset(defaultValues);
    }
  }, [mode, department, reset]);

  const onSubmit = async (data: CreateDepartmentRequest) => {
    if (mode === "edit" && department) {
      const payload: UpdateDepartmentRequest = { ...data };
      await update(department.id, payload);
    } else {
      await create(data);
      reset(defaultValues);
    }
  };

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      
      <TextField
        label="Department Name"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        placeholder="e.g., Information Technology"
      />
      
      <TextField
        label="Description"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        multiline
        rows={3}
        placeholder="Brief description of the department"
      />
      
      <TextField
        label="Manager ID (Optional)"
        type="number"
        {...register("managerId", {
          setValueAs: (v) => (v === "" || v === "0" ? undefined : Number(v)),
        })}
        error={!!errors.managerId}
        helperText={errors.managerId?.message || "Leave empty if no manager assigned"}
        fullWidth
        placeholder="Enter manager's employee ID"
        inputProps={{ min: 1 }}
      />

      <Box>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={pending}
        >
          {pending ? "Saving..." : (mode === "edit" ? "Update" : "Create")}
        </Button>
        {onCancel && (
          <Button sx={{ ml: 2 }} variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Box>
    </Stack>
  );
};

export default DepartmentForm;