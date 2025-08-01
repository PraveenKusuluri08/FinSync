import {
  legacy_createStore as createStore,
  applyMiddleware,
  combineReducers,
} from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { thunk } from "redux-thunk"; // Fix: Use named import
import userReducers from "./reducers/reducers/reducers.ts";
import expenseReducers from "./reducers/reducers/expense_reducers.ts";
import group_reducers from "./reducers/reducers/group_reducers.ts";
import calendar_reducers from "./reducers/reducers/calendar_reducers.ts";
import split_summary_reducers from "./reducers/reducers/split_summary_reducers.ts";
import receipts_reducers from "./reducers/reducers/receipt_reducers.ts"
const reducers = combineReducers<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expenses: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groups: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calendar: any; // Add your calendar reducer here if needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  split_summary:any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receipts:any
}>({
  user: userReducers,
  expenses: expenseReducers,
  groups: group_reducers,
  calendar: calendar_reducers,
  split_summary:split_summary_reducers,
  receipts: receipts_reducers
});

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
