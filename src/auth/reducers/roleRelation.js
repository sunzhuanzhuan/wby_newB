import { combineReducers } from 'redux'
import { GET_ROLE_RELATION_LIST } from "../constants/ActionTypes"
import { UPDATE_USER_ROLE_TYPE } from "../constants/ActionTypes"

const roleRelation = (state, action) => {
	switch (action.type) {
		case UPDATE_USER_ROLE_TYPE:
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
		case GET_ROLE_RELATION_LIST:
			return {
				...state,
				...action.payload.roleRelationList.rows.reduce((obj, user, index) => {
					user.key = index;
					obj[user.id] = user;
					return obj
				}, {})
			}
		case UPDATE_USER_ROLE_TYPE:
			return {
				...state,
				[action.payload.id]: { ...state[action.payload.id], ...action.payload }
			}
		default:
			const { id } = action
			if (id) {
				return {
					...state,
					[id]: roleRelation(state[id], action)
				}
			}
			return state
	}
}

const visibleIds = (state = [], action) => {
	switch (action.type) {
		case GET_ROLE_RELATION_LIST:
			return action.payload.roleRelationList.rows.map(user => user.id)
		default:
			return state
	}
}

export default combineReducers({
	byId,
	visibleIds
})

export const getRoleRelation = (state, id) =>
	state.byId[id]
export const getVisibleRoleRelation = state =>
	state.visibleIds.map(id => getRoleRelation(state, id))

export const roleRelationPagination = (state = {}, action) => {
	switch (action.type) {
		case GET_ROLE_RELATION_LIST:
			return action.payload.roleRelationList._meta
		default:
			return state
	}
}
