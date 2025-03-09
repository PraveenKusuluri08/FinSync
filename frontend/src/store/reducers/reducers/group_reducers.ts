import initialState from "../state/group_state";
import ACTION_TYPES from "../../actions/actions_types";

interface State {
  group_create_state: {
    loading: boolean;
    error: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null | any;
  };
  get_users_for_group: {
    loading: boolean;
    error: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null | any;
  };

  get_groups: {
    loading: boolean;
    error: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null | any;
  };
  get_group_data:{
    loading: boolean;
    error: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null | any;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const group_reducers = (state: State = initialState, action: any): State => {
  switch (action.type) {
    case ACTION_TYPES.CREATE_GROUP_REQUEST:
      return {
        ...state,
        group_create_state: {
          loading: true,
          error: false,
          data: null,
        },
      };
    case ACTION_TYPES.CREATE_GROUP_SUCCESS:
      return {
        ...state,
        group_create_state: {
          loading: false,
          error: false,
          data: action.payload,
        },
      };
    case ACTION_TYPES.CREATE_GROUP_FAILURE:
      return {
        ...state,
        group_create_state: {
          loading: false,
          error: true,
          data: null,
        },
      };

    case ACTION_TYPES.GET_USERS_FOR_GROUP_REQUEST:
      return {
        ...state,
        get_users_for_group: {
          loading: true,
          error: false,
          data: null,
        },
      };
    case ACTION_TYPES.GET_USERS_FOR_GROUP_SUCCESS:
      return {
        ...state,
        get_users_for_group: {
          loading: false,
          error: false,
          data: action.payload,
        },
      };
    case ACTION_TYPES.GET_USERS_FOR_GROUP_FAILURE:
      return {
        ...state,
        get_users_for_group: {
          loading: false,
          error: true,
          data: null,
        },
      };

    case ACTION_TYPES.GET_USER_INVOLVED_GROUPS_REQUEST:
      return {
        ...state,
        get_groups: {
          loading: true,
          error: false,
          data: null,
        },
      };
    case ACTION_TYPES.GET_USER_INVOLVED_GROUPS_SUCCESS:
      return {
        ...state,
        get_groups: {
          loading: false,
          error: false,
          data: action.payload,
        },
      };
    case ACTION_TYPES.GET_USER_INVOLVED_GROUPS_FAILURE:
      return {
        ...state,
        get_groups: {
          loading: false,
          error: true,
          data: null,
        },
      };

      case ACTION_TYPES.GET_GROUP_DATA_REQUEST:
        return {
         ...state,
          get_group_data: {
            loading: true,
            error: false,
            data: null,
          },
        };

      case ACTION_TYPES.GET_GROUP_DATA_SUCCESS:
        return {
         ...state,
          get_group_data: {
            loading: false,
            error: false,
            data: action.payload,
          },
        };
        
      case ACTION_TYPES.GET_GROUP_DATA_FAILURE:
        return {
         ...state,
          get_group_data: {
            loading: false,
            error: true,
            data: null,
          },
        };

    default:
      return state;
  }
};

export default group_reducers;
