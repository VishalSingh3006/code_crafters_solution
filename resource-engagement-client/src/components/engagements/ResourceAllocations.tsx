import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { ResourceAllocation } from "../../types";
import { useResourceAllocations, useResourceAllocationActions } from "../../hooks/useResourceAllocations";
import { ResourceAllocationForm } from "./ResourceAllocationForm";

interface ResourceAllocationsProps {
  engagementId: number;
  onAllocationChange?: () => void;
}

export const ResourceAllocations: React.FC<ResourceAllocationsProps> = ({
  engagementId,
  onAllocationChange,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<ResourceAllocation | null>(null);

  const { allocations, loading, error, fetchByEngagementId } = useResourceAllocations();
  const { remove, pending: actionPending, error: actionError } = useResourceAllocationActions();

  useEffect(() => {
    if (engagementId) {
      fetchByEngagementId(engagementId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId]); // Only depend on engagementId

  const handleAdd = () => {
    setEditingAllocation(null);
    setShowForm(true);
  };

  const handleEdit = (allocation: ResourceAllocation) => {
    setEditingAllocation(allocation);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this resource allocation?")) {
      try {
        await remove(id);
        await fetchByEngagementId(engagementId);
        onAllocationChange?.();
      } catch (error) {
        console.error("Failed to delete resource allocation:", error);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAllocation(null);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingAllocation(null);
    await fetchByEngagementId(engagementId);
    onAllocationChange?.();
  };

  const getPercentageColor = (percentage: number): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    if (percentage >= 100) return "error";
    if (percentage >= 75) return "warning";
    if (percentage >= 50) return "primary";
    if (percentage >= 25) return "info";
    return "default";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  const totalAllocation = allocations.reduce((sum, allocation) => sum + allocation.allocationPercentage, 0);

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">Resource Allocations</Typography>
            {allocations.length > 0 && (
              <Chip
                label={`Total: ${totalAllocation.toFixed(1)}%`}
                color={totalAllocation > 100 ? "error" : totalAllocation === 100 ? "success" : "default"}
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        }
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={actionPending}
          >
            Add Allocation
          </Button>
        }
      />
      <CardContent>
        {(error || actionError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || actionError}
          </Alert>
        )}

        {totalAllocation > 100 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Total allocation exceeds 100%. Please review the allocations.
          </Alert>
        )}

        {allocations.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            No resource allocations defined for this engagement
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell align="center">Allocation %</TableCell>
                  <TableCell align="center">Start Date</TableCell>
                  <TableCell align="center">End Date</TableCell>
                  <TableCell align="center" width={120}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allocations.map((allocation) => (
                  <TableRow key={allocation.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {allocation.employeeName || `Employee ID: ${allocation.employeeId}`}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${allocation.allocationPercentage}%`}
                        color={getPercentageColor(allocation.allocationPercentage)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {allocation.allocationStart 
                          ? new Date(allocation.allocationStart).toLocaleDateString()
                          : "Not set"
                        }
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {allocation.allocationEnd 
                          ? new Date(allocation.allocationEnd).toLocaleDateString()
                          : "Ongoing"
                        }
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(allocation)}
                        disabled={actionPending}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(allocation.id)}
                        disabled={actionPending}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <ResourceAllocationForm
          open={showForm}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          engagementId={engagementId}
          allocation={editingAllocation}
        />
      </CardContent>
    </Card>
  );
};