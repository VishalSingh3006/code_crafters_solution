import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Stack,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Delivery,
  DeliveryStatus,
  DeliveryPriority,
} from "../../types/resourceTracking";
import resourceTrackingService from "../../services/resourceTrackingService";

interface DeliveryListProps {
  onEditDelivery: (delivery: Delivery) => void;
  onDeleteDelivery: (deliveryId: number) => void;
  refreshTrigger?: number;
}

const DeliveryList: React.FC<DeliveryListProps> = ({
  onEditDelivery,
  onDeleteDelivery,
  refreshTrigger,
}) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  type FilterValues = {
    status: DeliveryStatus | "all";
    priority: DeliveryPriority | "all";
  };

  const { control, watch } = useForm<FilterValues>({
    defaultValues: { status: "all", priority: "all" },
  });

  useEffect(() => {
    loadDeliveries();
  }, [refreshTrigger]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const data = await resourceTrackingService.getAllDeliveries();
      setDeliveries(data);
    } catch (err: any) {
      setError(
        "Failed to load deliveries: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deliveryId: number) => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      try {
        await resourceTrackingService.deleteDelivery(deliveryId);
        onDeleteDelivery(deliveryId);
        await loadDeliveries(); // Refresh the list
      } catch (err: any) {
        setError(
          "Failed to delete delivery: " +
            (err.response?.data?.message || err.message),
        );
      }
    }
  };

  const getStatusColor = (
    status: DeliveryStatus,
  ):
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning" => {
    switch (status) {
      case DeliveryStatus.Completed:
        return "success";
      case DeliveryStatus.InProgress:
        return "info";
      case DeliveryStatus.OnHold:
        return "warning";
      case DeliveryStatus.Cancelled:
        return "error";
      default:
        return "default";
    }
  };

  const getPriorityColor = (
    priority: DeliveryPriority,
  ):
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning" => {
    switch (priority) {
      case DeliveryPriority.Critical:
        return "error";
      case DeliveryPriority.High:
        return "warning";
      case DeliveryPriority.Medium:
        return "info";
      default:
        return "default";
    }
  };

  const statusFilter = watch("status");
  const priorityFilter = watch("priority");

  const filteredDeliveries = deliveries.filter((delivery) => {
    const statusMatch =
      statusFilter === "all" || delivery.status === statusFilter;
    const priorityMatch =
      priorityFilter === "all" || delivery.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  if (loading) {
    return (
      <Box
        sx={{
          py: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={28} />
        <Typography>Loading deliveries...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card elevation={1} sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="status-filter-label">Status Filter</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="status-filter-label"
                  label="Status Filter"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  {Object.values(DeliveryStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="priority-filter-label">Priority Filter</InputLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="priority-filter-label"
                  label="Priority Filter"
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  {Object.values(DeliveryPriority).map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Stack>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        {filteredDeliveries.map((delivery) => (
          <Card key={delivery.id} variant="outlined">
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                  {delivery.deliveryName}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => onEditDelivery(delivery)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(delivery.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>

              {delivery.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                  noWrap
                >
                  {delivery.description}
                </Typography>
              )}

              <Stack spacing={1} sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Planned Date
                  </Typography>
                  <Typography variant="caption">
                    {new Date(
                      delivery.plannedDeliveryDate,
                    ).toLocaleDateString()}
                  </Typography>
                </Stack>
                {delivery.actualDeliveryDate && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      Actual Date
                    </Typography>
                    <Typography variant="caption">
                      {new Date(
                        delivery.actualDeliveryDate,
                      ).toLocaleDateString()}
                    </Typography>
                  </Stack>
                )}
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Estimated Effort
                  </Typography>
                  <Typography variant="caption">
                    {delivery.estimatedEffort}h
                  </Typography>
                </Stack>
                {delivery.actualEffort && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      Actual Effort
                    </Typography>
                    <Typography variant="caption">
                      {delivery.actualEffort}h
                    </Typography>
                  </Stack>
                )}
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Chip
                  label={delivery.status}
                  color={getStatusColor(delivery.status)}
                  size="small"
                />
                <Chip
                  label={delivery.priority}
                  color={getPriorityColor(delivery.priority)}
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {filteredDeliveries.length === 0 && (
        <Typography align="center" sx={{ py: 6 }} color="text.secondary">
          No deliveries found matching the current filters.
        </Typography>
      )}
    </Box>
  );
};

export default DeliveryList;
