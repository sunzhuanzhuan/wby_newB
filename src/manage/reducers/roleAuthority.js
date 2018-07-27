import { combineReducers } from 'redux'
import { GET_JOB_AUTHORITY_LIST } from "../constants/ActionTypes"
// import { constants } from 'zlib';

export const jobAuthorityList1 = (state = [], action) => {
	switch (action.type) {
		case GET_JOB_AUTHORITY_LIST:
			return [...action.payload.roleAuthorityList1]
		default:
			return state
	}
}
export const role = (state = {}, action) => {
	switch (action.type) {
		case GET_JOB_AUTHORITY_LIST:
			return action.payload.roleAuthorityList1.role
		default:
			return state
	}

}

const byId = (state = {}, action) => {
	switch (action.type) {
		case GET_JOB_AUTHORITY_LIST:
			if (action.payload.roleAuthorityList1.assignments) {
				return {
					...state,
					...action.payload.roleAuthorityList1.assignments.reduce((obj, product) => {
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
					[type_id]: jobAuthorityList1(state[type_id], action)
				}
			}
			return state
	}
}

const visibleIds = (state = [], action) => {
	switch (action.type) {
		case GET_JOB_AUTHORITY_LIST:
			if (action.payload.roleAuthorityList1.assignments) {
				return action.payload.roleAuthorityList1.assignments.map(product => product.type_id)
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

