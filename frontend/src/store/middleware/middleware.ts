import { Dispatch } from "redux";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  on_login_request,
  on_login_success,
  on_login_failure,
  on_register_request,
  on_register_success,
  on_register_failure,
  on_logout_request,
  on_logout_success,
  on_logout_failure,
} from "../actions/action_creators";
import { UserSignup } from "../../types/user";

export const _on_login =
  (user: { email: string; password: string }) => (dispatch: Dispatch) => {
    try {
      dispatch(on_login_request());
      console.log("user ", user)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return axios
        .post("http://127.0.0.1:8080/users/login",  user )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((data: any) => {
          console.log(data);
          dispatch(on_login_success(data.data.token));
        })
        .catch((error) => {
          dispatch(on_login_failure(error));
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(on_login_failure(error));
    }
  };

export const on_signup = (user: UserSignup) => (dispatch: Dispatch) => {
  console.log("====================================");
  console.log(user);
  console.log("====================================");
  try {
    console.log("Here");

    on_register_request();
    console.log("Here too");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    return axios
      .post("http://127.0.0.1:8080/users", user)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        console.log("data", data);
        dispatch(on_register_success(data.data));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(on_register_failure(error));
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    on_register_failure(error);
  }
};

export const on_logout=()=>(dispatch: Dispatch)=>{
  dispatch(on_logout_request());
  const sessionStorage = window.sessionStorage.getItem("token")
  if(sessionStorage) {
    window.sessionStorage.removeItem("token")
    dispatch(on_logout_success());
  }else{
    dispatch(on_logout_failure());
  }
}