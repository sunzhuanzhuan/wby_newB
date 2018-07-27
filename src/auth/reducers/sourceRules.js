import { combineReducers } from 'redux'
import { GET_SOURCERULES_LIST } from "../constants/ActionTypes";
import { DELETE_SOURCE_RULES, ADD_SOURCE_RULES, UPDATE_SOURCE_RULES, UPDATE_SOURCERULES, GET_SOURCERULES_DETAIL, TRANS_SOURCERULES_PARAM } from '../constants/ActionTypes'

const sourceRule = (state, action) => {
	switch (action.type) {
		case UPDATE_SOURCE_RULES:
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
		case GET_SOURCERULES_LIST:
			return {
				...state,
				...action.payload.sourceRulesList.reduce((obj, product) => {
					obj[product.id] = product
					return obj
				}, {})
			}
		case ADD_SOURCE_RULES:
			return {
				...state,
				[action.payload.id]: action.payload
			}
		case UPDATE_SOURCERULES:
			return {
				...state,
				[action.payload.data.id]: action.payload.data
			}
		case GET_SOURCERULES_DETAIL:
			return {
				...state,
				[action.payload.data.id]: action.payload.data
			}
		default:
			const { id } = action
			if (id) {
				return {
					...state,
					[id]: sourceRule(state[id], action)
				}
			}
			return state
	}
}

const visibleIds = (state = [], action) => {
	switch (action.type) {
		case GET_SOURCERULES_LIST:
			return action.payload.sourceRulesList.map(product => product.id)
		case ADD_SOURCE_RULES:
			if (state.indexOf(action.payload.id) !== -1) {
				return state
			}
			return [...state, action.payload.id]
		case DELETE_SOURCE_RULES:
			if (state.indexOf(action.payload.id) === -1) {
				return state;
			}
			return state.filter(id => id !== action.payload.id)
		default:
			return state
	}
}
export const sourceRulesDetail = (state = [], action) => {
	switch (action.type) {
		case GET_SOURCERULES_DETAIL:
			return action.payload.data
		default:
			return state
	}
}

export const sourceRulesParam = (state = [], action) => {
	switch (action.type) {
		case TRANS_SOURCERULES_PARAM:
			return action.payload.param
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


