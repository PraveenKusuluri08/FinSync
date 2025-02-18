import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Box, Container, Typography, Paper, TextField } from "@mui/material";

const ChangePassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: (values) => {
      console.log("Password changed successfully", values);
      toast.success("Password changed successfully");
      navigate("/login"); //redirects to the login page
    },
  });

  return (
    <div className={`w-full`}>
      <Box
        sx={{
          display: "flex",
          height: "90vh",
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
                Change Password
              </Typography>
              <form className="space-y-4 w-full" onSubmit={formik.handleSubmit}>
                <div className="w-full">
                  <TextField
                    fullWidth
                    id="password"
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.newPassword &&
                      Boolean(formik.errors.newPassword)
                    }
                    helperText={
                      formik.touched.newPassword && formik.errors.newPassword
                    }
                    variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "background.paper" }}
                  />
                  {/* <label>New Password</label>
                  <input
                    type="password"
                    {...formik.getFieldProps("newPassword")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <p className="text-red-500">{formik.errors.newPassword}</p>
                  )} */}
                </div>
                <div className="w-full">
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                  {/* <label>Confirm Password</label>
                  <input
                    type="password"
                    {...formik.getFieldProps("confirmPassword")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="text-red-500">
                        {formik.errors.confirmPassword}
                      </p>
                    )} */}
                </div>
                <button
                  type="submit"
                  className="hover:bg-[#1664C0] bg-[#1976d2] text-sm uppercase text-white p-2 rounded w-full"
                >
                  Change Password
                </button>
              </form>
            </Paper>
          </Container>
        </Box>
      </Box>
    </div>
  );
};

export default ChangePassword;
