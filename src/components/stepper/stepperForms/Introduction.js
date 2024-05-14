import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const Introduction = () => {
  return (
    <div className="md:text-base  text-sm md:p-10 p-5  space-y-6">
      <Box sx={{ marginTop: 1 }}>
        <Typography variant="h6" paragraph>
          Welcome to the Tenant Setup Wizard
        </Typography>
        <Typography variant="body1" paragraph>
        This wizard will guide you through the setup process to connect PO 7.5 and IS with POrtIT
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemText
              primary="Step 1: Introduction"
              secondary="Provides the guidelines to configure and connect PO 7.5 and IS with POrtIT."
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Step 2: Process Orchestration"
              secondary="Configure POrtIT to connect with the PO 7.5 tenant and test connectivity."
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Step 3: SAP Integration Suite"
              secondary="Configure POrtIT to connect with the IS tenant and test connectivity."
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Step 4: Integration Suite API"
              secondary="Connect with Integration Suite APIs to leverage the different capbilites provided by SAP Integration Suite."
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
