import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Stack,
  Grid,
  Divider,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useProjectClientEngagements } from "../hooks/useProjectClientEngagements";
import { EngagementPositions } from "../components/engagements/EngagementPositions";
import { ResourceAllocations } from "../components/engagements/ResourceAllocations";

const EngagementDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const engagementId = id ? parseInt(id, 10) : 0;
  
  // Find the engagement from our hooks
  const { projectEngagements, clientEngagements, loading, error } = useProjectClientEngagements();
  
  const engagement = [...projectEngagements, ...clientEngagements].find(
    (eng) => eng.id === engagementId
  );

  const handleDataChange = () => {
    // Optionally trigger any refresh logic here
    console.log("Engagement data changed");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading engagement...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!engagement) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            Engagement not found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The requested engagement could not be found or may have been deleted.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/engagements")}
          >
            Back to Engagements
          </Button>
        </Paper>
      </Container>
    );
  }

  const getEngagementType = () => {
    return engagement.projectId ? "Project" : "Client";
  };

  const getEngagementName = () => {
    if (engagement.projectId && engagement.projectName) {
      return engagement.projectName;
    }
    if (engagement.clientId && engagement.clientName) {
      return engagement.clientName;
    }
    return `${getEngagementType()} Engagement`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/engagements")}
            sx={{ mr: 2 }}
          >
            Back to Engagements
          </Button>
          <Typography variant="h4" component="h1">
            Engagement Details
          </Typography>
        </Box>
        
        {/* Engagement Overview */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {getEngagementName()}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Engagement ID
                  </Typography>
                  <Typography variant="body1">{engagement.id}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">{getEngagementType()} Engagement</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {engagement.startDate ? new Date(engagement.startDate).toLocaleDateString() : "Not specified"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {engagement.endDate ? new Date(engagement.endDate).toLocaleDateString() : "Ongoing"}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1">{engagement.outcomeStatus}</Typography>
                </Box>
                
                {engagement.projectId && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Project ID
                    </Typography>
                    <Typography variant="body1">{engagement.projectId}</Typography>
                  </Box>
                )}
                
                {engagement.clientId && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Client ID
                    </Typography>
                    <Typography variant="body1">{engagement.clientId}</Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Positions and Allocations */}
      <Grid container spacing={4}>
        <Grid size={12}>
          <EngagementPositions
            engagementId={engagementId}
            onPositionChange={handleDataChange}
          />
        </Grid>
        
        <Grid size={12}>
          <ResourceAllocations
            engagementId={engagementId}
            onAllocationChange={handleDataChange}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default EngagementDetailPage;