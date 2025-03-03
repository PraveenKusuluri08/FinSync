import initialState from "../state/expense_state";
import ACTION_TYPES from "../../actions/actions_types";

interface state {
  manual_expense_create: {
    loading: boolean;
    error: boolean;
    isExpenseCreated: boolean;
  };
  expenses: {
    loading: boolean;
    error: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null | any;
  };
  expense_data_id: {
    loading: boolean;
    error: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null | any;
  };
  expense_data_update: {
    loading: boolean;
    error: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null | any;
  };
  get_group_expenses: {
    loading: boolean;
    error: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null | any;
  };
}

const expenseReducer = (
  state: state = initialState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: { type: string; payload: any }
): state => {
  switch (action.type) {
    case ACTION_TYPES.SAVE_MANUAL_USER_EXPENSE_DATA_REQUEST:
      return {
        ...state,
        manual_expense_create: {
          loading: true,
          error: false,
          isExpenseCreated: false,
        },
      };
    case ACTION_TYPES.SAVE_MANUAL_USER_EXPENSE_DATA_SUCCESS:
      return {
        ...state,
        manual_expense_create: {
          loading: false,
          error: false,
          isExpenseCreated: true,
        },
      };

    case ACTION_TYPES.SAVE_MANUAL_USER_EXPENSE_DATA_FAILURE:
      return {
        ...state,
        manual_expense_create: {
          loading: false,
          error: true,
          isExpenseCreated: false,
        },
      };

    case ACTION_TYPES.GET_USER_EXPENSE_DATA_REQUEST:
      return {
        ...state,
        expenses: {
          loading: true,
          error: false,
          data: null,
        },
      };
    case ACTION_TYPES.GET_USER_EXPENSE_DATA_SUCCESS:
      return {
        ...state,
        expenses: {
          loading: false,
          error: false,
          data: action.payload.data,
        },
      };

    case ACTION_TYPES.GET_USER_EXPENSE_DATA_FAILURE:
      return {
        ...state,
        expenses: {
          loading: false,
          error: true,
          data: null,
        },
      };

    case ACTION_TYPES.GET_USER_EXPENSE_WITH_EXPENSE_ID_REQUEST:
      return {
        ...state,
        expense_data_id: {
          loading: true,
          error: false,
          data: null,
        },
      };
    case ACTION_TYPES.GET_USER_EXPENSE_WITH_EXPENSE_ID_SUCCESS:
      return {
        ...state,
        expense_data_id: {
          loading: false,
          error: false,
          data: action.payload.data,
        },
      };

    case ACTION_TYPES.GET_USER_EXPENSE_WITH_EXPENSE_ID_FAILURE:
      return {
        ...state,
        expense_data_id: {
          loading: false,
          error: true,
          data: null,
        },
      };

    case ACTION_TYPES.UPDATE_EXPENSE_WITH_EXPENSE_ID_REQUEST:
      return {
        ...state,
        expense_data_update: {
          loading: true,
          error: false,
          data: null,
        },
      };
    case ACTION_TYPES.UPDATE_EXPENSE_WITH_EXPENSE_ID_SUCCESS:
      return {
        ...state,
        expense_data_update: {
          loading: false,
          error: false,
          data: action.payload.data,
        },
      };

    case ACTION_TYPES.UPDATE_EXPENSE_WITH_EXPENSE_ID_FAILURE:
      return {
        ...state,
        expense_data_update: {
          loading: false,
          error: true,
          data: null,
        },
      };

    case ACTION_TYPES.GET_GROUP_EXPENSES_DATA_REQUEST: {
      return {
        ...state,
        get_group_expenses: {
          loading: true,
          error: false,
          data: null,
        },
      };
    }
    case ACTION_TYPES.GET_GROUP_EXPENSES_DATA_SUCCESS: {
      return {
        ...state,
        get_group_expenses: {
          loading: false,
          error: false,
          data: action.payload,
        },
      };
    }
    case ACTION_TYPES.GET_GROUP_EXPENSES_DATA_FAILURE: {
      return {
        ...state,
        get_group_expenses: {
          loading: false,
          error: true,
          data: null,
        },
      };
    }

    //delete manual expense by id
    case ACTION_TYPES.DELETE_EXPENSE_WITH_EXPENSE_ID_REQUEST:
      return {
        ...state,
        expenses: {
          loading: true,
          error: false,
          data: null,
        },
      };
    case ACTION_TYPES.DELETE_EXPENSE_WITH_EXPENSE_ID_SUCCESS:
      return {
        ...state,
        expenses: {
          loading: false,
          error: false,
          data: action.payload.data,
        },
      };

    case ACTION_TYPES.DELETE_EXPENSE_WITH_EXPENSE_ID_FAILURE:
      return {
        ...state,
        expenses: {
          loading: false,
          error: true,
          data: null,
        },
      };


    default:
      return state;
  }
};

export default expenseReducer;
