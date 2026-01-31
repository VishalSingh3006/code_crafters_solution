import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { ProjectClientEngagementForm } from "../components/engagements/ProjectClientEngagementForm";
import { ProjectClientEngagementTable } from "../components/engagements/ProjectClientEngagementTable";
import {
  useProjectClientEngagements,
  useProjectClientEngagementActions,
} from "../hooks/useProjectClientEngagements";
import { projectsService } from "../services/projectsService";
import { clientsService } from "../services/clientsService";
import type {
  ProjectClientEngagement,
  Project,
  Client,
  CreateProjectClientEngagementRequest,
  UpdateProjectClientEngagementRequest,
} from "../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`engagement-tabpanel-${index}`}
    aria-labelledby={`engagement-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

export const EngagementManagementPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEngagement, setEditingEngagement] = useState<ProjectClientEngagement | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    projectEngagements,
    clientEngagements,
    loading,
    error,
    refetchProjectEngagements,
    refetchClientEngagements,
  } = useProjectClientEngagements();

  const { create, update, remove, pending } = useProjectClientEngagementActions();

  // Load projects and clients
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        const response = await projectsService.getAll();
        setProjects(response);
      } catch (error) {
        console.error("Failed to load projects:", error);
        showSnackbar("Failed to load projects", "error");
      } finally {
        setLoadingProjects(false);
      }
    };

    const loadClients = async () => {
      try {
        setLoadingClients(true);
        const response = await clientsService.getAll();
        setClients(response);
      } catch (error) {
        console.error("Failed to load clients:", error);
        showSnackbar("Failed to load clients", "error");
      } finally {
        setLoadingClients(false);
      }
    };

    loadProjects();
    loadClients();
  }, []);

  const showSnackbar = (message: string, severity: "success" | "error" | "warning" | "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateClick = () => {
    setEditingEngagement(null);
    setFormOpen(true);
  };

  const handleEditClick = (engagement: ProjectClientEngagement) => {
    setEditingEngagement(engagement);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = async (data: CreateProjectClientEngagementRequest | UpdateProjectClientEngagementRequest) => {
    try {
      console.log('Form submit:', { 
        editing: !!editingEngagement, 
        data, 
        editingId: editingEngagement?.id 
      });
      
      if (editingEngagement) {
        const result = await update(editingEngagement.id, data as UpdateProjectClientEngagementRequest);
        console.log('Update result:', result);
        showSnackbar("Engagement updated successfully!", "success");
      } else {
        const result = await create(data as CreateProjectClientEngagementRequest);
        console.log('Create result:', result);
        showSnackbar("Engagement created successfully!", "success");
      }
      
      // Refresh data
      refetchProjectEngagements();
      refetchClientEngagements();
      
      setFormOpen(false);
      setEditingEngagement(null);
    } catch (error: any) {
      console.error('Form submit error:', error);
      showSnackbar(error?.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      try {
        await remove(deletingId);
        showSnackbar("Engagement deleted successfully!", "success");
        
        // Refresh data
        refetchProjectEngagements();
        refetchClientEngagements();
        
        setDeleteConfirmOpen(false);
        setDeletingId(null);
      } catch (error: any) {
        showSnackbar(error?.response?.data?.message || "Failed to delete engagement", "error");
      }
    }
  };

  // Determine mode based on editing engagement or current tab
  const getFormMode = () => {
    if (editingEngagement) {
      return editingEngagement.projectId ? "project" : "client";
    }
    return tabValue === 0 ? "project" : "client";
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Engagement Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateClick}
          disabled={loadingProjects || loadingClients}
        >
          Add New Engagement
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="engagement tabs">
          <Tab label="Project Engagement" id="engagement-tab-0" aria-controls="engagement-tabpanel-0" />
          <Tab label="Client Engagement" id="engagement-tab-1" aria-controls="engagement-tabpanel-1" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Project Engagements
        </Typography>
        <ProjectClientEngagementTable
          engagements={projectEngagements}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          loading={loading}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Client Engagements
        </Typography>
        <ProjectClientEngagementTable
          engagements={clientEngagements}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          loading={loading}
        />
      </TabPanel>

      <ProjectClientEngagementForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingEngagement(null);
        }}
        onSubmit={handleFormSubmit}
        engagement={editingEngagement}
        projects={projects}
        clients={clients}
        isLoading={pending}
        mode={getFormMode()}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this engagement? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={pending}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};