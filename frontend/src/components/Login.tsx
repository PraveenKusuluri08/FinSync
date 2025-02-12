import React from "react";
import { useDispatch,useSelector} from "react-redux";
import { _on_login } from "../store/middleware/middleware";
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {toast} from "react-toastify"


const Login = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userLoginInfo = useSelector((state:any)=>state.data)
  console.log("userInfo", userLoginInfo)
  // Use ThunkDispatch type to allow dispatching thunk actions
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  const localStorage = window.localStorage.getItem("token")
  if(localStorage){
    navigate("/home")
  }

  //formik for form-validation
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
      console.log("Form Submitted", values);
      await dispatch(_on_login(values));
      // if(userLoginInfo.token!=undefined || userLoginInfo.token!=null){
        window.localStorage.setItem("token",userLoginInfo.token)
        toast.success("Logged in successfully");
        window.location.reload()
        navigate("/home")
      // }
    },
  });

  // const [user, setUser] = useState<{ email: string; password: string }>({
  //   email: "",
  //   password: "",
  // });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setUser({
  //     ...user,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   dispatch(_on_login(user));
  //   if(userLoginInfo.token===undefined || userLoginInfo.token===null){
  //     sessionStorage.setItem("token",userLoginInfo.token)
  //   }
  //   navigate("/home")
  // };

  return (
    <div className={`flex justify-end`}>
    <section
      id="login"
      className="bg-green-50 dark:bg-green-900"
      style={{ backgroundImage: "url('/expense-img.jpg')" }}
    >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-neutral-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="text-center text-xl md:text-2xl lg:text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  
                  id="email"
                  {...formik.getFieldProps("email")}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#1e88e5] focus:border-[#1e88e5] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="example@example.com"
                />
                {formik.touched.email && formik.errors.email ? (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  // {...formik.getFieldProps("password")}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#1e88e5] focus:border-[#1e88e5] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {formik.touched.password && formik.errors.password ? (
                  <p className="text-red-500 text-sm">{formik.errors.password}</p>
                ) : null}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-[#1e88e5] dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-[#1e88e5] hover:underline dark:text-primary-500">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#1e88e5] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#1e88e5] dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? {" "}
                <Link to="/signup" className="font-medium text-[#1e88e5] hover:underline dark:text-primary-500">
                  Sign up
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

export default Login;
