import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import { StaffingRecord, StaffingStatus } from "../../types/resourceTracking";
import resourceTrackingService from "../../services/resourceTrackingService";

interface StaffingListProps {
  onEditStaffingRecord: (staffingRecord: StaffingRecord) => void;
  onDeleteStaffingRecord: (staffingRecordId: number) => void;
  refreshTrigger?: number;
}

const StaffingList: React.FC<StaffingListProps> = ({
  onEditStaffingRecord,
  onDeleteStaffingRecord,
  refreshTrigger,
}) => {
  const [staffingRecords, setStaffingRecords] = useState<StaffingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StaffingStatus | "all">(
    "all",
  );

  useEffect(() => {
    loadStaffingRecords();
  }, [refreshTrigger]);

  const loadStaffingRecords = async () => {
    try {
      setLoading(true);
      const data = await resourceTrackingService.getAllStaffingRecords();
      setStaffingRecords(data);
    } catch (err: any) {
      setError(
        "Failed to load staffing records: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (staffingRecordId: number) => {
    if (
      window.confirm("Are you sure you want to delete this staffing record?")
    ) {
      try {
        await resourceTrackingService.deleteStaffingRecord(staffingRecordId);
        onDeleteStaffingRecord(staffingRecordId);
        await loadStaffingRecords(); // Refresh the list
      } catch (err: any) {
        setError(
          "Failed to delete staffing record: " +
            (err.response?.data?.message || err.message),
        );
      }
    }
  };

  const getStatusColor = (
    status: StaffingStatus,
  ): "success" | "info" | "default" | "error" => {
    switch (status) {
      case StaffingStatus.Active:
        return "success";
      case StaffingStatus.Planned:
        return "info";
      case StaffingStatus.Completed:
        return "default";
      case StaffingStatus.Cancelled:
        return "error";
      default:
        return "default";
    }
  };

  const filteredStaffingRecords = staffingRecords.filter(
    (record) => statusFilter === "all" || record.status === statusFilter,
  );

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" py={4}>
        <CircularProgress size={32} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading staffing records...
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Filter */}
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Status Filter:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) =>
                setStatusFilter(e.target.value as StaffingStatus | "all")
              }
            >
              <MenuItem value="all">All Status</MenuItem>
              {Object.values(StaffingStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Staffing Records Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Project ID</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Allocation</TableCell>
              <TableCell>Rate/Hours</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaffingRecords.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>
                  <Typography variant="body2">{record.employeeId}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{record.projectId}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{record.role}</Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {new Date(record.startDate).toLocaleDateString()}
                    </Typography>
                    {record.endDate && (
                      <Typography variant="caption" color="text.secondary">
                        to {new Date(record.endDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {record.allocationPercentage}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      ${record.hourlyRate}/hr
                    </Typography>
                    {record.totalHours && (
                      <Typography variant="caption" color="text.secondary">
                        {record.totalHours}h total
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      id={`edit-staffing-${record.id}-btn`}
                      size="small"
                      variant="contained"
                      onClick={() => onEditStaffingRecord(record)}
                    >
                      Edit
                    </Button>
                    <Button
                      id={`delete-staffing-${record.id}-btn`}
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(record.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {filteredStaffingRecords.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body2" color="text.secondary">
            No staffing records found matching the current filter.
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default StaffingList;
