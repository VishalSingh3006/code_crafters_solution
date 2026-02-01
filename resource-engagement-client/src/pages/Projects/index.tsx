import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/projectsHooks";
import { useProjectActions } from "../../hooks/projectsHooks";
import type { Project } from "../../types";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Alert,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import ProjectForm from "../../components/forms/ProjectForm";
import { Add } from "@mui/icons-material";

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, error, reload } = useProjects();
  const { remove, error: actionError } = useProjectActions();
  const [editing, setEditing] = useState<Project | null>(null);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Projects
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {actionError && <Alert severity="error">{actionError}</Alert>}

        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
          <Box />
          <Button
            id="create-project-btn"
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/projects/create")}
          >
            Create Project
          </Button>
        </Box>

        {editing && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Edit Project
            </Typography>
            <ProjectForm
              mode="edit"
              project={editing}
              onCancel={() => setEditing(null)}
              onSuccess={async () => {
                setEditing(null);
                await reload();
              }}
            />
          </Box>
        )}

        <Box>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Client ID</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((p) => (
                  <TableRow
                    key={p.id}
                    hover
                    onClick={() => navigate(`/projects/${p.id}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>{p.clientId}</TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          id={`edit-project-${p.id}-btn`}
                          size="small"
                          variant="contained"
                          sx={{ fontSize: "1rem" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(p);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          id={`delete-project-${p.id}-btn`}
                          size="small"
                          variant="contained"
                          color="error"
                          sx={{ fontSize: "1rem" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(p.id);
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProjectsPage;
