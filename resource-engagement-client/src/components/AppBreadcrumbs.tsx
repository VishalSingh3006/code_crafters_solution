import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  profile: "Profile",
  "2fa-setup": "Two-Factor Setup",
  roles: "Roles",
  clients: "Clients",
  employees: "Employees",
  login: "Login",
  register: "Register",
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
            <Typography key={item.to} color="text.primary">
              {item.icon}
              {item.label}
            </Typography>
          ) : (
            <Link
              key={item.to}
              component={RouterLink}
              color="inherit"
              underline="hover"
              to={item.to}
              sx={{ display: "inline-flex", alignItems: "center" }}
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
