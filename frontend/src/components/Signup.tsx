import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { on_signup } from "../store/middleware/middleware";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Signup = () => {
  // Use ThunkDispatch to type the dispatch function
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const navigate = useNavigate();

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
      firstName: Yup.string().required("Firstname is required"),
      lastName: Yup.string().required("Lastname is required"),
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
        .oneOf([Yup.ref("password"), ""], "Password must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      console.log("Form Submitted", values);

      const userData = {
        ...values,
        profile_image: "",
      };
      await dispatch(on_signup(userData));
      navigate("/home");

      toast.success("Signed up successfully");
      
    },
  });

  // const [user, setUser] = useState({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phone: "",
  //   password: "",
  //   confirmPassword: "",
  // });

  // const [errors,setErrors ] = useState({
  //   passwordMismatch: false,
  // });

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setUser({
  //     ...user,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // console.log(user);

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // if (user.password !== user.confirmPassword) {
  //   //   setErrors({ passwordMismatch: true });
  //   //   return;
  //   // }
  //   // setErrors({ passwordMismatch: false });
  //   // console.log("Form submitted", user);
  //   const userData = {
  //     ...user,
  //     profile_image: "",
  //   };
  //   dispatch(on_signup(userData));
  //   navigate("/home");
  // };

  return (
    <div className="flex justify-end">
      <section
        id="signup"
        className="bg-green-50 dark:bg-green-900"
        style={{ backgroundImage: "url('/expense-img.jpg')" }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen md:w-[500px] lg:pt-[5rem]">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-neutral-800 dark:border-gray-700">
            <div className="p-6">
              <div className="text-center text-xl font-bold leading-tight tracking-tight md:text-2xl lg:text-4xl text-gray-900 dark:text-white">
                Create an account
              </div>
              <form
                className="space-y-3"
                onSubmit={formik.handleSubmit}
              >
                <div className="flex gap-2 justify-between">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Firstname
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...formik.getFieldProps("firstName")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#1e88e5] focus:border-[#1e88e5] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500 text-sm">{formik.errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Lastname
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...formik.getFieldProps("lastName")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#1e88e5] focus:border-[#1e88e5] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Doe"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-500 text-sm">{formik.errors.lastName}</p>
                  )}
                </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...formik.getFieldProps("email")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#1e88e5] focus:border-[#1e88e5] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="example@example.com"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...formik.getFieldProps("password")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#1e88e5] focus:border-[#1e88e5] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm">{formik.errors.password}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...formik.getFieldProps("confirmPassword")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#1e88e5] focus:border-[#1e88e5] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone no.
                  </label>
                  <input
                    type="text"
                    id="phone"
                    {...formik.getFieldProps("phone")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#1e88e5] focus:border-[#1e88e5] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="+19805789864"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-[#1e88e5] hover:bg-primary-700 p-2 rounded"
                >
                  Sign up
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-[#1e88e5] hover:underline dark:text-primary-500"
                  >
                    Sign in
                  </Link>
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
