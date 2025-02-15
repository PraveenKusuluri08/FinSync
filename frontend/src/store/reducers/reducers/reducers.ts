import ACTIONS_TYPES from "../../actions/actions_types";
import initialState from "../state/user_state";

interface State {
  data: {
    loading: boolean;
    error: boolean;
    token: string | null;
  };
  signup: {
    loading: boolean;
    error: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any | null;
  };

  user_profile_data:{
    loading:boolean,
    error:boolean,
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
          token: action.payload || null,
        },
      };
    case ACTIONS_TYPES.REGISTER_REQUEST:
      return {
        ...state,
        signup: {
          loading: true,
          error: false,
          data: null,
        },
      };
    case ACTIONS_TYPES.REGISTER_SUCCESS:
      return {
        ...state,
        signup: {
          loading: false,
          error: false,
          data: action.payload,
        },
      };

    case ACTIONS_TYPES.REGISTER_FAILURE:
      return {
        ...state,
        signup: {
          loading: false,
          error: true,
          data: null,
        },
      };

      case ACTIONS_TYPES.GET_USER_REQUEST:
        return{
          ...state,
          user_profile_data: {
            loading: true,
            error: false,
            profile_data: null,
          }
        }

        case ACTIONS_TYPES.GET_USER_SUCCESS:
          return{
            ...state,
            user_profile_data:{
              loading:false,
              error:false,
              profile_data:action.payload
            }
          }

        case ACTIONS_TYPES.GET_USER_FAILURE:
          return{
            ...state,
            user_profile_data:{
              loading:false,
              error:true,
              profile_data:null
            }
          }

    default:
      return state;
  }
};

export default reducers;
