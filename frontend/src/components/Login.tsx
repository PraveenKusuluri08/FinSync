import React from "react";
import { useDispatch } from "react-redux";
import { _on_login } from "../store/middleware/middleware";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

// MUI Components
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Link as MUILink,
  Container,
  Paper,
  Grid,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  const token = window.localStorage.getItem("token");
  if (token) {
    navigate("/home");
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      console.log("Form Submitted", values);
      await dispatch(_on_login(values));
      toast.success("Logged in successfully");
      navigate("/");
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
         backgroundImage:"url(/expense-img.jpg)"
      }}
    >
      {/* Left Side - Image & Text */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
          backgroundColor: "#ded9d9",

        }}
      >
        <img
          src="https://source.unsplash.com/random/400x400?healthcare"
          alt="Finance Synchronization"
          style={{ width: "80%", borderRadius: "10px", marginBottom: "20px" }}
        />
        <Typography variant="h5" color="primary" align="center">
          Welcome to Our Financial application
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center">
          Manage your expenses with ease.
        </Typography>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        
          
        }}
      >
        <Container component="main" maxWidth="xs">
          <Paper sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center", width: "100%",   border:1,
          borderRadius:10, }}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
              Sign in to your account
            </Typography>
            <form onSubmit={formik.handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "background.paper" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "background.paper" }}
                  />
                </Grid>
                <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                  <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                  <MUILink href="/forgot-password" variant="body2" color="primary">
                    Forgot password?
                  </MUILink>
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth type="submit" variant="contained" color="primary" sx={{ padding: "10px" }}>
                    Sign In
                  </Button>
                </Grid>
              </Grid>
              <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    Don’t have an account?{" "}
                    <MUILink href="/signup" variant="body2" color="primary">
                      Sign up
                    </MUILink>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
