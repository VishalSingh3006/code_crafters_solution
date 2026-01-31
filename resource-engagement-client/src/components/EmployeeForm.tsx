import React, { useEffect } from "react";
import type {
  CreateEmployeeRequest,
  Employee,
  EmployeeSkillInput,
  UpdateEmployeeRequest,
} from "../types";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEmployeeActions } from "../hooks/employeesHooks";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type Mode = "create" | "edit";

interface EmployeeFormProps {
  mode: Mode;
  employee?: Employee | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const schema: yup.ObjectSchema<CreateEmployeeRequest> = yup
  .object({
    employeeCode: yup.string().trim().required("Employee code is required"),
    firstName: yup.string().trim().required("First name is required"),
    lastName: yup.string().trim().required("Last name is required"),
    email: yup
      .string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required"),
    phone: yup.string().trim().required("Phone is required"),
    departmentId: yup
      .number()
      .typeError("Department is required")
      .min(1, "Department is required")
      .required("Department is required"),
    designationId: yup
      .number()
      .typeError("Designation is required")
      .min(1, "Designation is required")
      .required("Designation is required"),
    employmentType: yup.string().trim().required("Employment type is required"),
    managerId: yup
      .number()
      .transform((v, orig) => (orig === "" || orig === null ? null : v))
      .nullable()
      .optional(),
    skills: yup
      .array()
      .of(
        yup.object({
          skillId: yup
            .number()
            .typeError("Skill Id is required")
            .min(1, "Skill Id is required")
            .required("Skill Id is required"),
          proficiencyLevel: yup
            .string()
            .trim()
            .required("Proficiency is required"),
        }),
      )
      .default([]),
  })
  .required();

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  mode,
  employee,
  onSuccess,
  onCancel,
}) => {
  const { create, update, pending, error } = useEmployeeActions(onSuccess);

  const defaultValues: CreateEmployeeRequest = {
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departmentId: 0,
    designationId: 0,
    employmentType: "",
    managerId: null,
    skills: [],
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeeRequest>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "skills" });

  useEffect(() => {
    if (mode === "edit" && employee) {
      reset({
        employeeCode: employee.employeeCode,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        departmentId: 0,
        designationId: 0,
        employmentType: employee.employmentType,
        managerId: employee.managerId ?? null,
        skills: employee.skills.map((s) => ({
          skillId: s.skillId,
          proficiencyLevel: s.proficiencyLevel,
        })),
      });
    } else if (mode === "create") {
      reset(defaultValues);
    }
  }, [mode, employee, reset]);

  const onSubmit = async (data: CreateEmployeeRequest) => {
    if (mode === "edit" && employee) {
      const payload: UpdateEmployeeRequest = { ...data };
      await update(employee.id, payload);
    } else {
      await create(data);
      reset(defaultValues);
    }
  };

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="Employee Code"
          {...register("employeeCode")}
          error={!!errors.employeeCode}
          helperText={errors.employeeCode?.message}
          fullWidth
        />
        <TextField
          label="Employment Type"
          {...register("employmentType")}
          error={!!errors.employmentType}
          helperText={errors.employmentType?.message}
          fullWidth
        />
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="First Name"
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          fullWidth
        />
        <TextField
          label="Last Name"
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          fullWidth
        />
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />
        <TextField
          label="Phone"
          {...register("phone")}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          fullWidth
        />
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="Department Id"
          type="number"
          {...register("departmentId", { valueAsNumber: true })}
          error={!!errors.departmentId}
          helperText={errors.departmentId?.message}
          fullWidth
        />
        <TextField
          label="Designation Id"
          type="number"
          {...register("designationId", { valueAsNumber: true })}
          error={!!errors.designationId}
          helperText={errors.designationId?.message}
          fullWidth
        />
      </Stack>
      <TextField
        label="Manager Id"
        type="number"
        {...register("managerId", {
          setValueAs: (v) => (v === "" ? null : Number(v)),
        })}
        error={!!errors.managerId}
        helperText={errors.managerId?.message as string | undefined}
        fullWidth
      />

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Skills
        </Typography>
        <Stack spacing={1}>
          {fields.map((s, idx) => (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              key={idx}
            >
              <TextField
                label="Skill Id"
                type="number"
                {...register(`skills.${idx}.skillId` as const, {
                  valueAsNumber: true,
                })}
                error={!!errors.skills?.[idx]?.skillId}
                helperText={errors.skills?.[idx]?.skillId?.message}
              />
              <TextField
                label="Proficiency"
                {...register(`skills.${idx}.proficiencyLevel` as const)}
                error={!!errors.skills?.[idx]?.proficiencyLevel}
                helperText={errors.skills?.[idx]?.proficiencyLevel?.message}
              />
              <Button color="error" onClick={() => remove(idx)}>
                Remove
              </Button>
            </Stack>
          ))}
          <Button
            variant="outlined"
            onClick={() => append({ skillId: 0, proficiencyLevel: "" })}
          >
            Add Skill
          </Button>
        </Stack>
      </Box>

      <Box>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={pending}
        >
          {mode === "edit" ? "Update" : "Create"}
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

export default EmployeeForm;
