import ACTIONS_TYPES from "../../actions/actions_types"
import initialState from "../state/split_summary"


interface State {
    split_summary_by_people:{
        loading:boolean,
        error:boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data:null | any
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const split_summary_reducers = (state:State = initialState, action:any):State => {
    switch(action.type){
        case ACTIONS_TYPES.SPLIT_SUMMARY_REQUEST:
            return {
                ...state,
                split_summary_by_people:{
                    loading:true,
                    error:false,
                    data:null
                }
            }
        case ACTIONS_TYPES.SPLIT_SUMMARY_SUCCESS:
            return {
                ...state,
                split_summary_by_people:{
                    loading:false,
                    error:false,
                    data:action.payload
                }
            }
        case ACTIONS_TYPES.SPLIT_SUMMARY_FAILURE:
            return {
                ...state,
                split_summary_by_people:{
                    loading:false,
                    error:true,
                    data:null
                }
            }
        default:
            return state
    }
}

export default split_summary_reducers