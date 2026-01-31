import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Stack,
  Button,
} from "@mui/material";
import {
  StaffingRecord,
  CreateStaffingRecordDto,
  UpdateStaffingRecordDto,
  StaffingStatus,
} from "../../types/resourceTracking";
import resourceTrackingService from "../../services/resourceTrackingService";

interface StaffingFormProps {
  staffingRecord?: StaffingRecord;
  onSubmit: () => void;
  onCancel: () => void;
}

type FormValues = {
  employeeId: number;
  projectId: number;
  startDate: string;
  endDate: string;
  allocationPercentage: number;
  role: string;
  hourlyRate: number;
  totalHours: number;
  status: StaffingStatus;
  notes: string;
};

const StaffingForm: React.FC<StaffingFormProps> = ({
  staffingRecord,
  onSubmit,
  onCancel,
}) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      employeeId: 0,
      projectId: 0,
      startDate: "",
      endDate: "",
      allocationPercentage: 1,
      role: "",
      hourlyRate: 0,
      totalHours: 0,
      status: StaffingStatus.Planned,
      notes: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (staffingRecord) {
      reset({
        employeeId: staffingRecord.employeeId,
        projectId: staffingRecord.projectId,
        startDate: new Date(staffingRecord.startDate)
          .toISOString()
          .split("T")[0],
        endDate: staffingRecord.endDate
          ? new Date(staffingRecord.endDate).toISOString().split("T")[0]
          : "",
        allocationPercentage: staffingRecord.allocationPercentage,
        role: staffingRecord.role,
        hourlyRate: staffingRecord.hourlyRate,
        totalHours: staffingRecord.totalHours || 0,
        status: staffingRecord.status,
        notes: staffingRecord.notes || "",
      });
    }
  }, [staffingRecord, reset]);

  const onSubmitForm = async (values: FormValues) => {
    setLoading(true);
    setError("");
    try {
      if (staffingRecord) {
        const updateDto: UpdateStaffingRecordDto = {
          projectId: values.projectId,
          employeeId: values.employeeId,
          role: values.role,
          allocationPercentage: values.allocationPercentage,
          hourlyRate: values.hourlyRate,
          totalHours: values.totalHours,
          startDate: values.startDate
            ? `${values.startDate}T00:00:00`
            : undefined,
          endDate: values.endDate ? `${values.endDate}T23:59:59` : undefined,
          status: values.status,
          notes: values.notes,
        };
        await resourceTrackingService.updateStaffingRecord(
          staffingRecord.id,
          updateDto,
        );
      } else {
        const createDto: CreateStaffingRecordDto = {
          projectId: values.projectId,
          employeeId: values.employeeId,
          role: values.role,
          allocationPercentage: values.allocationPercentage,
          hourlyRate: values.hourlyRate,
          totalHours: values.totalHours,
          startDate: values.startDate ? `${values.startDate}T00:00:00` : "",
          endDate: values.endDate ? `${values.endDate}T23:59:59` : "",
          status: values.status,
          notes: values.notes,
        };
        await resourceTrackingService.createStaffingRecord(createDto);
      }
      onSubmit();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save staffing record",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)} sx={{ pt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack spacing={2}>
        <Controller
          name="employeeId"
          control={control}
          rules={{ required: true, min: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Employee ID"
              fullWidth
              inputProps={{ min: 1 }}
              onChange={(e) =>
                field.onChange((e.target as HTMLInputElement).valueAsNumber)
              }
              required
            />
          )}
        />

        <Controller
          name="projectId"
          control={control}
          rules={{ required: true, min: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Project ID"
              fullWidth
              inputProps={{ min: 1 }}
              onChange={(e) =>
                field.onChange((e.target as HTMLInputElement).valueAsNumber)
              }
              required
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Role"
              fullWidth
              required
              placeholder="e.g., Developer, Designer, Project Manager"
            />
          )}
        />

        <Controller
          name="allocationPercentage"
          control={control}
          rules={{ required: true, min: 1, max: 100 }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Allocation Percentage"
              fullWidth
              inputProps={{ min: 1, max: 100 }}
              onChange={(e) =>
                field.onChange((e.target as HTMLInputElement).valueAsNumber)
              }
              required
            />
          )}
        />

        <Controller
          name="startDate"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              label="Start Date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        <Controller
          name="endDate"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              label="End Date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        <Controller
          name="hourlyRate"
          control={control}
          rules={{ required: true, min: 0 }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Hourly Rate"
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              onChange={(e) =>
                field.onChange((e.target as HTMLInputElement).valueAsNumber)
              }
              required
            />
          )}
        />

        <Controller
          name="totalHours"
          control={control}
          rules={{ required: true, min: 0 }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Total Hours"
              fullWidth
              inputProps={{ min: 0, step: 0.5 }}
              onChange={(e) =>
                field.onChange((e.target as HTMLInputElement).valueAsNumber)
              }
              required
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl fullWidth required>
              <InputLabel id="status-label">Status</InputLabel>
              <Select {...field} labelId="status-label" label="Status">
                <MenuItem value={StaffingStatus.Planned}>Planned</MenuItem>
                <MenuItem value={StaffingStatus.Active}>Active</MenuItem>
                <MenuItem value={StaffingStatus.Completed}>Completed</MenuItem>
                <MenuItem value={StaffingStatus.Cancelled}>Cancelled</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="notes"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Notes"
              fullWidth
              multiline
              rows={3}
              required
              placeholder="Additional notes about this staffing assignment..."
            />
          )}
        />
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}
      >
        <Button id="cancel-staffing-form-btn" variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button id="submit-staffing-form-btn" type="submit" variant="contained" disabled={loading}>
          {loading ? "Saving..." : staffingRecord ? "Update" : "Create"}
        </Button>
      </Stack>
    </Box>
  );
};

export default StaffingForm;
