import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Toolbar,
  IconButton,
  Box,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleSideNav } from "../store/uiSlice";

const drawerWidth = 240;
const collapsedWidth = 56;

const SideNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.sideNavOpen);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: "border-box",
          top: 64,
          height: "calc(100% - 64px)",
        },
      }}
    >
      <Toolbar sx={{ justifyContent: open ? "space-between" : "flex-end" }}>
        {open && <Box sx={{ fontWeight: 600 }}>Menu</Box>}
        <IconButton
          onClick={() => dispatch(toggleSideNav())}
          size="small"
          aria-label="toggle menu"
          sx={{ zIndex: 1 }}
        >
          <span aria-hidden>☰</span>
        </IconButton>
      </Toolbar>
      {open && (
        <List>
          <ListItemButton
            component={RouterLink}
            to="/dashboard"
            selected={location.pathname === "/dashboard"}
          >
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton
            component={RouterLink}
            to="/profile"
            selected={location.pathname === "/profile"}
          >
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton
            component={RouterLink}
            to="/clients"
            selected={location.pathname === "/clients"}
          >
            <ListItemText primary="Clients" />
          </ListItemButton>
          <ListItemButton
            component={RouterLink}
            to="/projects"
            selected={location.pathname === "/projects"}
          >
            <ListItemText primary="Projects" />
          </ListItemButton>
          <ListItemButton
            component={RouterLink}
            to="/employees"
            selected={location.pathname === "/employees"}
          >
            <ListItemText primary="Employees" />
          </ListItemButton>
          <ListItemButton
            component={RouterLink}
            to="/resource-tracking"
            selected={location.pathname.startsWith("/resource-tracking")}
          >
            <ListItemText primary="Resource Tracking" />
          </ListItemButton>
          <ListItemButton
            onClick={() => setSettingsOpen((s) => !s)}
            aria-expanded={settingsOpen}
            aria-controls="settings-collapse"
          >
            <ListItemText primary="Settings" />
            <span aria-hidden>{settingsOpen ? "▾" : "▸"}</span>
          </ListItemButton>
          <Collapse
            in={settingsOpen}
            timeout="auto"
            unmountOnExit
            id="settings-collapse"
          >
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                component={RouterLink}
                to="/roles"
                selected={location.pathname === "/roles"}
              >
                <ListItemText primary="Roles" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      )}
    </Drawer>
  );
};

export default SideNav;
