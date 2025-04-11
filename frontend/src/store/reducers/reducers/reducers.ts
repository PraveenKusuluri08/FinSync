import { UserSignup } from "../../../types/user";
import ACTIONS_TYPES from "../../actions/actions_types";
import initialState from "../state/user_state";

export interface State {
  data: {
    loading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: null | any;
    token: string | null;
    data?: UserSignup | null;
  };

  user_profile_data:{
    loading:boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error:any | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile_data:any | null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducers = (state: State = initialState, action: any): State => {
  
  switch (action.type) {
    case ACTIONS_TYPES.LOGIN_REQUEST:
      return {
        ...state,
        data: {
          loading: true,
          error: null,
          token: null,
        },
      };
    case ACTIONS_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        data: {
          loading: false,
          error: null,
          token: action.payload || null,
        },
      };
    case ACTIONS_TYPES.REGISTER_REQUEST:
      return {
        ...state,
        data: {
          loading: true,
          error: null,
          data: null,
          token: null,
        },
      };
    case ACTIONS_TYPES.REGISTER_SUCCESS:
      return {
        ...state,
        data: {
          loading: false,
          error: null,
          data: action.payload,
          token: action.payload.token,
        },
      };

    case ACTIONS_TYPES.REGISTER_FAILURE:
      return {
        ...state,
        data: {
          loading: false,
          error: action.payload,
          data: null,
          token: null,
        },
      };

      case ACTIONS_TYPES.GET_USER_REQUEST:
        return{
          ...state,
          user_profile_data: {
            loading: true,
            error: null,
            profile_data: null,
          }
        }

        case ACTIONS_TYPES.GET_USER_SUCCESS:
          return{
            ...state,
            user_profile_data:{
              loading:false,
              error:null,
              profile_data:action.payload
            }
          }

        case ACTIONS_TYPES.GET_USER_FAILURE:
          return{
            ...state,
            user_profile_data:{
              loading:false,
              error:action.payload,
              profile_data:null
            }
          }

    default:
      return state;
  }
};

export default reducers;
