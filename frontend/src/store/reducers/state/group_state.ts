const initialState = {
  group_create_state: {
    loading: false,
    error: false,
    data: null,
  },

  get_users_for_group:{
    loading: false,
    error: false,
    data: null,
  },
  
  get_groups:{
    loading: false,
    error: false,
    data: null,
  },
  get_group_data:{
    loading: false,
    error: false,
    data: null,
  }
};

export default initialState;