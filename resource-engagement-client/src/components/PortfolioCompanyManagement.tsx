import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { 
  portfolioCompanyService, 
  type PortfolioCompany, 
  type CreatePortfolioCompanyRequest, 
  type UpdatePortfolioCompanyRequest 
} from "../services/portfolioCompanyService";

const PortfolioCompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<PortfolioCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<PortfolioCompany | null>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    currencyCode: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const currencyOptions = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF"];
  const statusOptions = ["Active", "Inactive", "Pending", "Closed"];

  // Load companies on component mount
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await portfolioCompanyService.getAll();
      setCompanies(data);
    } catch (error) {
      showSnackbar("Failed to load portfolio companies", "error");
      console.error("Error loading portfolio companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: typeof snackbar.severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const openCreateDialog = () => {
    setEditingCompany(null);
    setFormData({
      name: "",
      currencyCode: "",
      status: "",
      startDate: "",
      endDate: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (company: PortfolioCompany) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      currencyCode: company.currencyCode,
      status: company.status,
      startDate: company.startDate.split('T')[0], // Format for date input
      endDate: company.endDate ? company.endDate.split('T')[0] : "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCompany(null);
    setFormData({
      name: "",
      currencyCode: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name.trim(),
        currencyCode: formData.currencyCode,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
      };

      if (editingCompany) {
        await portfolioCompanyService.update(editingCompany.id, payload as UpdatePortfolioCompanyRequest);
        showSnackbar("Portfolio company updated successfully", "success");
      } else {
        await portfolioCompanyService.create(payload as CreatePortfolioCompanyRequest);
        showSnackbar("Portfolio company created successfully", "success");
      }

      handleCloseDialog();
      loadCompanies();
    } catch (error) {
      showSnackbar(
        `Failed to ${editingCompany ? "update" : "create"} portfolio company`,
        "error"
      );
      console.error("Error saving portfolio company:", error);
    }
  };

  const openDeleteDialog = (id: number) => {
    setDeletingCompanyId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingCompanyId(null);
  };

  const handleDelete = async () => {
    if (deletingCompanyId === null) return;

    try {
      await portfolioCompanyService.delete(deletingCompanyId);
      showSnackbar("Portfolio company deleted successfully", "success");
      handleCloseDeleteDialog();
      loadCompanies();
    } catch (error) {
      showSnackbar("Failed to delete portfolio company", "error");
      console.error("Error deleting portfolio company:", error);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "pending":
        return "warning";
      case "closed":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Portfolio Companies
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
            >
              Add New Company
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Currency</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Start Date</strong></TableCell>
                  <TableCell><strong>End Date</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No portfolio companies found. Create your first company!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company.id} hover>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{company.currencyCode}</TableCell>
                      <TableCell>
                        <Chip 
                          label={company.status} 
                          color={getStatusColor(company.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(company.startDate)}</TableCell>
                      <TableCell>{formatDate(company.endDate)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(company)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => openDeleteDialog(company.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCompany ? "Edit Portfolio Company" : "Create New Portfolio Company"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Company Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              fullWidth
            />
            
            <FormControl fullWidth required>
              <InputLabel>Currency Code</InputLabel>
              <Select
                value={formData.currencyCode}
                onChange={(e) => handleInputChange("currencyCode", e.target.value)}
                label="Currency Code"
              >
                {currencyOptions.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                label="Status"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Date (Optional)"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name.trim() || !formData.currencyCode || !formData.status || !formData.startDate}
          >
            {editingCompany ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this portfolio company? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PortfolioCompanyManagement;