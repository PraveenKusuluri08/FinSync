import ACTIONS_TYPES from "./actions_types"


export const on_login_request = ()=>{
    return {
        type: ACTIONS_TYPES.LOGIN_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on_login_success = (payload: any)=>{
    console.log("payload",payload);
    return {
        type: ACTIONS_TYPES.LOGIN_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on_login_failure = (payload:any)=>{
    return {
        type: ACTIONS_TYPES.LOGIN_FAILURE,
        payload
    }
}

export const on_logout_request = ()=>{
    return {
        type: ACTIONS_TYPES.LOGOUT_REQUEST
    }
}

export const on_logout_success = ()=>{
    return {
        type: ACTIONS_TYPES.LOGOUT_SUCCESS,
    }
}

export const on_logout_failure = ()=>{
    return {
        type: ACTIONS_TYPES.LOGOUT_FAILURE
    }
}

export const on_register_request = ()=>{
    return {
        type: ACTIONS_TYPES.REGISTER_REQUEST
    }

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const on_register_success = (payload:any)=>{
    return {
        type: ACTIONS_TYPES.REGISTER_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on_register_failure = (payload:any)=>{
    return {
        type: ACTIONS_TYPES.REGISTER_FAILURE,
        payload
    }
}

export const on_request_user_data=()=>{
    return{
        type:ACTIONS_TYPES.GET_USER_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on_request_user_data_success=(payload:any)=>{
    return{
        type:ACTIONS_TYPES.GET_USER_SUCCESS,
        payload
    }
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on_request_user_data_failure=(error:any)=>{
    return{
        type:ACTIONS_TYPES.GET_USER_FAILURE,
        error
    }
}

export const on_save_manual_user_expense_data_request=()=>{
    return {
        type:ACTIONS_TYPES.SAVE_MANUAL_USER_EXPENSE_DATA_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on_save_manual_user_expense_data_success=(payload:any)=>{
    return {
        type:ACTIONS_TYPES.SAVE_MANUAL_USER_EXPENSE_DATA_SUCCESS,
        payload
    }
}

export const on_save_manual_user_expense_data_failure=()=>{
    return {
        type:ACTIONS_TYPES.SAVE_MANUAL_USER_EXPENSE_DATA_FAILURE
    }
}

export const on_get_user_expense_data_request=()=>{
    return {
        type:ACTIONS_TYPES.GET_USER_EXPENSE_DATA_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on_get_user_expense_data_success=(payload:any)=>{
    return {
        type: ACTIONS_TYPES.GET_USER_EXPENSE_DATA_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on_get_user_expense_data_failure=(error:any)=>{
    return {
        type: ACTIONS_TYPES.GET_USER_EXPENSE_DATA_FAILURE,
        error
    }
}
