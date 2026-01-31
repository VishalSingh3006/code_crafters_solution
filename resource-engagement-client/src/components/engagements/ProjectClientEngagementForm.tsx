import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type {
  CreateProjectClientEngagementRequest,
  UpdateProjectClientEngagementRequest,
  ProjectClientEngagement,
  Project,
  Client,
} from "../../types";

type OutcomeStatus = "Success" | "Delayed" | "Cancelled";

interface ProjectClientEngagementFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectClientEngagementRequest | UpdateProjectClientEngagementRequest) => Promise<void>;
  engagement?: ProjectClientEngagement | null;
  projects: Project[];
  clients: Client[];
  isLoading?: boolean;
  mode: "project" | "client";
}

interface FormData {
  projectId?: number;
  clientId?: number;
  startDate: string;
  endDate?: string;
  outcomeStatus: OutcomeStatus;
}

const schema = yup.object().shape({
  projectId: yup.number().optional(),
  clientId: yup.number().optional(),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().optional(),
  outcomeStatus: yup.string().required("Outcome status is required").oneOf(["Success", "Delayed", "Cancelled"]),
});

const outcomeOptions: { value: OutcomeStatus; label: string }[] = [
  { value: "Success", label: "Success" },
  { value: "Delayed", label: "Delayed" },
  { value: "Cancelled", label: "Cancelled" },
];

export const ProjectClientEngagementForm: React.FC<ProjectClientEngagementFormProps> = ({
  open,
  onClose,
  onSubmit,
  engagement,
  projects,
  clients,
  isLoading = false,
  mode,
}) => {
  const getDefaultValues = () => {
    if (engagement) {
      return {
        projectId: engagement.projectId || undefined,
        clientId: engagement.clientId || undefined,
        startDate: engagement.startDate?.split("T")[0] || "",
        endDate: engagement.endDate?.split("T")[0] || "",
        outcomeStatus: engagement.outcomeStatus || "Success",
      };
    }
    return {
      projectId: mode === "project" ? projects[0]?.id : undefined,
      clientId: mode === "client" ? clients[0]?.id : undefined,
      startDate: "",
      endDate: "",
      outcomeStatus: "Success",
    };
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(),
  });

  React.useEffect(() => {
    const newValues = getDefaultValues();
    reset(newValues);
  }, [engagement, mode, projects, clients, reset]);

  const handleFormSubmit = async (data: any) => {
    try {
      // Clean up the data based on mode to avoid sending both projectId and clientId
      const cleanData: any = {
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        outcomeStatus: data.outcomeStatus,
      };
      
      if (mode === "project") {
        cleanData.projectId = data.projectId;
        // Don't send clientId for project engagements
      } else {
        cleanData.clientId = data.clientId;
        // Don't send projectId for client engagements  
      }
      
      // Remove undefined values
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === undefined || cleanData[key] === '') {
          delete cleanData[key];
        }
      });
      
      console.log('Submitting data:', cleanData, 'Mode:', mode, 'Editing:', !!engagement);
      
      await onSubmit(cleanData as CreateProjectClientEngagementRequest);
      onClose();
      reset();
    } catch (error) {
      // Error handling is done in parent component
      console.error('Form submission error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {engagement ? "Edit" : "Create"} {mode === "project" ? "Project" : "Client"} Engagement
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            {mode === "project" && (
              <FormControl fullWidth error={!!errors.projectId}>
                <InputLabel>Project</InputLabel>
                <Controller
                  name="projectId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Project">
                      {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            )}

            {mode === "client" && (
              <FormControl fullWidth error={!!errors.clientId}>
                <InputLabel>Client</InputLabel>
                <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Client">
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            )}

            <Box display="flex" gap={2}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                  />
                )}
              />

              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message}
                  />
                )}
              />
            </Box>

            <FormControl fullWidth error={!!errors.outcomeStatus}>
              <InputLabel>Outcome Status</InputLabel>
              <Controller
                name="outcomeStatus"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Outcome Status">
                    {outcomeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
          >
            {engagement ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};