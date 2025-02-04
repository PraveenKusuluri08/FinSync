import React, { useState } from "react";
import { useDispatch,useSelector} from "react-redux";
import { _on_login } from "../store/middleware/middleware";
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useNavigate } from "react-router-dom";
const Login = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const naviagate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userLoginInfo = useSelector((state:any)=>state.data)
  console.log("userInfo", userLoginInfo)
  // Use ThunkDispatch type to allow dispatching thunk actions
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  const [user, setUser] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(_on_login(user));
    if(userLoginInfo.token===undefined || userLoginInfo.token===null){
      sessionStorage.setItem("token",userLoginInfo.token)
    }
    naviagate("/home")
  };

  return (
    <div className="flex justify-end w-full">
      <section
        id="login"
        className="bg-green-50 dark:bg-green-900 min-h-screen flex items-center justify-center"
        style={{ backgroundImage: "url('/expense-img.jpg')" }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-neutral-800 dark:border-gray-700">
            <div className="p-8 space-y-6">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full h-14 px-5 py-4 text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="example@example.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-14 px-5 py-4 text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start"></div>
                  <a
                    href="#"
                    className="text-lg font-medium text-primary-600 hover:underline dark:text-blue-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-6 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                <p className="text-lg font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
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
