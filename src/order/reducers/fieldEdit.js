import { FILED_LIST, FILEDAMEND_DETAIL, DELETE_FIELD, EDIT_FIELD, ADD_FIELD } from '../../constants/ActionTypes'

export const filedList = (state = [], action) => {
	switch (action.type) {
		case FILED_LIST:
			return [...action.payload.orderFieldsList || []]
		case DELETE_FIELD:
			return [...state.filter((item) => { return item.id !== action.payload.id })]
		case EDIT_FIELD:
			return [...state.map((item) => {
				return item.id === action.payload.id ? action.payload.newdata : item
			})]
		case ADD_FIELD:
			return [action.payload.adddata, ...state]
		default:
			return state
	}
}

export const filedAmendDetail = (state = [], action) => {
	switch (action.type) {
		case FILEDAMEND_DETAIL:
			return action.payload.fieldInfo
		default:
			return state
	}
}
