import React, { useState } from "react";
import { StaffingRecord } from "../../types/resourceTracking";
import StaffingList from "../../components/ResourceTracking/StaffingList";
import StaffingForm from "../../components/ResourceTracking/StaffingForm";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const StaffingPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingStaffingRecord, setEditingStaffingRecord] = useState<
    StaffingRecord | undefined
  >(undefined);

  const handleEditStaffingRecord = (staffingRecord: StaffingRecord) => {
    setEditingStaffingRecord(staffingRecord);
    setShowForm(true);
  };

  const handleDeleteStaffingRecord = (staffingRecordId: number) => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCreateNew = () => {
    setEditingStaffingRecord(undefined);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingStaffingRecord(undefined);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStaffingRecord(undefined);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Staffing Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Manage employee assignments, roles, and resource allocation
            </Typography>
          </Box>
          <Button id="new-staffing-record-btn" variant="contained" onClick={handleCreateNew}>
            New Staffing Record
          </Button>
        </Stack>

        <Dialog
          open={showForm}
          onClose={handleFormCancel}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingStaffingRecord
              ? "Edit Staffing Record"
              : "Create New Staffing Record"}
          </DialogTitle>
          <DialogContent dividers>
            <StaffingForm
              staffingRecord={editingStaffingRecord}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </DialogContent>
          <DialogActions>
            <Button id="cancel-staffing-dialog-btn" variant="outlined" onClick={handleFormCancel}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Paper elevation={1} sx={{ p: 2 }}>
          <StaffingList
            onEditStaffingRecord={handleEditStaffingRecord}
            onDeleteStaffingRecord={handleDeleteStaffingRecord}
            refreshTrigger={refreshTrigger}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default StaffingPage;
