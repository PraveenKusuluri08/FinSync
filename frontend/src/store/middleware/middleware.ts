import { Dispatch } from "redux";
import axios from "axios";

//Import the axios from the interceptors which we are created for to use authorization token
import AXIOS_INSTANCE from "../../api/axios_instance";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  on_login_request,
  on_login_success,
  on_login_failure,
  on_register_request,
  on_register_success,
  on_register_failure,
  on_logout_request,
  on_logout_success,
  on_logout_failure,
  on_request_user_data,
  on_request_user_data_success,
  on_request_user_data_failure,
  on_get_user_expense_data_failure,
  on_get_user_expense_data_request,
  on_get_user_expense_data_success,
  get_user_expense_id_data_request,
  get_user_expense_id_data_success,
  get_user_expense_id_data_failure,
  updateExpenseWithExpenseIdRequest,
  updateExpenseWithExpenseIdSuccess,
  updateExpenseWithExpenseIdFailure,
  on_save_manual_user_expense_data_request,
  on_save_manual_user_expense_data_success,
  on_save_manual_user_expense_data_failure,
  get_all_groups_request,
  get_all_groups_success,
  get_all_groups_failure,
  create_group_request,
  create_group_success,
  create_group_failure,
  get_user_involved_groups_request,
  get_user_involved_groups_success,
  get_user_involved_groups_failure,
  get_group_expenses_data_request,
get_group_expenses_data_success,
get_group_expenses_data_failure,
delete_expenses_data_with_expense_id_request,
delete_expenses_data_with_expense_id_success,
delete_expenses_data_with_expense_id_failure
} from "../actions/action_creators";
import { UserSignup } from "../../types/user";
import { toast } from "react-toastify";

export const _on_login =
  (user: { email: string; password: string }) => async (dispatch: Dispatch) => {
    try {
      dispatch(on_login_request());
      const response = await axios.post(
        "http://127.0.0.1:8080/users/login",
        user
      );
      dispatch(on_login_success(response.data.token));
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(on_login_failure(error));
      return error;
    }
  };

export const on_signup = (user: UserSignup) => async (dispatch: Dispatch) => {
  try {
    on_register_request();
    const response = await axios.post("http://127.0.0.1:8080/users", user);
    dispatch(on_register_success(response.data));
    return response.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    on_register_failure(error);
    return error;
  }
};

export const on_logout = () => (dispatch: Dispatch) => {
  dispatch(on_logout_request());
  const sessionStorage = window.sessionStorage.getItem("token");
  if (sessionStorage) {
    window.sessionStorage.removeItem("token");
    dispatch(on_logout_success());
  } else {
    dispatch(on_logout_failure());
  }
};

export const _get_user_profile_data = () => (dispatch: Dispatch) => {
  console.log("here");
  try {
    dispatch(on_request_user_data());
    console.log("projects");
    AXIOS_INSTANCE.get("/users/profile")
      .then((data) => {
        console.log("user_profile_data", data);
        dispatch(on_request_user_data_success(data.data));
      })
      .catch((error) => {
        dispatch(on_request_user_data_failure(error));
      });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    dispatch(on_request_user_data_failure(error));
  }
};
export const _get_user_profile_data1 = () => async (dispatch: Dispatch) => {
  console.log("Function Invoked: _get_user_profile_data1");

  dispatch(on_request_user_data());

  try {
    const response = await AXIOS_INSTANCE.get("/users/profile");

    console.log("user_profile_data", response.data);
    dispatch(on_request_user_data_success(response.data));
  } catch (error) {
    console.error("Axios Error:", error);
    dispatch(on_request_user_data_failure(error));
  }
};

export const _get_expenses_data = () => (dispatch: Dispatch) => {
  try {
    dispatch(on_get_user_expense_data_request());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AXIOS_INSTANCE.get("/getexpenses").then((data: any) => {
      console.log("data", data);
      dispatch(on_get_user_expense_data_success(data.data));
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    on_get_user_expense_data_failure(error);
  }
};

export const _get_expense_data_with_expense_id =
  (expense_id: string) => (dispatch: Dispatch) => {
    try {
      dispatch(get_user_expense_id_data_request());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AXIOS_INSTANCE.get(`/getexpensebyid/${expense_id}`).then((data: any) => {
        console.log("data", data);
        dispatch(get_user_expense_id_data_success(data.data));
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      get_user_expense_id_data_failure(error);
    }
  };

export const update_expense_with_id =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (expenseID: string | undefined, updatedExpenseContent: any) => (dispatch: Dispatch) => {
    try {
      dispatch(updateExpenseWithExpenseIdRequest());
      AXIOS_INSTANCE.put(
        `/updateexpensebyid/${expenseID}`,
        updatedExpenseContent
      )
        .then((response) => {
          dispatch(updateExpenseWithExpenseIdSuccess(response.data));
        })
        .catch((error) => {
          dispatch(updateExpenseWithExpenseIdFailure(error));
        });
    } catch (error) {
      console.error("Error updating expense", error);
      dispatch(updateExpenseWithExpenseIdFailure(error));
    }
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createExpenseManual =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (expenseData: any) => async (dispatch: Dispatch) => {
    try {
      dispatch(on_save_manual_user_expense_data_request());

      const formData = new FormData();
      formData.append("merchant", expenseData.merchant);
      formData.append("date", expenseData.date);
      formData.append("category", expenseData.category);
      formData.append("amount", expenseData.amount);
      formData.append("description", expenseData.description);
      if (expenseData.image) {
        formData.append("image", expenseData.image);
      }
      return AXIOS_INSTANCE.post("/expenses_manualcreate/personal", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          dispatch(on_save_manual_user_expense_data_success(response.data));
        })
        .catch((error) => {
          dispatch(on_save_manual_user_expense_data_failure(error));
        });
    } catch (error) {
      console.error("Error saving expense:", error);
      dispatch(on_save_manual_user_expense_data_failure(error));
    }
  };

export const get_users = () => (dispatch: Dispatch) => {
  try {
    dispatch(get_all_groups_request());
    AXIOS_INSTANCE.get("/get_users")
      .then((data) => {
        console.log("data", data);
        dispatch(get_all_groups_success(data.data));
      })
      .catch((error) => {
        dispatch(get_all_groups_failure(error));
      });
  } catch (error) {
    console.error("Error getting users:", error);
    dispatch(get_all_groups_failure(error));
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const create_group = (groupData: any) => (dispatch: Dispatch) => {
  try {
    dispatch(create_group_request());
    AXIOS_INSTANCE.post("/groups", groupData)
      .then((data) => {
        console.log("data", data);
        dispatch(create_group_success(data.data));
        toast.success("Group created successfully");
      })
      .catch((error) => {
        dispatch(create_group_failure(error));
      });
  } catch (error) {
    console.error("Error creating group:", error);
    dispatch(create_group_failure(error));
  }
};

export const get_all_groups = () => (dispatch: Dispatch) => {
  dispatch(get_user_involved_groups_request());
  AXIOS_INSTANCE.get("/allgroups")
    .then((data) => {
      console.log("groups_data", data);
      dispatch(get_user_involved_groups_success(data.data));
    })
    .catch((error) => {
      dispatch(get_user_involved_groups_failure(error));
    });
};

export const get_group_expenses = () => (dispatch: Dispatch) => {
  dispatch(get_group_expenses_data_request());
  AXIOS_INSTANCE.get("/getgroupexpensebyinvolveduser")
    .then((data) => {
      console.log("group_expenses_data", data);
      dispatch(get_group_expenses_data_success(data.data.data));
    })
    .catch((error) => {
      dispatch(get_group_expenses_data_failure(error));
    });
}


//to delete a manual expense by id
export const delete_manual_expense_with_id =
  (expenseID: string | undefined) => (dispatch: Dispatch) => {
    try {
      dispatch(delete_expenses_data_with_expense_id_request());
      /* Use here, the Delete API route */
      // AXIOS_INSTANCE.put(
      //   `/updateexpensebyid/${expenseID}`,
      //   updatedExpenseContent
      // )
        // .then((response) => {
        //   dispatch(delete_expenses_data_with_expense_id_success(response.data));
        // })
        // .catch((error) => {
        //   dispatch(delete_expenses_data_with_expense_id_failure(error));
        // });
    } catch (error) {
      console.error("Error updating expense", error);
      dispatch(delete_expenses_data_with_expense_id_failure(error));
    }
  };