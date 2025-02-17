import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerifyOTP from "./VerifyOTP";
import { toast } from "react-toastify";
import { Box, Container, Typography, Paper, TextField, Button } from "@mui/material";

const ForgotPassword = () => {
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(true);
  const [disableEmail, setdisableEmail] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      console.log("OTP sent to", values.email);
      setTimer(180);
      setCanResend(false);
      setdisableEmail(true);
      toast.info("Please check your email");
    },
  });

  return (
    <div className={`w-full`}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
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
                Forgot Password
              </Typography>
              <form className="space-y-4 w-full" onSubmit={formik.handleSubmit}>
                <div className="w-full">
                  <TextField
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    disabled = {disableEmail}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "background.paper" }}
                  />
                  {/* <label className="">Email</label> */}
                  {/* <input
                        type="email"
                        disabled={disableEmail}
                        {...formik.getFieldProps("email")}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#1e88e5] focus:border-[#1e88e5] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500">{formik.errors.email}</p>
                      )} */}
                </div>
                
                <button
                  type="submit"
                  className={`hover:bg-[#1664C0] bg-[#1976d2] text-sm uppercase text-white p-2 rounded w-full ${canResend ? "block" : "hidden"}`}
                  disabled={!canResend}
                >
                  Send OTP
                </button>
              </form>

              <div className={`${canResend ? "hidden" : "block"}`}>
                <VerifyOTP
                  setTimer={setTimer}
                  setCanResend={setCanResend}
                  timer={timer}
                />
              </div>
            </Paper>
          </Container>
        </Box>
      </Box>
    </div>
  );
};

export default ForgotPassword;
