import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {toast} from "react-toastify"

const Signup = () => {

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
        .required("Phone number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted", values);
      toast.success("Signed up successfully");
      navigate('/');
    },
  });

  return (
    <div className="flex justify-end">
      <section
        id="signup"
        className="bg-green-50 dark:bg-green-900"
        style={{ backgroundImage: "url('/expense-img.jpg')" }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen md:w-[500px] lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-neutral-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="text-center text-xl font-bold leading-tight tracking-tight md:text-2xl lg:text-4xl text-gray-900 dark:text-white">
                Create an account
              </div>
              <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    
                    id="name"
                    {...formik.getFieldProps("name")}
                    className="border p-2 w-full"
                    placeholder="John Doe"
                  />
                  {formik.touched.name && formik.errors.name && <p className="text-red-500">{formik.errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    
                    id="email"
                    {...formik.getFieldProps("email")}
                    className="border p-2 w-full"
                    placeholder="example@example.com"
                  />
                  {formik.touched.email && formik.errors.email && <p className="text-red-500">{formik.errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    
                    id="password"
                    {...formik.getFieldProps("password")}
                    className="border p-2 w-full"
                    placeholder="••••••••"
                  />
                  {formik.touched.password && formik.errors.password && <p className="text-red-500">{formik.errors.password}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Phone no.
                  </label>
                  <input
                    type="text"
                    
                    id="phone"
                    {...formik.getFieldProps("phone")}
                    className="border p-2 w-full"
                    placeholder="+19805789864"
                  />
                  {formik.touched.phone && formik.errors.phone && <p className="text-red-500">{formik.errors.phone}</p>}
                </div>
                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 p-2 rounded">
                  Sign up
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account? <Link to="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
