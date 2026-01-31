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
  IconButton,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { skillsService, type Skill, type CreateSkillRequest, type UpdateSkillRequest } from "../services/skillsService";

interface SkillDialogProps {
  open: boolean;
  skill?: Skill;
  onClose: () => void;
  onSave: (skill: CreateSkillRequest | UpdateSkillRequest) => void;
}

const SkillDialog: React.FC<SkillDialogProps> = ({ open, skill, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (skill) {
      setName(skill.name);
    } else {
      setName("");
    }
    setError("");
  }, [skill, open]);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Skill name is required");
      return;
    }
    onSave({ name: name.trim() });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{skill ? "Edit Skill" : "Create New Skill"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Skill Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
            helperText={error}
            fullWidth
            autoFocus
            placeholder="e.g., React, Python, Project Management"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button id="cancel-skill-dialog-btn" onClick={onClose}>Cancel</Button>
        <Button id="save-skill-btn" onClick={handleSave} variant="contained">
          {skill ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const SkillsManagement: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await skillsService.getAll();
      setSkills(data);
    } catch (error) {
      console.error("Failed to load skills:", error);
      showSnackbar("Failed to load skills", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateSkill = () => {
    setEditingSkill(undefined);
    setDialogOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setDialogOpen(true);
  };

  const handleSaveSkill = async (skillData: CreateSkillRequest | UpdateSkillRequest) => {
    try {
      if (editingSkill) {
        await skillsService.update(editingSkill.id, skillData);
        showSnackbar("Skill updated successfully", "success");
      } else {
        await skillsService.create(skillData);
        showSnackbar("Skill created successfully", "success");
      }
      await loadSkills();
    } catch (error) {
      console.error("Failed to save skill:", error);
      showSnackbar(editingSkill ? "Failed to update skill" : "Failed to create skill", "error");
    }
  };

  const handleDeleteSkill = async (skill: Skill) => {
    if (!window.confirm(`Are you sure you want to delete "${skill.name}"?`)) {
      return;
    }

    try {
      await skillsService.delete(skill.id);
      showSnackbar("Skill deleted successfully", "success");
      await loadSkills();
    } catch (error) {
      console.error("Failed to delete skill:", error);
      showSnackbar("Failed to delete skill", "error");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Skills Management
        </Typography>
        <Button
          id="add-skill-btn"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateSkill}
        >
          Add Skill
        </Button>
      </Stack>

      <Card>
        <CardContent>
          {loading ? (
            <Typography>Loading skills...</Typography>
          ) : skills.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
              No skills found. Create your first skill to get started.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Skill Name</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {skills.map((skill) => (
                    <TableRow key={skill.id} hover>
                      <TableCell>{skill.id}</TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {skill.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            id={`edit-skill-${skill.id}-btn`}
                            size="small"
                            onClick={() => handleEditSkill(skill)}
                            color="primary"
                            title="Edit skill"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            id={`delete-skill-${skill.id}-btn`}
                            size="small"
                            onClick={() => handleDeleteSkill(skill)}
                            color="error"
                            title="Delete skill"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <SkillDialog
        open={dialogOpen}
        skill={editingSkill}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveSkill}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SkillsManagement;