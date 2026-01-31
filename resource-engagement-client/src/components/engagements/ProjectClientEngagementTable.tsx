import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import type { ProjectClientEngagement } from "../../types";

interface ProjectClientEngagementTableProps {
  engagements: ProjectClientEngagement[];
  onEdit: (engagement: ProjectClientEngagement) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Success":
      return "success";
    case "Delayed":
      return "warning";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), "MMM dd, yyyy");
  } catch (error) {
    return dateString;
  }
};

export const ProjectClientEngagementTable: React.FC<ProjectClientEngagementTableProps> = ({
  engagements,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography>Loading engagements...</Typography>
      </Box>
    );
  }

  if (engagements.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography color="textSecondary">No engagements found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Project/Client</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {engagements.map((engagement) => (
            <TableRow key={engagement.id}>
              <TableCell>{engagement.id}</TableCell>
              <TableCell>
                {engagement.projectId ? (
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Project: {engagement.projectName || `Project ID: ${engagement.projectId}`}
                    </Typography>
                  </Box>
                ) : engagement.clientId ? (
                  <Box>
                    <Typography variant="subtitle2" color="secondary">
                      Client: {engagement.clientName || `Client ID: ${engagement.clientId}`}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No project or client
                  </Typography>
                )}
              </TableCell>
              <TableCell>{formatDate(engagement.startDate)}</TableCell>
              <TableCell>{engagement.endDate ? formatDate(engagement.endDate) : 'N/A'}</TableCell>
              <TableCell>
                <Chip
                  label={engagement.outcomeStatus}
                  color={getStatusColor(engagement.outcomeStatus) as any}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Edit engagement">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(engagement)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete engagement">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(engagement.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};