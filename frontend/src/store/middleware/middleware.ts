import { Dispatch } from "redux";
import axios from "axios";

//Import the axios from the interceptors which we are created for to use authorization token
import AXIOS_INSTANCE from "../../api/axios_instance";

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
  on_request_user_data,
  on_request_user_data_success,
  on_request_user_data_failure,
  on_get_user_expense_data_failure,
  on_get_user_expense_data_request,
} from "../actions/action_creators";
import { UserSignup } from "../../types/user";

export const _on_login =
  (user: { email: string; password: string }) =>async (dispatch: Dispatch) => {
    try {
      dispatch(on_login_request());
      const response = await axios.post("http://127.0.0.1:8080/users/login", user)
      dispatch(on_login_success(response.data.token));
      return response.data;
    } catch (error: any) {
      dispatch(on_login_failure(error));
      return error;
    }
  };

export const on_signup = (user: UserSignup) => async (dispatch: Dispatch) => {
  
  try {
    on_register_request();
    const response = await axios.post("http://127.0.0.1:8080/users", user)
    dispatch(on_register_success(response.data));
    return response.data;
    
  } catch (error: any) {
    on_register_failure(error);
    return error;
  }
};

export const on_logout = () => (dispatch: Dispatch) => {
  dispatch(on_logout_request());
  const sessionStorage = window.sessionStorage.getItem("token");
  if (sessionStorage) {
    window.sessionStorage.removeItem("token");
    dispatch(on_logout_success());
  } else {
    dispatch(on_logout_failure());
  }
};

export const _get_user_profile_data = () => (dispatch: Dispatch) => {
  console.log("here");
  try {
    dispatch(on_request_user_data());
    console.log("projects");
    AXIOS_INSTANCE.get("/users/profile")
      .then((data) => {
        console.log("user_profile_data", data);
        dispatch(on_request_user_data_success(data.data));
      })
      .catch((error) => {
        dispatch(on_request_user_data_failure(error));
      });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    dispatch(on_request_user_data_failure(error));
  }
};
export const _get_user_profile_data1 = () => async (dispatch: Dispatch) => {
  console.log("Function Invoked: _get_user_profile_data1");

  dispatch(on_request_user_data());

  try {
    const response = await AXIOS_INSTANCE.get("/users/profile");

    console.log("user_profile_data", response.data);
    dispatch(on_request_user_data_success(response.data));
  } catch (error) {
    console.error("Axios Error:", error);
    dispatch(on_request_user_data_failure(error));
  }
};

export const _get_expenses_data=()=>(dispatch: Dispatch) =>{
  try{
    dispatch(on_get_user_expense_data_request())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AXIOS_INSTANCE.get("/getexpenses").then((data:any)=>{
      console.log("data",data);
      dispatch(on_request_user_data_success(data.data));
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }catch(error:any){
    on_get_user_expense_data_failure(error)
  }
}