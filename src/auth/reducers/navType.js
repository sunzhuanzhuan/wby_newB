import { combineReducers } from 'redux'
import { GET_NAVTYPE_LIST, DELETE_NAVTYPE, ADD_NAVTYPE, UPDATE_NAVTYPE, GET_NAVTYPE_DETAIL, TRANS_NAVTYPE_PARAM } from '../constants/ActionTypes'

const byId = (state = {}, action) => {
	switch (action.type) {
		case GET_NAVTYPE_LIST:
			return {
				...state,
				...action.payload.navTypeList.rows.reduce((obj, product) => {
					obj[product.id] = product
					return obj
				}, {})
			}
		case ADD_NAVTYPE:
			return {
				...state,
				[action.payload.data.id]: action.payload.data
			}
		case UPDATE_NAVTYPE:
			return {
				...state,
				[action.payload.data.id]: action.payload.data
			}
		case GET_NAVTYPE_DETAIL:
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
		case GET_NAVTYPE_LIST:
			return action.payload.navTypeList.rows.map(product => product.id)
		case ADD_NAVTYPE:
			if (state.indexOf(action.payload.data.id) !== -1) {
				return state
			}
			return [...state, action.payload.data.id]
		case DELETE_NAVTYPE:
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
export const getNavTypeDetail = (state = {}, action) => {
	switch (action.type) {
		case GET_NAVTYPE_DETAIL:
			return action.payload.data
		default:
			return state
	}
}
export const getNavTypeParam = (state = {}, action) => {
	switch (action.type) {
		case TRANS_NAVTYPE_PARAM:
			return action.payload.params
		default:
			return state
	}
}

export const navTypePagination = (state = {}, action) => {
	switch (action.type) {
		case GET_NAVTYPE_LIST:
			return action.payload.navTypeList._meta
		default:
			return state
	}
}
