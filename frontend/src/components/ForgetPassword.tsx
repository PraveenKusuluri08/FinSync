import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerifyOTP from "./VerifyOTP";

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
    },
  });

  return (
    <div className={`flex justify-end`}>
      <section
        id="login"
        className="bg-green-50 dark:bg-green-900"
        style={{ backgroundImage: "url('/expense-img.jpg')" }}
      >
        <div className="flex flex-col items-center justify-center w-[500px] px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-neutral-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form className="space-y-4" onSubmit={formik.handleSubmit}>
                <h2 className="text-xl font-bold">Forgot Password</h2>
                <label>Email</label>
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="border p-2 w-full"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500">{formik.errors.email}</p>
                )}
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
