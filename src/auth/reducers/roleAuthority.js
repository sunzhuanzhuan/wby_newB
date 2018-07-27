import { combineReducers } from 'redux'
import { GET_ROLE_AUTHORITY_LIST, TRANSFORM_PERMISSION_ID } from "../constants/ActionTypes"
// import { constants } from 'zlib';

export const roleAuthorityList = (state = [], action) => {
	switch (action.type) {
		case GET_ROLE_AUTHORITY_LIST:
			return [...action.payload.roleAuthorityList]
		default:
			return state
	}
}
export const role = (state = {}, action) => {
	switch (action.type) {
		case GET_ROLE_AUTHORITY_LIST:
			return action.payload.roleAuthorityList.role
		default:
			return state
	}

}

const byId = (state = {}, action) => {
	switch (action.type) {
		case GET_ROLE_AUTHORITY_LIST:
			if (action.payload.roleAuthorityList.assignments) {
				return {
					...state,
					...action.payload.roleAuthorityList.assignments.reduce((obj, product) => {
						obj[product.type_id] = product;
						return obj
					}, {})
				}
			} else {
				return []

			}

		default:
			const { type_id } = action;
			if (type_id) {
				return {
					...state,
					[type_id]: roleAuthorityList(state[type_id], action)
				}
			}
			return state
	}
}

const visibleIds = (state = [], action) => {
	switch (action.type) {
		case GET_ROLE_AUTHORITY_LIST:
			if (action.payload.roleAuthorityList.assignments) {
				return action.payload.roleAuthorityList.assignments.map(product => product.type_id)
			} else {
				return []

			}

		default:
			return state
	}
}


export default combineReducers({
	byId,
	visibleIds
})

export const getRoleAuthority = (state, id) => state.byId[id]
export const getVisibleRoleAuthority = state => state.visibleIds.map(id => getRoleAuthority(state, id))

//传递permissionId
export const permissionId = (state = [], action) => {
	switch (action.type) {
		case TRANSFORM_PERMISSION_ID:
			return {
				permissionId: [...action.payload.permissionId],
				type: action.payload.type
			}
		default:
			return state
	}
}
