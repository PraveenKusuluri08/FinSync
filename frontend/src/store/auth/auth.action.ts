import { Dispatch } from "redux";
import axios from "axios";
import { loginFailure, loginRequest, loginSuccess, registerFailure, registerRequest, registerSuccess } from "./auth.slice";
import { UserSignup } from "../../types/user";

export const _on_login =
    (user: { email: string; password: string }) => async (dispatch: Dispatch) => {
        try {
            dispatch(loginRequest());
            const response = await axios.post("http://127.0.0.1:8080/users/login", user)
            dispatch(loginSuccess(response.data.token));
            return response.data;
        } catch (error: any) {
            dispatch(loginFailure(error));
            return error;
        }
    };

export const on_signup = (user: UserSignup) => async (dispatch: Dispatch) => {
    try {
        dispatch(registerRequest());
        const response = await axios.post("http://127.0.0.1:8080/users", user)
        dispatch(registerSuccess(response.data));
        return response.data
    } catch (error: any) {
        dispatch(registerFailure(error));
        return error;
    }
};

export const on_logout = () => () => {
    const sessionStorage = window.localStorage.getItem("token")
    if (sessionStorage) {
        window.localStorage.removeItem("token")
    }
}