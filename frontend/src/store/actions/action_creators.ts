/* eslint-disable @typescript-eslint/no-unused-vars */
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on_save_manual_user_expense_data_failure=(error:any)=>{
    return {
        type:ACTIONS_TYPES.SAVE_MANUAL_USER_EXPENSE_DATA_FAILURE,
        error
    }
}

export const on_get_user_expense_data_request=()=>{
    return {
        type:ACTIONS_TYPES.GET_USER_EXPENSE_DATA_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on_get_user_expense_data_success=(payload:any)=>{
    console.log("payload",payload)
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


export const get_user_expense_id_data_request=()=>{
    return {
        type:ACTIONS_TYPES.GET_USER_EXPENSE_WITH_EXPENSE_ID_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_user_expense_id_data_success=(payload:any)=>{
    return {
        type: ACTIONS_TYPES.GET_USER_EXPENSE_WITH_EXPENSE_ID_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_user_expense_id_data_failure=(error:any)=>{
    return {
        type: ACTIONS_TYPES.GET_USER_EXPENSE_WITH_EXPENSE_ID_FAILURE,
        error
    }
}

export const updateExpenseWithExpenseIdRequest=()=>{
    return{
        type:ACTIONS_TYPES.UPDATE_EXPENSE_WITH_EXPENSE_ID_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateExpenseWithExpenseIdSuccess=(payload:any)=>{
    return{
        type:ACTIONS_TYPES.UPDATE_EXPENSE_WITH_EXPENSE_ID_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateExpenseWithExpenseIdFailure=(error:any)=>{
    return{
        type: ACTIONS_TYPES.UPDATE_EXPENSE_WITH_EXPENSE_ID_FAILURE,
        error
    }
}

export const create_group_request=()=>{
    return{
        type:ACTIONS_TYPES.CREATE_GROUP_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const create_group_success=(payload:any)=>{
    return{
        type:ACTIONS_TYPES.CREATE_GROUP_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const create_group_failure=(error:any)=>{
    return{
        type: ACTIONS_TYPES.CREATE_GROUP_FAILURE,
        error
    }
}

export const get_all_groups_request=()=>{
    return{
        type:ACTIONS_TYPES.GET_USERS_FOR_GROUP_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_all_groups_success=(payload:any)=>{
    return{
        type: ACTIONS_TYPES.GET_USERS_FOR_GROUP_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_all_groups_failure=(error:any)=>{
    return{
        type: ACTIONS_TYPES.GET_USERS_FOR_GROUP_FAILURE,
        error
    }
}

export const get_user_involved_groups_request=()=>{
    return{
        type:ACTIONS_TYPES.GET_USER_INVOLVED_GROUPS_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_user_involved_groups_success=(payload:any)=>{
    return{
        type: ACTIONS_TYPES.GET_USER_INVOLVED_GROUPS_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_user_involved_groups_failure=(error:any)=>{
    return{
        type: ACTIONS_TYPES.GET_USER_INVOLVED_GROUPS_FAILURE,
        error
    }
}

export const get_group_expenses_data_request=()=>{
    return{
        type: ACTIONS_TYPES.GET_GROUP_EXPENSES_DATA_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_group_expenses_data_success=(payload:any)=>{
    console.log("payload",payload)
    return{
        type: ACTIONS_TYPES.GET_GROUP_EXPENSES_DATA_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_group_expenses_data_failure=(error:any)=>{
    return{
        type: ACTIONS_TYPES.GET_GROUP_EXPENSES_DATA_FAILURE,
        error
    }
}

//delete expense with expense id - manual/group
export const delete_expenses_data_with_expense_id_request=()=>{
    return{
        type:ACTIONS_TYPES.DELETE_EXPENSE_WITH_EXPENSE_ID_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const delete_expenses_data_with_expense_id_success=(payload:any)=>{
    return{
        type:ACTIONS_TYPES.DELETE_EXPENSE_WITH_EXPENSE_ID_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const delete_expenses_data_with_expense_id_failure=(error:any)=>{
    return{
        type: ACTIONS_TYPES.DELETE_EXPENSE_WITH_EXPENSE_ID_FAILURE,
        error
    }
}

export const get_group_data_request=()=>{
    return{
        type:ACTIONS_TYPES.GET_GROUP_DATA_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_group_data_success=(payload:any)=>{
    return{
        type: ACTIONS_TYPES.GET_GROUP_DATA_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_group_data_failure=(error:any)=>{
    return{
        type: ACTIONS_TYPES.GET_GROUP_DATA_FAILURE,
        error
    }
}

export const get_calendar_data_request=()=>{
    return{
        type: ACTIONS_TYPES.GET_CALENDAR_DATA_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_calendar_data_success=(payload:any)=>{
    return{
        type: ACTIONS_TYPES.GET_CALENDAR_DATA_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_calendar_data_failure=(error:any)=>{
    return{
        type: ACTIONS_TYPES.GET_CALENDAR_DATA_FAILURE,
        error
    }
}

export const get_expense_by_group_id_request=()=>{
    return{
        type: ACTIONS_TYPES.GET_EXPENSE_BY_GROUP_ID_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_expense_by_group_id_success=(payload:any)=>{
    return{
        type: ACTIONS_TYPES.GET_EXPENSE_BY_GROUP_ID_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_expense_by_group_id_failure=(error:any)=>{
    return{
        type: ACTIONS_TYPES.GET_EXPENSE_BY_GROUP_ID_FAILURE,
        error
    }
}

export const get_groups_data_by_user_id_request=()=>{
    return{
        type: ACTIONS_TYPES.GET_GROUPS_DATA_BY_USER_ID_REQUEST
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_groups_data_by_user_id_success=(payload:any)=>{
    return{
        type: ACTIONS_TYPES.GET_GROUPS_DATA_BY_USER_ID_SUCCESS,
        payload
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get_groups_data_by_user_id_failure=(error:any)=>{
    return{
        type: ACTIONS_TYPES.GET_GROUPS_DATA_BY_USER_ID_FAILURE,
        error
    }
}