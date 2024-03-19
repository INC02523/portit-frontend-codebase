import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const Introduction = () => {
  return (
    <div className="md:text-base  text-sm md:p-10 p-5  space-y-6">
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6" paragraph>
          Welcome to the Agent Setup Wizard
        </Typography>
        <Typography variant="body1" paragraph>
          This wizard will guide you through the setup of your intelligent
          agent, a powerful tool designed to streamline your business processes
          and boost productivity.
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemText
              primary="Step 1: Introduction"
              secondary="Gain an understanding of the agent setup process and its advantages."
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Step 2: Process Orchestration (PO)"
              secondary="Configure your agent for seamless integration with your legacy Process Orchestration system."
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Step 3: Integration Suite Cloud Platform Integration (IS CPI)"
              secondary="Migrate from Process Orchestration to the Integration Suite Cloud Platform Integration for enhanced data exchange capabilities."
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Step 4: Integration Suite API (IS API)"
              secondary="Extend your agent's functionality by integrating with external APIs (Application Programming Interfaces)."
            />
          </ListItem>
        </List>
        <Typography variant="body1" paragraph>
          Follow these steps using the "Next" and "Back" buttons to smoothly
          transition from your existing Process Orchestration system to the
          Integration Suite Cloud Platform Integration and leverage API
          integrations to supercharge your business operations.
        </Typography>
      </Box>
    </div>
  );
};

export default Introduction;
