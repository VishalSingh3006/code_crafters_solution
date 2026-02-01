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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
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
  allocationStart: yup.date().nullable().required("Start date is required"),
  allocationEnd: yup.date().nullable(),
});

type AllocationFormData = {
  employeeId: number;
  allocationPercentage: number;
  allocationStart: Date | null;
  allocationEnd: Date | null;
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
  } = useForm<AllocationFormData>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
    defaultValues: {
      employeeId: allocation?.employeeId || 0,
      allocationPercentage: allocation?.allocationPercentage || 50,
      allocationStart: allocation?.allocationStart ? new Date(allocation.allocationStart) : null,
      allocationEnd: allocation?.allocationEnd ? new Date(allocation.allocationEnd) : null,
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
        allocationStart: allocation?.allocationStart ? new Date(allocation.allocationStart) : null,
        allocationEnd: allocation?.allocationEnd ? new Date(allocation.allocationEnd) : null,
      });
    }
  }, [open, allocation, reset]);

  const onSubmit: SubmitHandler<AllocationFormData> = async (data) => {
    try {
      if (!data.allocationStart) {
        console.error("Start date is required");
        return;
      }

      const formattedData = {
        ...data,
        allocationStart: data.allocationStart.toISOString(),
        allocationEnd: data.allocationEnd?.toISOString() || undefined,
      };

      if (isEditMode && allocation) {
        await update(allocation.id, {
          engagementId,
          ...formattedData,
        });
      } else {
        await create({
          engagementId,
          ...formattedData,
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

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="allocationStart"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Start Date"
                    disabled={pending}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.allocationStart,
                        helperText: errors.allocationStart?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="allocationEnd"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="End Date (Optional)"
                    disabled={pending}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.allocationEnd,
                        helperText: errors.allocationEnd?.message || "Leave empty for ongoing allocation",
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
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