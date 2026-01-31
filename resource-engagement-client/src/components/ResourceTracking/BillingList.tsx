import React, { useEffect, useState } from "react";
import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import resourceTrackingService from "../../services/resourceTrackingService";
import { BillingRecord, CreateBillingRecordDto, UpdateBillingRecordDto, BillingType, BillingStatus } from "../../types/resourceTracking";

// Remove local redeclaration of CreateBillingRecordDto, use imported type instead.

const initialForm: CreateBillingRecordDto & { status: BillingStatus } = {
  projectId: 0,
  employeeId: 0,
  billingPeriodStart: "",
  billingPeriodEnd: "",
  hoursWorked: 0,
  hourlyRate: 0,
  totalAmount: 0,
  taxAmount: 0,
  discountAmount: 0,
  finalAmount: 0,
  billingType: BillingType.Regular,
  paymentDueDate: "",
  notes: "",
  status: BillingStatus.Draft // or another default status
};

export default function BillingList() {
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateBillingRecordDto & { status: BillingStatus }>(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<string>("");

  const fetchRecords = async () => {
    try {
      const data = await resourceTrackingService.getAllBillingRecords();
      setRecords(data);
    } catch {
      setSnackbar("Failed to fetch billing records.");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleOpen = (record?: BillingRecord) => {
    if (record) {
      setEditId(record.id);
      setForm({
        projectId: record.projectId,
        employeeId: record.employeeId,
        billingPeriodStart: record.billingPeriodStart,
        billingPeriodEnd: record.billingPeriodEnd,
        hoursWorked: record.hoursWorked,
        hourlyRate: record.hourlyRate,
        totalAmount: record.totalAmount,
        taxAmount: record.taxAmount,
        discountAmount: record.discountAmount,
        finalAmount: record.finalAmount,
        billingType: record.billingType,
        paymentDueDate: record.paymentDueDate,
        notes: record.notes ?? "",
        status: record.status
      });
    } else {
      setEditId(null);
      setForm(initialForm);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await resourceTrackingService.updateBillingRecord(editId, form as UpdateBillingRecordDto);
        setSnackbar("Billing record updated.");
      } else {
        await resourceTrackingService.createBillingRecord(form);
        setSnackbar("Billing record created.");
      }
      fetchRecords();
      handleClose();
    } catch {
      setSnackbar("Failed to save billing record.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await resourceTrackingService.deleteBillingRecord(id);
      setSnackbar("Billing record deleted.");
      fetchRecords();
    } catch {
      setSnackbar("Failed to delete billing record.");
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Billing Records</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ mb: 2 }}>Add Billing</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Period Start</TableCell>
              <TableCell>Period End</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((rec) => (
              <TableRow key={rec.id}>
                <TableCell>{rec.id}</TableCell>
                <TableCell>{rec.projectId}</TableCell>
                <TableCell>{rec.employeeId}</TableCell>
                <TableCell>{rec.billingPeriodStart}</TableCell>
                <TableCell>{rec.billingPeriodEnd}</TableCell>
                <TableCell>{rec.hoursWorked}</TableCell>
                <TableCell>{rec.hourlyRate}</TableCell>
                <TableCell>{rec.totalAmount}</TableCell>
                <TableCell>{rec.billingType}</TableCell>
                <TableCell>{rec.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(rec)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(rec.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? "Edit Billing" : "Add Billing"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
          <TextField label="Project ID" name="projectId" type="number" value={form.projectId} onChange={handleChange} required />
          <TextField label="Employee ID" name="employeeId" type="number" value={form.employeeId} onChange={handleChange} required />
          <TextField label="Period Start" name="billingPeriodStart" type="date" value={form.billingPeriodStart} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField label="Period End" name="billingPeriodEnd" type="date" value={form.billingPeriodEnd} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField label="Hours Worked" name="hoursWorked" type="number" value={form.hoursWorked} onChange={handleChange} required />
          <TextField label="Hourly Rate" name="hourlyRate" type="number" value={form.hourlyRate} onChange={handleChange} required />
          <TextField label="Total Amount" name="totalAmount" type="number" value={form.totalAmount} onChange={handleChange} required />
          <TextField label="Tax Amount" name="taxAmount" type="number" value={form.taxAmount} onChange={handleChange} required />
          <TextField label="Discount Amount" name="discountAmount" type="number" value={form.discountAmount} onChange={handleChange} />
          <TextField label="Final Amount" name="finalAmount" type="number" value={form.finalAmount} onChange={handleChange} required />
          <TextField select label="Billing Type" name="billingType" value={form.billingType} onChange={handleChange} SelectProps={{ native: true }} required>
            {Object.values(BillingType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </TextField>
          <TextField select label="Status" name="status" value={form.status} onChange={handleChange} SelectProps={{ native: true }} required>
            {Object.values(BillingStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </TextField>
          <TextField label="Payment Due Date" name="paymentDueDate" type="date" value={form.paymentDueDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar("")} message={snackbar} />
    </Card>
  );
}
