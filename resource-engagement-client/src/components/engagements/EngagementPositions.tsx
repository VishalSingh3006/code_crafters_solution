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
import { EngagementPosition } from "../../types";
import { useEngagementPositions, useEngagementPositionActions } from "../../hooks/useEngagementPositions";
import { EngagementPositionForm } from "./EngagementPositionForm";

interface EngagementPositionsProps {
  engagementId: number;
  onPositionChange?: () => void;
}

export const EngagementPositions: React.FC<EngagementPositionsProps> = ({
  engagementId,
  onPositionChange,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState<EngagementPosition | null>(null);

  const { positions, loading, error, fetchByEngagementId } = useEngagementPositions();
  const { remove, pending: actionPending, error: actionError } = useEngagementPositionActions();

  useEffect(() => {
    if (engagementId) {
      fetchByEngagementId(engagementId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId]); // Only depend on engagementId

  const handleAdd = () => {
    setEditingPosition(null);
    setShowForm(true);
  };

  const handleEdit = (position: EngagementPosition) => {
    setEditingPosition(position);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      try {
        await remove(id);
        await fetchByEngagementId(engagementId);
        onPositionChange?.();
      } catch (error) {
        console.error("Failed to delete position:", error);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPosition(null);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingPosition(null);
    await fetchByEngagementId(engagementId);
    onPositionChange?.();
  };

  const getProficiencyLabel = (level: string | undefined): string => {
    return level || "Not specified";
  };

  const getProficiencyColor = (level: string | undefined): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    if (!level) return "default";
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes("expert")) return "success";
    if (lowerLevel.includes("advanced")) return "primary";
    if (lowerLevel.includes("intermediate")) return "info";
    if (lowerLevel.includes("basic")) return "warning";
    if (lowerLevel.includes("beginner")) return "error";
    return "default";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Required Positions"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={actionPending}
          >
            Add Position
          </Button>
        }
      />
      <CardContent>
        {(error || actionError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || actionError}
          </Alert>
        )}

        {positions.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            No positions defined for this engagement
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Position Title</TableCell>
                  <TableCell>Required Skill</TableCell>
                  <TableCell align="center">Proficiency Level</TableCell>
                  <TableCell align="center" width={120}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={position.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {position.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {position.requiredSkill || (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          Not specified
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getProficiencyLabel(position.requiredProficiency)}
                        color={getProficiencyColor(position.requiredProficiency)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(position)}
                        disabled={actionPending}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(position.id)}
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

        <EngagementPositionForm
          open={showForm}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          engagementId={engagementId}
          position={editingPosition}
        />
      </CardContent>
    </Card>
  );
};