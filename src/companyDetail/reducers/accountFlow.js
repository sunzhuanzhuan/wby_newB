import { GET_GOLDEN_FLOW } from '../constants/ActionTypes'

//账户流水的reducer
export const accountFlow = (state = {}, action) => {
    switch (action.type) {
        case GET_GOLDEN_FLOW:
            return {
                ...state,
                ...action.payload.goldenFlowList
            }
        default:
            return state
    }
}










