import initialState from "../state/expense_state";
import ACTION_TYPES  from "../../actions/actions_types";

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
          manual_expense_create: {
            loading: true,
            error: false,
            isExpenseCreated: false,
          },
        };
        case ACTION_TYPES.GET_USER_EXPENSE_DATA_SUCCESS:
            return {
                ...state,
                manual_expense_create: {
                loading: false,
                error: false,
                isExpenseCreated: true,
                },
            };

        case ACTION_TYPES.GET_USER_EXPENSE_DATA_FAILURE:
            return {
                ...state,
                manual_expense_create: {
                loading: false,
                error: true,
                isExpenseCreated: false,
                },
            };

    default:
      return state;
  }
};

export default expenseReducer