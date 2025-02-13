import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { on_logout } from "../store/middleware/middleware";
import { AnyAction } from "redux";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import { GiPayMoney } from "react-icons/gi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
function Navigation() {

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userinformation = useSelector((state: any) => state.data);
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    setIsLoggedIn(!!window.localStorage.getItem("token"));
  }, [userinformation]);

  const logout = () => {
    dispatch(on_logout());
    window.localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex justify-center align-middle items-center">
              <a href="/" className="flex ms-2 md:me-24">
                <div className="pr-3">
                  <img
                  className="rounded-2xl"
                    src={"/logo-dark.jpeg"}
                    alt="logo"
                    height={80}
                    width={80}
                  />
                </div>
                <div>
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                    FinSync
                  </span>
                </div>
              </a>
            </div>

            {/* Navbar Items */}
            <div className="flex items-center ms-3">
              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-800 text-white border rounded-md hover:bg-gray-700"
                >
                  Logout
                </button>
              ) : (
                <div className="flex gap-4">
                  <a
                    href="/login"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
                  >
                    Signup
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      {isLoggedIn && (
        <aside
          className={`fixed top-0 left-0 z-40 h-screen pt-20 transition-all duration-300 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
            menuCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="h-full px-3 pb-4 flex flex-col">
            <ul className="space-y-2 font-medium flex-grow">
              <li>
                <a
                  href="/dashboard"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MdSpaceDashboard size={30} />
                  {!menuCollapsed && <span className="ms-3">Dashboard</span>}
                </a>
              </li>
              <li>
                <a
                  href="/expenses"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <GiPayMoney size={30} />
                  {!menuCollapsed && <span className="ms-3">Expenses</span>}
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaUserAlt size={25} />
                  {!menuCollapsed && <span className="ms-3">Profile</span>}
                </a>
              </li>
            </ul>

            {/* Toggle Button at Bottom */}
            <div className="p-2">
              <button
                onClick={() => setMenuCollapsed(!menuCollapsed)}
                className="flex items-center justify-center w-full p-2 text-gray-900 bg-gray-200 rounded-lg dark:text-white dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {menuCollapsed ? (
                  <AiOutlineCaretRight size={35} />
                ) : (
                  <AiOutlineCaretLeft size={25} />
                )}
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

export default Navigation;
