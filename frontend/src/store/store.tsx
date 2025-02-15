import { legacy_createStore as createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { thunk } from "redux-thunk"; // Fix: Use named import
import userReducers from "./reducers/reducers/reducers.ts";
import expenseReducers from "./reducers/reducers/expense_reducers.ts"

const reducers = combineReducers<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user:any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expenses: any
}>({
  user: userReducers,
  expenses:expenseReducers
})

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
