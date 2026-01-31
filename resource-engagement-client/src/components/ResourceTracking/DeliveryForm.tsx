import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Stack,
  TextField,
  Select,
  MenuItem,
  Button,
  Alert,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import {
  Delivery,
  CreateDeliveryDto,
  UpdateDeliveryDto,
  DeliveryPriority,
  DeliveryStatus,
} from "../../types/resourceTracking";
import resourceTrackingService from "../../services/resourceTrackingService";

interface DeliveryFormProps {
  delivery?: Delivery;
  onSubmit: () => void;
  onCancel: () => void;
}

type FormValues = {
  deliveryName: string;
  description: string;
  projectId: number | string;
  employeeId: number | string;
  plannedDeliveryDate: string;
  actualDeliveryDate?: string;
  estimatedEffort: number | string;
  actualEffort?: number | string;
  priority: DeliveryPriority;
  status?: DeliveryStatus;
  notes?: string;
  completionPercentage?: number | string;
};

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  delivery,
  onSubmit,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: {
      deliveryName: "",
      description: "",
      projectId: 0,
      employeeId: 0,
      plannedDeliveryDate: "",
      actualDeliveryDate: "",
      estimatedEffort: 0,
      actualEffort: undefined,
      priority: DeliveryPriority.Medium,
      status: DeliveryStatus.NotStarted,
      notes: "",
      completionPercentage: 0,
    },
  });
  const [error, setError] = React.useState("");

  useEffect(() => {
    if (delivery) {
      reset({
        deliveryName: delivery.deliveryName,
        description: delivery.description || "",
        projectId: delivery.projectId,
        employeeId: delivery.employeeId,
        plannedDeliveryDate: new Date(delivery.plannedDeliveryDate)
          .toISOString()
          .split("T")[0],
        actualDeliveryDate: delivery.actualDeliveryDate
          ? new Date(delivery.actualDeliveryDate).toISOString().split("T")[0]
          : "",
        estimatedEffort: delivery.estimatedEffort,
        actualEffort: delivery.actualEffort ?? undefined,
        priority: delivery.priority,
        status: delivery.status || DeliveryStatus.NotStarted,
        notes: "",
        completionPercentage: 0,
      });
    } else {
      reset({
        deliveryName: "",
        description: "",
        projectId: 0,
        employeeId: 0,
        plannedDeliveryDate: "",
        actualDeliveryDate: "",
        estimatedEffort: 0,
        actualEffort: undefined,
        priority: DeliveryPriority.Medium,
        status: DeliveryStatus.NotStarted,
        notes: "",
        completionPercentage: 0,
      });
    }
  }, [delivery, reset]);

  const onSubmitRHF = async (values: FormValues) => {
    setError("");
    try {
      if (delivery) {
        const updateDto: UpdateDeliveryDto = {
          deliveryName: values.deliveryName,
          description: values.description || undefined,
          projectId: Number(values.projectId),
          employeeId: Number(values.employeeId),
          plannedDeliveryDate: values.plannedDeliveryDate,
          actualDeliveryDate: values.actualDeliveryDate || undefined,
          estimatedEffort: Number(values.estimatedEffort),
          actualEffort:
            values.actualEffort !== undefined && values.actualEffort !== ""
              ? Number(values.actualEffort)
              : undefined,
          priority: values.priority,
          status: values.status,
          notes: values.notes || undefined,
          completionPercentage:
            values.completionPercentage !== undefined &&
            values.completionPercentage !== ""
              ? Number(values.completionPercentage)
              : undefined,
        };
        await resourceTrackingService.updateDelivery(delivery.id, updateDto);
      } else {
        const createDto: CreateDeliveryDto = {
          deliveryName: values.deliveryName,
          description: values.description || undefined,
          projectId: Number(values.projectId),
          employeeId: Number(values.employeeId),
          plannedDeliveryDate: values.plannedDeliveryDate,
          actualDeliveryDate: values.actualDeliveryDate || undefined,
          estimatedEffort: Number(values.estimatedEffort),
          actualEffort:
            values.actualEffort !== undefined && values.actualEffort !== ""
              ? Number(values.actualEffort)
              : undefined,
          priority: values.priority,
        };
        await resourceTrackingService.createDelivery(createDto);
      }
      onSubmit();
    } catch (err: any) {
      setError(
        "Failed to save delivery: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {delivery ? "Edit Delivery" : "Create New Delivery"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmitRHF)}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Controller
              name="deliveryName"
              control={control}
              rules={{ required: "Delivery name is required", maxLength: 200 }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Delivery Name"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <FormControl fullWidth error={!!errors.priority}>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Controller
                name="priority"
                control={control}
                rules={{ required: "Priority is required" }}
                render={({ field }) => (
                  <Select {...field} labelId="priority-label" label="Priority">
                    {Object.values(DeliveryPriority).map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {!!errors.priority && (
                <FormHelperText>
                  {String(errors.priority.message)}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>

          <Controller
            name="description"
            control={control}
            rules={{ maxLength: 500 }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                minRows={3}
              />
            )}
          />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Controller
              name="projectId"
              control={control}
              rules={{
                required: "Project ID is required",
                min: { value: 1, message: "Must be positive" },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Project ID"
                  type="number"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="employeeId"
              control={control}
              rules={{
                required: "Employee ID is required",
                min: { value: 1, message: "Must be positive" },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Employee ID"
                  type="number"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Controller
              name="plannedDeliveryDate"
              control={control}
              rules={{ required: "Planned date is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Planned Delivery Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="actualDeliveryDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Actual Delivery Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              )}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Controller
              name="estimatedEffort"
              control={control}
              rules={{
                required: "Estimated effort is required",
                min: { value: 0.1, message: "Must be >= 0.1" },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Estimated Effort (hours)"
                  type="number"
                  inputProps={{ step: 0.1, min: 0.1 }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="actualEffort"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Actual Effort (hours)"
                  type="number"
                  inputProps={{ step: 0.1, min: 0.1 }}
                  fullWidth
                />
              )}
            />
          </Stack>

          {delivery && (
            <>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} labelId="status-label" label="Status">
                        {Object.values(DeliveryStatus).map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>

                <Controller
                  name="completionPercentage"
                  control={control}
                  rules={{
                    min: { value: 0, message: "Min 0" },
                    max: { value: 100, message: "Max 100" },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Completion Percentage"
                      type="number"
                      inputProps={{ min: 0, max: 100 }}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Stack>

              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notes"
                    fullWidth
                    multiline
                    minRows={3}
                  />
                )}
              />
            </>
          )}

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button id="cancel-delivery-form-btn" variant="outlined" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button id="submit-delivery-form-btn" variant="contained" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : delivery
                  ? "Update Delivery"
                  : "Create Delivery"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default DeliveryForm;
