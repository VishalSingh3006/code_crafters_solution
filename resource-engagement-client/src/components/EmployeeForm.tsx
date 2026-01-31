import React, { useEffect, useState } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useEmployeeActions } from "../hooks/employeesHooks";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { skillsService, type Skill } from "../services/skillsService";

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
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  const defaultValues: CreateEmployeeRequest = {
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departmentId: 1,
    designationId: 1,
    employmentType: "Full-Time",
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

  // Load available skills from API
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await skillsService.getAll();
        setSkills(response || []);
      } catch (error) {
        console.error("Failed to load skills:", error);
        setSkills([]);
      } finally {
        setSkillsLoading(false);
      }
    };
    loadSkills();
  }, []);

  useEffect(() => {
    if (mode === "edit" && employee) {
      reset({
        employeeCode: employee.employeeCode,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        departmentId: 1, // TODO: Map department string to ID
        designationId: 1, // TODO: Map designation string to ID  
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
          placeholder="e.g., EMP001"
        />
        <FormControl fullWidth error={!!errors.employmentType}>
          <InputLabel>Employment Type</InputLabel>
          <Select
            label="Employment Type"
            {...register("employmentType")}
            defaultValue="Full-Time"
          >
            <MenuItem value="Full-Time">Full-Time</MenuItem>
            <MenuItem value="Part-Time">Part-Time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
            <MenuItem value="Intern">Intern</MenuItem>
          </Select>
          {errors.employmentType && (
            <FormHelperText>{errors.employmentType?.message}</FormHelperText>
          )}
        </FormControl>
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
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          placeholder="john.doe@company.com"
        />
        <TextField
          label="Phone"
          {...register("phone")}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          fullWidth
          placeholder="+1-234-567-8900"
        />
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="Department ID"
          type="number"
          {...register("departmentId", { valueAsNumber: true })}
          error={!!errors.departmentId}
          helperText={errors.departmentId?.message || "Enter the department ID (e.g., 1 for IT, 2 for HR)"}
          fullWidth
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Designation ID"
          type="number"
          {...register("designationId", { valueAsNumber: true })}
          error={!!errors.designationId}
          helperText={errors.designationId?.message || "Enter the designation ID (e.g., 1 for Developer, 2 for Manager)"}
          fullWidth
          inputProps={{ min: 1 }}
        />
      </Stack>
      <TextField
        label="Manager ID (Optional)"
        type="number"
        {...register("managerId", {
          setValueAs: (v) => (v === "" || v === "0" ? null : Number(v)),
        })}
        error={!!errors.managerId}
        helperText={errors.managerId?.message as string | undefined || "Leave empty if no manager"}
        fullWidth
        placeholder="Enter manager's employee ID"
        inputProps={{ min: 0 }}
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
              key={s.id}
              alignItems="center"
            >
              <FormControl fullWidth error={!!errors.skills?.[idx]?.skillId}>
                <InputLabel>Skill</InputLabel>
                <Select
                  label="Skill"
                  {...register(`skills.${idx}.skillId` as const, {
                    valueAsNumber: true,
                  })}
                  defaultValue=""
                  disabled={skillsLoading}
                >
                  {skills.map((skill) => (
                    <MenuItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.skills?.[idx]?.skillId && (
                  <FormHelperText>
                    {errors.skills?.[idx]?.skillId?.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Proficiency Level</InputLabel>
                <Select
                  label="Proficiency Level"
                  {...register(`skills.${idx}.proficiencyLevel` as const)}
                  defaultValue=""
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                  <MenuItem value="Expert">Expert</MenuItem>
                </Select>
                {errors.skills?.[idx]?.proficiencyLevel && (
                  <FormHelperText error>
                    {errors.skills?.[idx]?.proficiencyLevel?.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Button 
                color="error" 
                onClick={() => remove(idx)}
                variant="outlined"
                size="small"
              >
                Remove
              </Button>
            </Stack>
          ))}
          <Button
            variant="outlined"
            onClick={() => append({ 
              skillId: skills.length > 0 ? skills[0].id : 1, 
              proficiencyLevel: "Beginner" 
            })}
            sx={{ alignSelf: "flex-start" }}
            disabled={skillsLoading || skills.length === 0}
          >
            {skillsLoading ? "Loading..." : skills.length === 0 ? "No Skills Available" : "+ Add Skill"}
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
