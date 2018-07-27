import { combineReducers } from 'redux'
import { GET_ROLE_LIST, ADD_ROLE_TYPE } from "../constants/ActionTypes";
import { DELETE_ROLE_TYPE, UPDATE_ROLE_TYPE } from '../constants/ActionTypes'

const roles = (state, action) => {
	switch (action.type) {
		case UPDATE_ROLE_TYPE:
			return {
				...state,
				...action.payload
			}
		default:
			return state
	}
}

const byId = (state = {}, action) => {
	switch (action.type) {
		case GET_ROLE_LIST:
			return {
				...state,
				...action.payload.roleList.rows.reduce((obj, product) => {
					obj[product.id] = product;
					return obj
				}, {})
			}
		case ADD_ROLE_TYPE:
			return {
				...state,
				[action.payload.id]: action.payload
			}
		case UPDATE_ROLE_TYPE:
			return {
				...state,
				[action.payload.id]: action.payload
			}
		default:
			const { id } = action;
			if (id) {
				return {
					...state,
					[id]: roles(state[id], action)
				}
			}
			return state
	}
}

const visibleIds = (state = [], action) => {
	switch (action.type) {
		case GET_ROLE_LIST:
			return action.payload.roleList.rows.map(product => product.id)
		case ADD_ROLE_TYPE:
			if (state.indexOf(action.payload.id) !== -1) {
				return state
			}
			return [...state, action.payload.id]
		case DELETE_ROLE_TYPE:
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

export const getRoles = (state, id) => state.byId[id]
export const getVisibleRoles = state => state.visibleIds.map(id => getRoles(state, id))

export const rolesPagination = (state = {}, action) => {
	switch (action.type) {
		case GET_ROLE_LIST:
			return action.payload.roleList._meta
		default:
			return state
	}
}