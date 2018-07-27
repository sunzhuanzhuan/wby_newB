import { GET_FREEZE_DETAIL } from '../constants/ActionTypes'

export const freezeDetail = (state = {}, action) => {
    switch (action.type) {
        case GET_FREEZE_DETAIL:
            return {
                ...state,
                ...action.payload.data
            }
        default:
            return state
    }
}