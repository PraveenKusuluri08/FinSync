
const ACTIONS_TYPES = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',

    LOGOUT_REQUEST: 'LOGOUT_REQUEST',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    LOGOUT_FAILURE: 'LOGOUT_FAILURE',

    REGISTER_REQUEST: 'REGISTER_REQUEST',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',

    GET_USER_REQUEST: 'GET_USER_REQUEST',
    GET_USER_SUCCESS: 'GET_USER_SUCCESS',
    GET_USER_FAILURE: 'GET_USER_FAILURE',

    SAVE_MANUAL_USER_EXPENSE_DATA_REQUEST: 'SAVE_MANUAL_USER_EXPENSE_DATA_REQUEST',
    SAVE_MANUAL_USER_EXPENSE_DATA_SUCCESS: 'SAVE_MANUAL_USER_EXPENSE_DATA_SUCCESS',
    SAVE_MANUAL_USER_EXPENSE_DATA_FAILURE: 'SAVE_MANUAL_USER_EXPENSE_DATA_FAILURE',

    GET_USER_EXPENSE_DATA_REQUEST: 'GET_USER_EXPENSE_DATA_REQUEST',
    GET_USER_EXPENSE_DATA_SUCCESS: 'GET_USER_EXPENSE_DATA_SUCCESS',
    GET_USER_EXPENSE_DATA_FAILURE: 'GET_USER_EXPENSE_DATA_FAILURE',
    
    GET_USER_EXPENSE_WITH_EXPENSE_ID_REQUEST: 'GET_USER_EXPENSE_WITH_EXPENSE_ID_REQUEST',
    GET_USER_EXPENSE_WITH_EXPENSE_ID_SUCCESS: 'GET_USER_EXPENSE_WITH_EXPENSE_ID_SUCCESS',
    GET_USER_EXPENSE_WITH_EXPENSE_ID_FAILURE: 'GET_USER_EXPENSE_WITH_EXPENSE_ID_FAILURE',

    UPDATE_EXPENSE_WITH_EXPENSE_ID_REQUEST: "UPDATE_EXPENSE_WITH_EXPENSE_ID_REQUEST",
    UPDATE_EXPENSE_WITH_EXPENSE_ID_SUCCESS: "UPDATE_EXPENSE_WITH_EXPENSE_ID_SUCCESS",
    UPDATE_EXPENSE_WITH_EXPENSE_ID_FAILURE: "UPDATE_EXPENSE_WITH_EXPENSE_ID_FAILURE",

    CREATE_GROUP_REQUEST:"CREATE_GROUP_REQUEST",
    CREATE_GROUP_SUCCESS:"CREATE_GROUP_SUCCESS",
    CREATE_GROUP_FAILURE:"CREATE_GROUP_FAILURE",

    GET_USERS_FOR_GROUP_REQUEST:"GET_USERS_FOR_GROUP_REQUEST",
    GET_USERS_FOR_GROUP_SUCCESS:"GET_USERS_FOR_GROUP_SUCCESS",
    GET_USERS_FOR_GROUP_FAILURE:"GET_USERS_FOR_GROUP_FAILURE",

    GET_USER_INVOLVED_GROUPS_REQUEST:"GET_USER_INVOLVED_GROUPS_REQUEST",
    GET_USER_INVOLVED_GROUPS_SUCCESS:"GET_USER_INVOLVED_GROUPS_SUCCESS",
    GET_USER_INVOLVED_GROUPS_FAILURE:"GET_USER_INVOLVED_GROUPS_FAILURE",

    GET_GROUP_EXPENSES_DATA_REQUEST:"GET_GROUP_EXPENSES_DATA_REQUEST",
    GET_GROUP_EXPENSES_DATA_SUCCESS:"GET_GROUP_EXPENSES_DATA_SUCCESS",
    GET_GROUP_EXPENSES_DATA_FAILURE:"GET_GROUP_EXPENSES_DATA_FAILURE",

    //delete manual expense by id
    DELETE_EXPENSE_WITH_EXPENSE_ID_REQUEST: "DELETE_EXPENSE_WITH_EXPENSE_ID_REQUEST",
    DELETE_EXPENSE_WITH_EXPENSE_ID_SUCCESS: "DELETE_EXPENSE_WITH_EXPENSE_ID_SUCCESS",
    DELETE_EXPENSE_WITH_EXPENSE_ID_FAILURE: "DELETE_EXPENSE_WITH_EXPENSE_ID_FAILURE",

    GET_GROUP_DATA_REQUEST: "GET_GROUP_DATA_REQUEST",
    GET_GROUP_DATA_SUCCESS: "GET_GROUP_DATA_SUCCESS",
    GET_GROUP_DATA_FAILURE: "GET_GROUP_DATA_FAILURE",

    GET_CALENDAR_DATA_REQUEST: "GET_CALENDAR_DATA_REQUEST",
    GET_CALENDAR_DATA_SUCCESS: "GET_CALENDAR_DATA_SUCCESS",
    GET_CALENDAR_DATA_FAILURE: "GET_CALENDAR_DATA_FAILURE",

    GET_EXPENSE_BY_GROUP_ID_REQUEST:"GET_EXPENSE_BY_GROUP_ID_REQUEST",
    GET_EXPENSE_BY_GROUP_ID_SUCCESS:"GET_EXPENSE_BY_GROUP_ID_SUCCESS",
    GET_EXPENSE_BY_GROUP_ID_FAILURE:"GET_EXPENSE_BY_GROUP_ID_FAILURE",

    GET_GROUPS_DATA_BY_USER_ID_REQUEST:"GET_GROUPS_DATA_BY_USER_ID_REQUEST",
    GET_GROUPS_DATA_BY_USER_ID_SUCCESS:"GET_GROUPS_DATA_BY_USER_ID_SUCCESS",
    GET_GROUPS_DATA_BY_USER_ID_FAILURE:"GET_GROUPS_DATA_BY_USER_ID_FAILURE",

    SPLIT_SUMMARY_REQUEST : "SPLIT_SUMMARY_REQUEST",
    SPLIT_SUMMARY_SUCCESS : "SPLIT_SUMMARY_SUCCESS",
    SPLIT_SUMMARY_FAILURE : "SPLIT_SUMMARY_FAILURE",

    SPLIT_SUMMARY_BY_PERSON_EMAIL_REQUEST : "SPLIT_SUMMARY_BY_PERSON_EMAIL_REQUEST",
    SPLIT_SUMMARY_BY_PERSON_EMAIL_SUCCESS : "SPLIT_SUMMARY_BY_PERSON_EMAIL_SUCCESS",
    SPLIT_SUMMARY_BY_PERSON_EMAIL_FAILURE : "SPLIT_SUMMARY_BY_PERSON_EMAIL_FAILURE",


    SPLIT_SETTLE_UP_BY_PERSON_REQUEST : "SPLIT_SETTLE_UP_BY_PERSON_REQUEST",
    SPLIT_SETTLE_UP_BY_PERSON_SUCCESS : "SPLIT_SETTLE_UP_BY_PERSON_SUCCESS",
    SPLIT_SETTLE_UP_BY_PERSON_FAILURE : "SPLIT_SETTLE_UP_BY_PERSON_FAILURE",
    
}

export default ACTIONS_TYPES