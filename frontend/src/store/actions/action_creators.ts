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

export const on_logout_success = (payload:unknown)=>{
    return {
        type: ACTIONS_TYPES.LOGOUT_SUCCESS,
        payload
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

