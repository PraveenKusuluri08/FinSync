import initialState from "../state/receipt_state";
import ACTION_TYPES from "../../actions/actions_types";

interface State {
  receipts: {
    loading: boolean;
    error: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null | any;
  };
  get_receipt_by_id: {
    loading: boolean;
    error: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null | any;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const receipt_reducers = (state: State = initialState, action: any): State => {
  switch (action.type) {
    case ACTION_TYPES.RECEIPTS_DATA_REQUEST:
      return {
        ...state,
        receipts: {
          loading: true,
          error: false,
          data: null,
        },
      };
    case ACTION_TYPES.RECEIPTS_DATA_SUCCESS:
      return {
        ...state,
        receipts: {
          loading: false,
          error: false,
          data: action.payload,
        },
      };
    case ACTION_TYPES.RECEIPTS_DATA_FAILURE:
      return {
        ...state,
        receipts: {
          loading: false,
          error: true,
          data: null,
        },
      };

    case ACTION_TYPES.RECEIPT_BY_ID_REQUEST:
      return {
        ...state,
        get_receipt_by_id: {
          loading: true,
          error: false,
          data: null,
        },
      };
    case ACTION_TYPES.RECEIPT_BY_ID_SUCCESS:
      return {
        ...state,
        get_receipt_by_id: {
          loading: false,
          error: false,
          data: action.payload,
        },
      };
    case ACTION_TYPES.RECEIPT_BY_ID_FAILURE:
      return {
        ...state,
        get_receipt_by_id: {
          loading: false,
          error: true,
          data: null,
        },
      };
    default:
      return state;
  }
};

export default receipt_reducers;
