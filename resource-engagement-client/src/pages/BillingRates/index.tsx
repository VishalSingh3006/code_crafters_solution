import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Alert,
  useTheme,
  alpha,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  CurrencyExchange as CurrencyExchangeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useBillingRates } from "../../hooks/billingRateHooks";
import type {
  BillingRate,
  CreateBillingRateRequest,
  UpdateBillingRateRequest,
} from "../../types/billingRates";

const BillingRates: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Redux state and actions
  const {
    rates,
    revenueSummary,
    exchangeRate,
    loading,
    error,
    getAllRates,
    createRate,
    updateRate,
    deleteRate,
    getRevenueSummary,
    updateGlobalExchangeRate,
    getExchangeRate,
    clearBillingRateError,
    setLocalExchangeRate,
  } = useBillingRates();

  // Local state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRate, setEditingRate] = useState<BillingRate | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const [newRate, setNewRate] = useState<Partial<CreateBillingRateRequest>>({
    role: "",
    level: "",
    usdRate: 0,
    inrRate: 0,
    currency: "USD",
    effectiveDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  // Load data on mount
  useEffect(() => {
    getAllRates();
    getExchangeRate();
    getRevenueSummary(40);
  }, [getAllRates, getExchangeRate, getRevenueSummary]);

  // Handle error display
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      clearBillingRateError();
    }
  }, [error, clearBillingRateError]);

  const calculateRevenue = (rate: BillingRate, hours: number = 40) => {
    const usdRevenue = rate.usdRate * hours;
    const inrRevenue = rate.inrRate * hours;
    return { usdRevenue, inrRevenue };
  };

  const handleCurrencyChange = (currency: "USD" | "INR") => {
    setNewRate((prev) => {
      if (currency === "USD" && prev.usdRate) {
        return {
          ...prev,
          currency,
          inrRate: prev.usdRate * exchangeRate,
        };
      } else if (currency === "INR" && prev.inrRate) {
        return {
          ...prev,
          currency,
          usdRate: prev.inrRate / exchangeRate,
        };
      }
      return { ...prev, currency };
    });
  };

  const handleRateChange = (field: "usdRate" | "inrRate", value: number) => {
    setNewRate((prev) => {
      const updates: Partial<CreateBillingRateRequest> = { [field]: value };

      if (field === "usdRate") {
        updates.inrRate = value * exchangeRate;
      } else {
        updates.usdRate = value / exchangeRate;
      }

      return { ...prev, ...updates };
    });
  };

  const handleSaveRate = async () => {
    try {
      if (editingRate) {
        await updateRate(editingRate.id, newRate as UpdateBillingRateRequest);
        setSnackbarMessage("Billing rate updated successfully");
      } else {
        await createRate(newRate as CreateBillingRateRequest);
        setSnackbarMessage("Billing rate created successfully");
      }

      setSnackbarSeverity("success");
      setShowSnackbar(true);
      setOpenDialog(false);
      setEditingRate(null);
      resetForm();

      // Refresh data
      getAllRates();
      getRevenueSummary(40);
    } catch (err) {
      setSnackbarMessage("Failed to save billing rate");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  };

  const handleEditRate = (rate: BillingRate) => {
    setEditingRate(rate);
    setNewRate({
      role: rate.role,
      level: rate.level,
      usdRate: rate.usdRate,
      inrRate: rate.inrRate,
      currency: rate.currency,
      effectiveDate: rate.effectiveDate,
      description: rate.description,
    });
    setOpenDialog(true);
  };

  const handleDeleteRate = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this billing rate?")) {
      try {
        await deleteRate(id);
        setSnackbarMessage("Billing rate deleted successfully");
        setSnackbarSeverity("success");
        setShowSnackbar(true);

        // Refresh data
        getAllRates();
        getRevenueSummary(40);
      } catch (err) {
        setSnackbarMessage("Failed to delete billing rate");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      }
    }
  };

  const handleExchangeRateChange = async (newExchangeRate: number) => {
    try {
      await updateGlobalExchangeRate({ exchangeRate: newExchangeRate });
      setSnackbarMessage("Exchange rate updated successfully");
      setSnackbarSeverity("success");
      setShowSnackbar(true);

      // Refresh revenue summary
      getRevenueSummary(40);
    } catch (err) {
      setSnackbarMessage("Failed to update exchange rate");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  };

  const resetForm = () => {
    setNewRate({
      role: "",
      level: "",
      usdRate: 0,
      inrRate: 0,
      currency: "USD",
      effectiveDate: new Date().toISOString().split("T")[0],
      description: "",
    });
  };

  const totalUSDRevenue =
    revenueSummary?.totalUsdRevenue ||
    rates.reduce((sum, rate) => {
      const { usdRevenue } = calculateRevenue(rate);
      return sum + usdRevenue;
    }, 0);

  const totalINRRevenue =
    revenueSummary?.totalInrRevenue ||
    rates.reduce((sum, rate) => {
      const { inrRevenue } = calculateRevenue(rate);
      return sum + inrRevenue;
    }, 0);

  return (
    <Box sx={{ p: 3 }}>
      {loading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      )}

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton
          onClick={() => navigate("/resource-tracking/billing")}
          sx={{
            color: "primary.main",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Billing Rates Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingRate(null);
            resetForm();
            setOpenDialog(true);
          }}
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
          disabled={loading}
        >
          Add Rate
        </Button>
      </Stack>

      {/* Revenue Overview Cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.8)}, ${alpha(theme.palette.success.dark, 0.8)})`,
              color: "white",
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <AttachMoneyIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">USD Revenue</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ${totalUSDRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Per week (40 hrs)
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.8)}, ${alpha(theme.palette.info.dark, 0.8)})`,
              color: "white",
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CurrencyExchangeIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">INR Revenue</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹{totalINRRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Per week (40 hrs)
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.8)}, ${alpha(theme.palette.warning.dark, 0.8)})`,
              color: "white",
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TrendingUpIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Exchange Rate</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {exchangeRate}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    USD to INR
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Exchange Rate Setting */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Currency Settings
          </Typography>
          <TextField
            label="USD to INR Exchange Rate"
            type="number"
            value={exchangeRate}
            onChange={(e) => {
              const newRate = parseFloat(e.target.value) || 83;
              setLocalExchangeRate(newRate);
            }}
            onBlur={(e) => {
              const newRate = parseFloat(e.target.value) || 83;
              if (newRate !== exchangeRate) {
                handleExchangeRateChange(newRate);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
            disabled={loading}
          />
        </CardContent>
      </Card>

      {/* Rates Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Current Billing Rates
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>USD Rate</TableCell>
                  <TableCell>INR Rate</TableCell>
                  <TableCell>Primary Currency</TableCell>
                  <TableCell>Weekly Revenue</TableCell>
                  <TableCell>Effective Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rates.map((rate) => {
                  const { usdRevenue, inrRevenue } = calculateRevenue(rate);
                  return (
                    <TableRow key={rate.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {rate.role}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={rate.level}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>${rate.usdRate}/hr</TableCell>
                      <TableCell>₹{rate.inrRate}/hr</TableCell>
                      <TableCell>
                        <Chip
                          label={rate.currency}
                          size="small"
                          color={rate.currency === "USD" ? "success" : "info"}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            ${usdRevenue.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ₹{inrRevenue.toLocaleString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{rate.effectiveDate}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditRate(rate)}
                            color="primary"
                            disabled={loading}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRate(rate.id)}
                            color="error"
                            disabled={loading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Rate Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingRate ? "Edit Billing Rate" : "Add New Billing Rate"}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3,
              mt: 1,
            }}
          >
            <TextField
              fullWidth
              label="Role"
              value={newRate.role}
              onChange={(e) =>
                setNewRate((prev) => ({ ...prev, role: e.target.value }))
              }
              disabled={loading}
            />
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Level</InputLabel>
              <Select
                value={newRate.level}
                onChange={(e) =>
                  setNewRate((prev) => ({ ...prev, level: e.target.value }))
                }
              >
                <MenuItem value="Junior">Junior</MenuItem>
                <MenuItem value="Mid">Mid</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
                <MenuItem value="Lead">Lead</MenuItem>
                <MenuItem value="Principal">Principal</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Primary Currency</InputLabel>
              <Select
                value={newRate.currency}
                onChange={(e) =>
                  handleCurrencyChange(e.target.value as "USD" | "INR")
                }
              >
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="INR">INR (₹)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Effective Date"
              type="date"
              value={newRate.effectiveDate}
              onChange={(e) =>
                setNewRate((prev) => ({
                  ...prev,
                  effectiveDate: e.target.value,
                }))
              }
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="USD Rate"
              type="number"
              value={newRate.usdRate}
              onChange={(e) =>
                handleRateChange("usdRate", parseFloat(e.target.value) || 0)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">/hr</InputAdornment>
                ),
              }}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="INR Rate"
              type="number"
              value={newRate.inrRate}
              onChange={(e) =>
                handleRateChange("inrRate", parseFloat(e.target.value) || 0)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">/hr</InputAdornment>
                ),
              }}
              disabled={loading}
            />
            <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newRate.description}
                onChange={(e) =>
                  setNewRate((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={loading}
              />
            </Box>
          </Box>

          {newRate.currency && newRate.usdRate && newRate.inrRate && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Revenue Calculation (40 hrs/week):</strong>
                <br />
                USD: ${((newRate.usdRate || 0) * 40).toLocaleString()} | INR: ₹
                {((newRate.inrRate || 0) * 40).toLocaleString()}
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveRate}
            variant="contained"
            disabled={
              loading ||
              !newRate.role ||
              !newRate.level ||
              !newRate.usdRate ||
              !newRate.inrRate
            }
          >
            {editingRate ? "Update" : "Add"} Rate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BillingRates;
