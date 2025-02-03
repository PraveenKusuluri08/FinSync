import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

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
        navigate("/login");
      },
    });
  
    return (
      <div className="flex justify-center items-center h-screen">
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <h2 className="text-xl font-bold">Change Password</h2>
          <label>New Password</label>
          <input
            type="password"
            {...formik.getFieldProps("newPassword")}
            className="border p-2 w-full"
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <p className="text-red-500">{formik.errors.newPassword}</p>
          )}
          <label>Confirm Password</label>
          <input
            type="password"
            {...formik.getFieldProps("confirmPassword")}
            className="border p-2 w-full"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500">{formik.errors.confirmPassword}</p>
          )}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Change Password
          </button>
        </form>
      </div>
    );
  };

  export default ChangePassword;