import initialState from "../state/calendar_state"
import ACTIONS_TYPES from "../../actions/actions_types"

interface State {
    calendar_data:{
        loading:boolean,
        error:boolean,
        data:null | any
    }
}

const calendarReducer = (state: State = initialState, action: { type: string, payload: any }) => {
    switch(action.type){
        case ACTIONS_TYPES.GET_CALENDAR_DATA_REQUEST:
            return {
                ...state,
                calendar_data:{
                    loading:true,
                    error:false,
                    data:null
                }
            }
        case ACTIONS_TYPES.GET_CALENDAR_DATA_SUCCESS:
            return {
                ...state,
                calendar_data:{
                    loading:false,
                    error:false,
                    data: action.payload.data
                }
            }
        case ACTIONS_TYPES.GET_CALENDAR_DATA_FAILURE:
            return {
                ...state,
                calendar_data:{
                    loading:false,
                    error:true,
                    data: null
                }
            }
        default:
            return state
    }
}

export default calendarReducer
