import { combineReducers } from 'redux'
import { GET_NAV_LIST, DELETE_NAV, ADD_NAV, UPDATE_NAV, GET_NAV_DETAIL, TRANS_NAV_PARAM } from "../constants/ActionTypes";

const byId = (state = {}, action) => {
	switch (action.type) {
		case GET_NAV_LIST:
			return {
				...state,
				...action.payload.navList.rows.reduce((obj, product) => {
					obj[product.id] = product
					return obj
				}, {})
			}
		case ADD_NAV:
			return {
				...state,
				[action.payload.data.id]: action.payload.data
			}
		case UPDATE_NAV:
			return {
				...state,
				[action.payload.data.id]: action.payload.data
			}
		case GET_NAV_DETAIL:
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
		case GET_NAV_LIST:
			return action.payload.navList.rows.map(product => product.id)
		case ADD_NAV:
			if (state.indexOf(action.payload.data.id) !== -1) {
				return state
			}
			return [...state, action.payload.data.id]
		case DELETE_NAV:
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
export const getNavDetail = (state = {}, action) => {
	switch (action.type) {
		case GET_NAV_DETAIL:
			return action.payload.data
		default:
			return state
	}
}
export const getNavParam = (state = {}, action) => {
	switch (action.type) {
		case TRANS_NAV_PARAM:
			return action.payload.params
		default:
			return state
	}
}
export const navPagination = (state = {}, action) => {
	switch (action.type) {
		case GET_NAV_LIST:
			return action.payload.navList._meta
		default:
			return state
	}
}

