import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Toolbar,
  IconButton,
  Box,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Group as GroupIcon,
  CorporateFare as CorporateFareIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Apartment as ApartmentIcon,
  Badge as BadgeIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Hub as HubIcon,
} from "@mui/icons-material";
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
          sx={{ zIndex: 1, }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <List>
        <ListItemButton
          component={RouterLink}
          to="/dashboard"
          selected={location.pathname === "/dashboard"}
          sx={{
            justifyContent: open ? "flex-start" : "center",
            px: open ? 2 : 0,
          }}
        >
          <ListItemIcon sx={{ minWidth: open ? 56 : "auto", mr: open ? 0 : 0 }}>
            <DashboardIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Dashboard" />}
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          to="/profile"
          selected={location.pathname === "/profile"}
          sx={{
            justifyContent: open ? "flex-start" : "center",
            px: open ? 2 : 0,
          }}
        >
          <ListItemIcon sx={{ minWidth: open ? 56 : "auto", mr: open ? 0 : 0 }}>
            <PersonIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Profile" />}
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          to="/clients"
          selected={location.pathname === "/clients"}
          sx={{
            justifyContent: open ? "flex-start" : "center",
            px: open ? 2 : 0,
          }}
        >
          <ListItemIcon sx={{ minWidth: open ? 56 : "auto", mr: open ? 0 : 0 }}>
            <BusinessIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Clients" />}
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          to="/projects"
          selected={location.pathname === "/projects"}
          sx={{
            justifyContent: open ? "flex-start" : "center",
            px: open ? 2 : 0,
          }}
        >
          <ListItemIcon sx={{ minWidth: open ? 56 : "auto", mr: open ? 0 : 0 }}>
            <WorkIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Projects" />}
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          to="/engagements"
          selected={location.pathname === "/engagements"}
          sx={{
            justifyContent: open ? "flex-start" : "center",
            px: open ? 2 : 0,
          }}
        >
          <ListItemIcon sx={{ minWidth: open ? 56 : "auto", mr: open ? 0 : 0 }}>
            <HubIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Engagements" />}
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          to="/employees"
          selected={location.pathname === "/employees"}
          sx={{
            justifyContent: open ? "flex-start" : "center",
            px: open ? 2 : 0,
          }}
        >
          <ListItemIcon sx={{ minWidth: open ? 56 : "auto", mr: open ? 0 : 0 }}>
            <GroupIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Employees" />}
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          to="/portfolio-companies"
          selected={location.pathname === "/portfolio-companies"}
          sx={{
            justifyContent: open ? "flex-start" : "center",
            px: open ? 2 : 0,
          }}
        >
          <ListItemIcon sx={{ minWidth: open ? 56 : "auto", mr: open ? 0 : 0 }}>
            <CorporateFareIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Portfolio Companies" />}
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          to="/resource-tracking"
          selected={location.pathname.startsWith("/resource-tracking")}
          sx={{
            justifyContent: open ? "flex-start" : "center",
            px: open ? 2 : 0,
          }}
        >
          <ListItemIcon sx={{ minWidth: open ? 56 : "auto", mr: open ? 0 : 0 }}>
            <AssessmentIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Resource Tracking" />}
        </ListItemButton>
        {open && (
          <ListItemButton
            onClick={() => setSettingsOpen((s) => !s)}
            aria-expanded={settingsOpen}
            aria-controls="settings-collapse"
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
            {settingsOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </ListItemButton>
        )}
        {!open && (
          <ListItemButton
            component={RouterLink}
            to="/roles"
            selected={location.pathname === "/roles"}
            sx={{ justifyContent: "center", px: 0 }}
          >
            <ListItemIcon sx={{ minWidth: "auto", mr: 0 }}>
              <SettingsIcon />
            </ListItemIcon>
          </ListItemButton>
        )}
        {open && (
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
                <ListItemIcon sx={{ ml: 2 }}>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Roles" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={RouterLink}
                to="/departments"
                selected={location.pathname === "/departments"}
              >
                <ListItemIcon sx={{ ml: 2 }}>
                  <ApartmentIcon />
                </ListItemIcon>
                <ListItemText primary="Departments" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={RouterLink}
                to="/designations"
                selected={location.pathname === "/designations"}
              >
                <ListItemIcon sx={{ ml: 2 }}>
                  <BadgeIcon />
                </ListItemIcon>
                <ListItemText primary="Designations" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={RouterLink}
                to="/skills"
                selected={location.pathname === "/skills"}
              >
                <ListItemIcon sx={{ ml: 2 }}>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText primary="Skills" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={RouterLink}
                to="/portfolio-companies"
                selected={location.pathname === "/portfolio-companies"}
              >
                <ListItemIcon sx={{ ml: 2 }}>
                  <CorporateFareIcon />
                </ListItemIcon>
                <ListItemText primary="Portfolio Companies" />
              </ListItemButton>
            </List>
          </Collapse>
        )}
      </List>
    </Drawer>
  );
};

export default SideNav;
