import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { on_signup } from "../store/middleware/middleware";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  // Use ThunkDispatch to type the dispatch function
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const navigate = useNavigate()
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // const [errors,setErrors ] = useState({
  //   passwordMismatch: false,
  // });


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  console.log(user);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (user.password !== user.confirmPassword) {
    //   setErrors({ passwordMismatch: true });
    //   return;
    // }
    // setErrors({ passwordMismatch: false });
    // console.log("Form submitted", user);
    const userData = {
      ...user,
      profile_image: "",
    };
    dispatch(on_signup(userData));
    navigate("/home")
  };

  return (
    <div className="flex pt-10 justify-start overflow-auto">
      <section
        id="signup"
        className="bg-green-50 dark:bg-green-900"
        style={{ backgroundImage: "url('/expense-img.jpg')" }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-neutral-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign up to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div className="flex gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button type="submit" className="">Signup</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
