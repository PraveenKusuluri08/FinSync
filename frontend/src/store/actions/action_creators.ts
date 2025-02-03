import ACTIONS_TYPES from "./actions_types"


export const on_login_request = ()=>{
    return {
        type: ACTIONS_TYPES.LOGIN_REQUEST
    }
}

export const on_login_success = ()=>{
    return {
        type: ACTIONS_TYPES.LOGIN_SUCCESS
    }
}

export const on_login_failure = ()=>{
    return {
        type: ACTIONS_TYPES.LOGIN_FAILURE
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

export const on_register_success = ()=>{
    return {
        type: ACTIONS_TYPES.REGISTER_SUCCESS
    }
}

export const on_register_failure = ()=>{
    return {
        type: ACTIONS_TYPES.REGISTER_FAILURE
    }
}

