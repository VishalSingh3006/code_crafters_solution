import React from "react";
import { Box, Paper, Typography, Button, Stack, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/projectsHooks";
import { useEmployees } from "../../hooks/employeesHooks";
import { useClients } from "../../hooks/clientsHooks";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { items: projects, loading: projectsLoading } = useProjects();
  const { items: employees, loading: employeesLoading } = useEmployees();
  const { items: clients, loading: clientsLoading } = useClients();

  const cards = [
    {
      title: "Projects",
      count: projects?.length ?? 0,
      loading: projectsLoading,
      actionLabel: "View Projects",
      onClick: () => navigate("/projects"),
    },
    {
      title: "Employees",
      count: employees?.length ?? 0,
      loading: employeesLoading,
      actionLabel: "View Employees",
      onClick: () => navigate("/employees"),
    },
    {
      title: "Portfolio Companies",
      count: clients?.length ?? 0,
      loading: clientsLoading,
      actionLabel: "View Portfolio Companies",
      onClick: () => navigate("/clients"),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {cards.map((card) => (
            <Paper key={card.title} elevation={1} sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  {card.title}
                </Typography>
                {card.loading ? (
                  <Skeleton variant="text" width={80} height={40} />
                ) : (
                  <Typography variant="h4" fontWeight={700}>
                    {card.count}
                  </Typography>
                )}
                <Button
                  id={`view-${card.title.toLowerCase()}-btn`}
                  variant="contained"
                  onClick={card.onClick}
                  disabled={card.loading}
                >
                  {card.actionLabel}
                </Button>
              </Stack>
            </Paper>
          ))}
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Paper elevation={1} sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              Quick Actions
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                id="new-project-btn"
                variant="contained"
                onClick={() => navigate("/projects/create")}
              >
                New Project
              </Button>
              <Button
                id="new-employee-btn"
                variant="contained"
                onClick={() => navigate("/employees/create")}
              >
                New Employee
              </Button>
              <Button
                id="new-client-btn"
                variant="contained"
                onClick={() => navigate("/clients/create")}
              >
                New Portfolio Company
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Dashboard;
