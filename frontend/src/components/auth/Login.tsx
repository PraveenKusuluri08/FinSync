import { useDispatch } from "react-redux";
import { _on_login } from "../../store/middleware/middleware";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadingButtion from "../common/LoadingButton";

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

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      const response = await dispatch(_on_login(values));
      console.log("Response: ", response);
      if (response?.token) {
        window.localStorage.setItem("token", response.token);
        window.localStorage.setItem("user_info", JSON.stringify(response.user));
        toast.success("Logged in successfully");
        navigate("/dashboard");
      } else {
        toast.error(
          response?.response?.data?.message ?? "!Oops Something Went Wrong..."
        );
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        height: "91svh",
        backgroundImage: "url(/expense-img.jpg)",
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
        <div className="flex justify-center items-center w-[80%] pb-4">
          <img
            src="expenses_img.png" 
            alt="Finance Synchronization"
            className="object-contain h-[400px] w-[400px] rounded-lg"
          />
        </div>
        
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
          <Paper
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              border: 1,
              borderRadius: 10,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              color="primary"
            >
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
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "background.paper" }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <MUILink
                    href="/forgot-password"
                    variant="body2"
                    color="primary"
                  >
                    Forgot password?
                  </MUILink>
                </Grid>
                <Grid item xs={12}>
                  {/* <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ padding: "10px" }}
                  >
                    Sign In
                  </Button> */}
                  <LoadingButtion isSubmitting={formik.isSubmitting} label="Sign In" />
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
