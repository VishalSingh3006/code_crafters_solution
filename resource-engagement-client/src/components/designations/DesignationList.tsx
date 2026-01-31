import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { baseServices } from "../../services/baseService";
import DesignationForm from "./DesignationForm";

interface Designation {
  id: number;
  name: string;
  description?: string;
}

const DesignationList: React.FC = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Designation | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchDesignations = async () => {
    const res = await baseServices.get("/api/designations");
    setDesignations(res.data);
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleEdit = (designation: Designation) => {
    setEditing(designation);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await baseServices.delete(`/api/designations/${deleteId}`);
      setDeleteId(null);
      fetchDesignations();
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Designations</Typography>
      <Button variant="contained" color="primary" onClick={() => { setEditing(null); setOpenForm(true); }}>
        Add Designation
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {designations.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(d)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => setDeleteId(d.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {designations.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">No designations found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <DesignationForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={fetchDesignations}
        editing={editing}
      />
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Designation</DialogTitle>
        <DialogContent>Are you sure you want to delete this designation?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DesignationList;
