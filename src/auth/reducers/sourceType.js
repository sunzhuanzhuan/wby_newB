import { combineReducers } from 'redux'
import { GET_SOURCETYPE_LIST, GET_SOURCERULE_LIST, ADD_SOURCETYPE, UPDATE_SOURCETYPE, DELETE_SOURCETYPE, GET_SOURCETYPE_DETAIL, TRANS_SOURCETYPE_PARAM } from "../constants/ActionTypes";

const byId = (state = {}, action) => {
	switch (action.type) {
		case GET_SOURCETYPE_LIST:
			return {
				...state,
				...action.payload.sourceTypeList.reduce((obj, product) => {
					obj[product.id] = product
					return obj
				}, {})
			}
		case ADD_SOURCETYPE:
			return {
				...state,
				[action.payload.SourceTypeItem.id]: action.payload.SourceTypeItem
			}
		case UPDATE_SOURCETYPE:
			return {
				...state,
				[action.payload.data.id]: action.payload.data
			}
		case GET_SOURCETYPE_DETAIL:
			return {
				...state,
				[action.payload.data.id]: action.payload.data
			}
		default:
			return state
	}
}

const visibleIds = (state = [], action) => {
	switch (action.type) {
		case GET_SOURCETYPE_LIST:
			return action.payload.sourceTypeList.map(product => product.id)
		case ADD_SOURCETYPE:
			if (state.indexOf(action.payload.SourceTypeItem.id) !== -1) {
				return state
			}
			return [...state, action.payload.SourceTypeItem.id]
		case DELETE_SOURCETYPE:
			if (state.indexOf(action.payload.id) === -1) {
				return state;
			}
			return state.filter(id => id !== action.payload.id)
		default:
			return state
	}
}

export default combineReducers({
	byId,
	visibleIds
})

export const getSourceRule = (state, id) => state.byId[id]
export const getVisibleSourceRule = state => state.visibleIds.map(id => getSourceRule(state, id))
export const getRuleList = (state = {}, action) => {
	switch (action.type) {
		case GET_SOURCERULE_LIST:
			return [...action.payload.sourceRulesList]
		default:
			return state
	}
}
export const getSourceTypeDetail = (state = {}, action) => {
	switch (action.type) {
		case GET_SOURCETYPE_DETAIL:
			return action.payload.data
		default:
			return state
	}
}

export const getSourceTypeParam = (state = {}, action) => {
	switch (action.type) {
		case TRANS_SOURCETYPE_PARAM:
			return action.payload.params
		default:
			return state
	}
}
