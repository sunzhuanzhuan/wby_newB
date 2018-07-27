import { combineReducers } from 'redux'
import { GET_SOURCELIST, DELETE_SOURCE, ADD_SOURCE, UPDATE_SOURCE, GET_SOURCE_DETAIL, TRANS_SOURCE_PARAM } from '../constants/ActionTypes'

const byId = (state = {}, action) => {
	switch (action.type) {
		case GET_SOURCELIST:
			return {
				...state,
				...action.payload.sourceList.rows.reduce((obj, product) => {
					obj[product.id] = product
					return obj
				}, {})
			}
		case ADD_SOURCE:
			return {
				...state,
				[action.payload.data.id]: action.payload.data
			}
		case UPDATE_SOURCE:
			return {
				...state,
				[action.payload.data.id]: action.payload.data
			}
		case GET_SOURCE_DETAIL:
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
		case GET_SOURCELIST:
			return action.payload.sourceList.rows.map(product => product.id)
		case ADD_SOURCE:
			if (state.indexOf(action.payload.data.id) !== -1) {
				return state
			}
			return [...state, action.payload.data.id]
		case DELETE_SOURCE:
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
export const sourceDetail = (state = [], action) => {
	switch (action.type) {
		case GET_SOURCE_DETAIL:
			return action.payload.data
		default:
			return state
	}
}

export const sourceParam = (state = [], action) => {
	switch (action.type) {
		case TRANS_SOURCE_PARAM:
			return action.payload.param
		default:
			return state
	}
}

export const sourcesPagination = (state = {}, action) => {
	switch (action.type) {
		case GET_SOURCELIST:
			return action.payload.sourceList._meta
		default:
			return state
	}
}
