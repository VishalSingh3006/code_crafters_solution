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
import { Delete, Add as AddIcon } from "@mui/icons-material";
import { useEmployeeActions } from "../hooks/employeesHooks";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { skillsService, type Skill } from "../services/skillsService";
import { departmentsService } from "../services/departmentsService";
import { designationsService } from "../services/designationsService";
import type { Department } from "../types/departments";
import type { Designation } from "../types/designations";

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
          yearsOfExperience: yup
            .number()
            .transform((v, orig) =>
              orig === "" || orig === null || orig === undefined
                ? undefined
                : v,
            )
            .min(0, "Years of experience must be positive")
            .max(50, "Years of experience must be less than 50")
            .optional(),
          lastUsedDate: yup.string().optional(),
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [designationsLoading, setDesignationsLoading] = useState(true);

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

  // Load departments from API
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await departmentsService.getAll();
        setDepartments(response || []);
      } catch (error) {
        console.error("Failed to load departments:", error);
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };
    loadDepartments();
  }, []);

  // Load designations from API
  useEffect(() => {
    const loadDesignations = async () => {
      try {
        const response = await designationsService.getAll();
        setDesignations(response || []);
      } catch (error) {
        console.error("Failed to load designations:", error);
        setDesignations([]);
      } finally {
        setDesignationsLoading(false);
      }
    };
    loadDesignations();
  }, []);

  useEffect(() => {
    if (
      mode === "edit" &&
      employee &&
      departments.length > 0 &&
      designations.length > 0
    ) {
      // Find the department ID by matching the department name
      const departmentId =
        departments.find((dept) => dept.name === employee.department)?.id || 1;
      // Find the designation ID by matching the designation name
      const designationId =
        designations.find(
          (designation) => designation.name === employee.designation,
        )?.id || 1;

      reset({
        employeeCode: employee.employeeCode,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        departmentId: departmentId,
        designationId: designationId,
        employmentType: employee.employmentType,
        managerId: employee.managerId ?? null,
        skills: employee.skills.map((s) => ({
          skillId: s.skillId,
          proficiencyLevel: s.proficiencyLevel,
          yearsOfExperience: s.yearsOfExperience || undefined,
          lastUsedDate: s.lastUsedDate || undefined,
        })),
      });
    } else if (mode === "create") {
      reset(defaultValues);
    }
  }, [mode, employee, reset, departments, designations]);

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
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth error={!!errors.employmentType}>
          <InputLabel>Employment Type</InputLabel>
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Employment Type"
                value={field.value || "Full-Time"}
              >
                <MenuItem value="Full-Time">Full-Time</MenuItem>
                <MenuItem value="Part-Time">Part-Time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Intern">Intern</MenuItem>
              </Select>
            )}
          />
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
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Last Name"
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          fullWidth
          InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Phone"
          {...register("phone")}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          fullWidth
          placeholder="+1-234-567-8900"
          InputLabelProps={{ shrink: true }}
        />
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <FormControl fullWidth error={!!errors.departmentId}>
          <InputLabel>Department</InputLabel>
          <Controller
            name="departmentId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Department"
                displayEmpty
                disabled={departmentsLoading}
                value={field.value || ""}
              >
                {departmentsLoading ? (
                  <MenuItem value="">Loading departments...</MenuItem>
                ) : (
                  departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            )}
          />
          <FormHelperText>
            {errors.departmentId?.message ||
              (departmentsLoading
                ? "Loading departments..."
                : "Select a department")}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth error={!!errors.designationId}>
          <InputLabel>Designation</InputLabel>
          <Controller
            name="designationId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Designation"
                displayEmpty
                disabled={designationsLoading}
                value={field.value || ""}
              >
                {designationsLoading ? (
                  <MenuItem value="">Loading designations...</MenuItem>
                ) : (
                  designations.map((designation) => (
                    <MenuItem key={designation.id} value={designation.id}>
                      {designation.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            )}
          />
          <FormHelperText>
            {errors.designationId?.message ||
              (designationsLoading
                ? "Loading designations..."
                : "Select a designation")}
          </FormHelperText>
        </FormControl>
      </Stack>
      <TextField
        label="Manager ID (Optional)"
        type="number"
        {...register("managerId", {
          setValueAs: (v) => (v === "" || v === "0" ? null : Number(v)),
        })}
        error={!!errors.managerId}
        helperText={
          (errors.managerId?.message as string | undefined) ||
          "Leave empty if no manager"
        }
        fullWidth
        placeholder="Enter manager's employee ID"
        inputProps={{ min: 0 }}
        InputLabelProps={{ shrink: true }}
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
              alignItems="flex-start"
            >
              <FormControl fullWidth error={!!errors.skills?.[idx]?.skillId}>
                <InputLabel>Skill</InputLabel>
                <Controller
                  name={`skills.${idx}.skillId` as const}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Skill"
                      disabled={skillsLoading}
                      value={field.value || ""}
                    >
                      {skills.map((skill) => (
                        <MenuItem key={skill.id} value={skill.id}>
                          {skill.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.skills?.[idx]?.skillId && (
                  <FormHelperText>
                    {errors.skills?.[idx]?.skillId?.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Proficiency Level</InputLabel>
                <Controller
                  name={`skills.${idx}.proficiencyLevel` as const}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Proficiency Level"
                      value={field.value || ""}
                    >
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                      <MenuItem value="Expert">Expert</MenuItem>
                    </Select>
                  )}
                />
                {errors.skills?.[idx]?.proficiencyLevel && (
                  <FormHelperText error>
                    {errors.skills?.[idx]?.proficiencyLevel?.message}
                  </FormHelperText>
                )}
              </FormControl>
              <TextField
                label="Years of Experience"
                type="number"
                {...register(`skills.${idx}.yearsOfExperience` as const, {
                  setValueAs: (v) =>
                    v === "" || v === null ? undefined : Number(v),
                })}
                error={!!errors.skills?.[idx]?.yearsOfExperience}
                helperText={
                  (errors.skills?.[idx]?.yearsOfExperience?.message as
                    | string
                    | undefined) || "Optional"
                }
                fullWidth
                placeholder="e.g., 2.5"
                inputProps={{ min: 0, max: 50, step: 0.5 }}
                InputLabelProps={{ shrink: true }}
              />
              <Controller
                name={`skills.${idx}.lastUsedDate` as const}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Used Date"
                    type="date"
                    error={!!errors.skills?.[idx]?.lastUsedDate}
                    helperText={
                      (errors.skills?.[idx]?.lastUsedDate?.message as
                        | string
                        | undefined) || "Optional"
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={
                      field.value
                        ? field.value.includes("T")
                          ? field.value.split("T")[0]
                          : field.value
                        : ""
                    }
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Button
                color="error"
                onClick={() => remove(idx)}
                variant="outlined"
                size="small"
                sx={{ mt: 1, height: "56px" }}
              >
                <Delete />
              </Button>
            </Stack>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() =>
              append({
                skillId: skills.length > 0 ? skills[0].id : 1,
                proficiencyLevel: "Beginner",
                yearsOfExperience: undefined,
                lastUsedDate: undefined,
              })
            }
            sx={{ alignSelf: "flex-start" }}
            disabled={skillsLoading || skills.length === 0}
          >
            {skillsLoading
              ? "Loading..."
              : skills.length === 0
                ? "No Skills Available"
                : "+ Add Skill"}
          </Button>
        </Stack>
      </Box>

      <Box>
        <Button
          id="submit-employee-form-btn"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={pending}
        >
          {mode === "edit" ? "Update" : "Create"}
        </Button>
        {onCancel && (
          <Button
            id="cancel-employee-form-btn"
            sx={{ ml: 2 }}
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Stack>
  );
};

export default EmployeeForm;
