import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

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
    <div className={`flex justify-end`}>
      <section
        id="change-password"
        className="bg-green-50 dark:bg-green-900"
        style={{ backgroundImage: "url('/expense-img.jpg')" }}
      >
        <div className="flex flex-col items-center justify-center md:w-[500px] px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-neutral-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-gray-900 dark:text-white">
              <form className="space-y-4" onSubmit={formik.handleSubmit}>
                <div className="text-center text-xl md:text-2xl lg:text-4xl font-bold leading-tight tracking-tight">Change Password</div>
                <div>
                  <label>New Password</label>
                  <input
                    type="password"
                    {...formik.getFieldProps("newPassword")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <p className="text-red-500">{formik.errors.newPassword}</p>
                  )}
                </div>
                <div>
                  <label>Confirm Password</label>
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
                    )}
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded w-full"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChangePassword;
