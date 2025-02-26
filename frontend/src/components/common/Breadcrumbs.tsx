import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Typography, Link } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <MUIBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {/* Home Breadcrumb */}
      <Link
        color="inherit"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        Home
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography color="text.primary" key={to}>
            {decodeURIComponent(value)}
          </Typography>
        ) : (
          <Link
            key={to}
            color="inherit"
            onClick={() => navigate(to)}
            style={{ cursor: "pointer" }}
          >
            {decodeURIComponent(value)}
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
