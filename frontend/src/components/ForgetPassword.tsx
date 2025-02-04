import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerifyOTP from "./VerifyOTP";
import {toast} from "react-toastify";

const ForgotPassword = () => {
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(true);

  

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
      setTimer(300);
      setCanResend(false);
      toast.info("Please check your email");
    },
  });

  return (
    <div className={`flex justify-end`}>
      <section
        id="login"
        className="bg-green-50 dark:bg-green-900"
        style={{ backgroundImage: "url('/expense-img.jpg')" }}
      >
        <div className="flex flex-col items-center justify-center md:w-[500px] px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-neutral-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form className="space-y-4" onSubmit={formik.handleSubmit}>
                <h2 className="text-xl font-bold">Forgot Password</h2>
                <div>
                <label>Email</label>
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500">{formik.errors.email}</p>
                )}
                </div>
                <button
                  type="submit"
                  className={`bg-blue-500 text-white p-2 rounded w-full ${canResend?"block":"hidden"}`}
                  disabled={!canResend}
                >
                  Send OTP
                </button>
              </form>

              <div className={`${canResend?"hidden":"block"}`}>
                <VerifyOTP setTimer={setTimer} setCanResend={setCanResend} timer={timer} />
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};



export default ForgotPassword;
