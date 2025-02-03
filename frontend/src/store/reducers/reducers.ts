import ACTIONS_TYPES from "../actions/actions_types";
import initialState from "./user_state";

interface State {
  data: {
    loading: boolean;
    error: boolean;
    token: string | null;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducers = (state: State = initialState, action: any): State => {
  switch (action.type) {
    case ACTIONS_TYPES.LOGIN_REQUEST:
      return {
        ...state,
        data: {
          loading: true,
          error: false,
          token: null,
        },
      };
    case ACTIONS_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        data: {
          loading: false,
          error: false,
          token: action.payload || null, // Ensure token is null if payload is undefined
        },
      };
    case ACTIONS_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        data: {
          loading: false,
          error: true,
          token: null,
        },
      };
    case ACTIONS_TYPES.LOGOUT_REQUEST:
      return {
        ...state,
        data: {
          loading: true,
          error: false,
          token: null,
        },
      };
    case ACTIONS_TYPES.LOGOUT_SUCCESS:
      return {
        ...state,
        data: {
          loading: false,
          error: false,
          token: null,
        },
      };
    case ACTIONS_TYPES.LOGOUT_FAILURE:
      return {
        ...state,
        data: {
          loading: false,
          error: true,
          token: null,
        },
      };
    case ACTIONS_TYPES.REGISTER_REQUEST:
      return {
        ...state,
        data: {
          loading: true,
          error: false,
          token: null,
        },
      };
    case ACTIONS_TYPES.REGISTER_SUCCESS:
      return {
        ...state,
        data: {
          loading: false,
          error: false,
          token: null,
        },
      };
    case ACTIONS_TYPES.REGISTER_FAILURE:
      return {
        ...state,
        data: {
          loading: false,
          error: true,
          token: null,
        },
      };
    default:
      return state;
  }
};

export default reducers;
