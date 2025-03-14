
const initialState={
    expenses:{
        loading:false,
        error:false,
        data:null
    },
    manual_expense_create:{
        loading:false,
        error:false,
        isExpenseCreated:false
    },
    group_expense_create:{
        loading:false,
        error:false,
        isExpenseCreated:false
    },
    expense_data_id:{
        loading:false,
        error:false,
        data:null
    },
    expense_data_update:{
        loading:false,
        error:false,
        data:null  
    },

    get_group_expenses:{
        loading:false,
        error:false,
        data:null
    },

    get_expenses_by_group_id:{
        loading:false,
        error:false,
        data:null
    }
}

export default initialState