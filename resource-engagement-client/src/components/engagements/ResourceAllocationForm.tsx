import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ResourceAllocation, Employee } from "../../types";
import { useResourceAllocationActions } from "../../hooks/useResourceAllocations";
import { employeesService } from "../../services/employeesService";

const schema = yup.object().shape({
  employeeId: yup.number().required("Employee is required"),
  allocationPercentage: yup
    .number()
    .required("Allocation percentage is required")
    .min(0, "Allocation cannot be negative")
    .max(100, "Allocation cannot exceed 100%"),
});

type FormData = {
  employeeId: number;
  allocationPercentage: number;
};

interface ResourceAllocationFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  engagementId: number;
  allocation?: ResourceAllocation | null;
}

export const ResourceAllocationForm: React.FC<ResourceAllocationFormProps> = ({
  open,
  onClose,
  onSuccess,
  engagementId,
  allocation,
}) => {
  const isEditMode = !!allocation;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  
  const { create, update, pending, error } = useResourceAllocationActions();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      employeeId: allocation?.employeeId || 0,
      allocationPercentage: allocation?.allocationPercentage || 50,
    },
  });

  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      setEmployeesLoading(true);
      try {
        const response = await employeesService.getAll();
        setEmployees(response || []);
      } catch (error) {
        console.error("Failed to load employees:", error);
        setEmployees([]);
      } finally {
        setEmployeesLoading(false);
      }
    };

    if (open) {
      loadEmployees();
    }
  }, [open]);

  React.useEffect(() => {
    if (open) {
      reset({
        employeeId: allocation?.employeeId || 0,
        allocationPercentage: allocation?.allocationPercentage || 50,
      });
    }
  }, [open, allocation, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditMode && allocation) {
        await update(allocation.id, {
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
      console.error("Failed to save resource allocation:", error);
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
          {isEditMode ? "Edit Resource Allocation" : "Add New Resource Allocation"}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <Controller
              name="employeeId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Employee"
                  error={!!errors.employeeId}
                  helperText={errors.employeeId?.message}
                  disabled={pending || employeesLoading}
                  fullWidth
                >
                  {employeesLoading ? (
                    <MenuItem disabled>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        Loading employees...
                      </Box>
                    </MenuItem>
                  ) : employees.length === 0 ? (
                    <MenuItem disabled>No employees available</MenuItem>
                  ) : (
                    employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName} ({employee.employeeCode})
                      </MenuItem>
                    ))
                  )}
                </TextField>
              )}
            />

            <Controller
              name="allocationPercentage"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Allocation Percentage"
                  placeholder="e.g., 75"
                  error={!!errors.allocationPercentage}
                  helperText={errors.allocationPercentage?.message || "Percentage of time allocated to this engagement"}
                  disabled={pending}
                  fullWidth
                  inputProps={{
                    min: 0,
                    max: 100,
                    step: 0.1,
                  }}
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
            disabled={!isValid || pending || employeesLoading}
          >
            {isEditMode ? "Update" : "Add"} Allocation
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};