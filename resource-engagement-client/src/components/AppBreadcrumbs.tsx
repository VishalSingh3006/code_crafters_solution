import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  profile: "Profile",
  edit: "Edit",
  "2fa-setup": "Two-Factor Setup",
  roles: "Roles",
  clients: "Portfolio Companies",
  create: "Create",
  employees: "Employees",
  login: "Login",
  register: "Register",
  "resource-tracking": "Resource Tracking",
  billing: "Billing",
  rates: "Rates",
  deliveries: "Deliveries",
  staffing: "Staffing",
  recruitment: "Recruitment",
  projects: "Projects",
  departments: "Departments",
  designations: "Designations",
  skills: "Skills",
  "portfolio-companies": "Portfolio Companies",
  engagements: "Engagements",
};

const titleCase = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

type BreadcrumbItem = { to: string; label: string; icon?: React.ReactNode };

const AppBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  // Always start from Dashboard as the logical home
  const items: BreadcrumbItem[] = [
    {
      to: "/dashboard",
      label: LABELS["dashboard"],
      icon: <HomeOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />,
    },
  ];

  let accumulated = "";
  pathnames.forEach((segment) => {
    if (segment === "dashboard") return; // avoid duplicating the first item
    accumulated += `/${segment}`;
    const label = LABELS[segment] ?? titleCase(segment);
    items.push({ to: accumulated, label });
  });

  const lastIndex = items.length - 1;

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {items.map((item, idx) =>
          idx === lastIndex ? (
            <Typography key={item.to} color="primary" fontWeight="bold">
              {item.icon}
              {item.label}
            </Typography>
          ) : (
            <Link
              key={item.to}
              component={RouterLink}
              color="primary"
              underline="hover"
              to={item.to}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ),
        )}
      </Breadcrumbs>
    </Box>
  );
};

export default AppBreadcrumbs;
