import { combineReducers } from 'redux'
import { GET_NAVGROUP_LIST, ADD_NAVGROUP, DELETE_NAVGROUP } from "../constants/ActionTypes";
import { UPDATE_NAVGROUP } from "../constants/ActionTypes";

export const navGroupList = (state = [], action) => {
	switch (action.type) {
		case GET_NAVGROUP_LIST:
			return [...action.payload.navGroupList]
		default:
			return state
	}
}

const byId = (state = {}, action) => {
	switch (action.type) {
		case GET_NAVGROUP_LIST:
			return {
				...state,
				...action.payload.navGroupList.reduce((obj, product) => {
					obj[product.id] = product;
					return obj
				}, {})
			}
		case ADD_NAVGROUP:
			return {
				...state,
				[action.payload.id]: action.payload
			}
		case UPDATE_NAVGROUP:
			return {
				...state,
				[action.payload.id]: action.payload
			}
		default:
			const { id } = action;
			if (id) {
				return {
					...state,
					[id]: navGroupList(state[id], action)
				}
			}
			return state
	}
}

const visibleIds = (state = [], action) => {
	switch (action.type) {
		case GET_NAVGROUP_LIST:
			return action.payload.navGroupList.map(product => product.id)
		case ADD_NAVGROUP:
			if (state.indexOf(action.payload.id) !== -1) {
				return state
			}
			return [...state, action.payload.id]
		case DELETE_NAVGROUP:
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
	visibleIds,
})

export const getNavGroup = (state, id) => state.byId[id]
export const getVisibleNavGroup = state => state.visibleIds.map(id => getNavGroup(state, id))


