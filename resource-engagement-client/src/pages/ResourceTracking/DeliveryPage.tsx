import React, { useState } from "react";
import { Delivery } from "../../types/resourceTracking";
import DeliveryList from "../../components/ResourceTracking/DeliveryList";
import DeliveryForm from "../../components/ResourceTracking/DeliveryForm";
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

const DeliveryPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<
    Delivery | undefined
  >();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setEditingDelivery(undefined);
    setShowForm(true);
  };

  const handleEditDelivery = (delivery: Delivery) => {
    setEditingDelivery(delivery);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingDelivery(undefined);
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh of the list
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDelivery(undefined);
  };

  const handleDeleteDelivery = (deliveryId: number) => {
    // The delete is handled in DeliveryList component
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper", boxShadow: 2 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Delivery Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Track and manage project deliveries, timelines, and effort
            </Typography>
          </Box>
          <Button
            id="new-delivery-btn"
            variant="contained"
            onClick={handleCreateNew}
          >
            New Delivery
          </Button>
        </Stack>

        <Dialog
          open={showForm}
          onClose={handleFormCancel}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingDelivery ? "Edit Delivery" : "New Delivery"}
          </DialogTitle>
          <DialogContent dividers>
            <DeliveryForm
              delivery={editingDelivery}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </DialogContent>
          <DialogActions>
            <Button
              id="cancel-delivery-dialog-btn"
              variant="outlined"
              onClick={handleFormCancel}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Paper elevation={1} sx={{ p: 2 }}>
          <DeliveryList
            onEditDelivery={handleEditDelivery}
            onDeleteDelivery={handleDeleteDelivery}
            refreshTrigger={refreshTrigger}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default DeliveryPage;
