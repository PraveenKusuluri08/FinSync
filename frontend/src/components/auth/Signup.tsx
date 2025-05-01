import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { toast } from "react-toastify";
import { on_signup } from "../../store/middleware/middleware";

import { Link as MUILink, Container, Paper, Grid } from "@mui/material";
import LoadingButtion from "../common/LoadingButton";

const Signup = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
        .required("Phone number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      const userData = {
        ...values,
        profile_image: "",
      };
      const response = await dispatch(on_signup(userData));
      if (response?.token) {
        window.localStorage.setItem("token", response.token)
        window.localStorage.setItem("user_info", JSON.stringify(response.user));
        toast.success(response?.message ?? "Signed up successfully");
        navigate("/dashboard")
      } else {
        toast.error(response?.response?.data?.message ?? "!Oops Something Went Wrong...");
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        height: "90vh",
        backgroundImage: "url(/expense-img.jpg)",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container component="main" maxWidth="sm">
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
              Create an Account
            </Typography>
            <form onSubmit={formik.handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    {...formik.getFieldProps("firstName")}
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: "background.paper",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "black",
                        },
                        "&:hover fieldset": {
                          borderColor: "black",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    {...formik.getFieldProps("lastName")}
                    error={
                      formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: "background.paper",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "black",
                        },
                        "&:hover fieldset": {
                          borderColor: "black",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: "background.paper",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "black",
                        },
                        "&:hover fieldset": {
                          borderColor: "black", 
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "black", 
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...formik.getFieldProps("phone")}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: "background.paper",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "black", 
                        },
                        "&:hover fieldset": {
                          borderColor: "black",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    {...formik.getFieldProps("password")}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: "background.paper",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "black",
                        },
                        "&:hover fieldset": {
                          borderColor: "black",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm Password"
                    {...formik.getFieldProps("confirmPassword")}
                    error={
                      formik.touched.confirmPassword &&
                      Boolean(formik.errors.confirmPassword)
                    }
                    helperText={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    }
                    variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "background.paper" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label="Remember me"
                  />
                </Grid>
                <Grid item xs={12}>
                  <LoadingButtion isSubmitting={formik.isSubmitting} label="Sign up" />
                  {/* <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ padding: "10px" }}
                    disabled={loading}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </Button> */}
                </Grid>
              </Grid>
              <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                <MUILink href="/login" variant="body2">
                  Already have an account? Sign in
                </MUILink>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>

      {/* Right Side - Image & Text (Now Moved to Right) */}
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
    </Box>
  );
};

export default Signup;
