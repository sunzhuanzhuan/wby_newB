// import { combineReducers } from 'redux'
import { DOLDEN_ACCOUNT_FLOW, DOLDEN_GET_COST, DOLDEN_REPARATION_DETAIL } from "../constants/ActionTypes";

//小金库流水查询
export const goldenFlow = (state = {}, action) => {
	switch (action.type) {
		case DOLDEN_ACCOUNT_FLOW:
			return {
				...state,
				...action.payload
			}
		default:
			return state
	}
}
//小金库额度变更
export const getCostBilling = (state = [], action) => {
	switch (action.type) {
		case DOLDEN_GET_COST:
			return {
				...state,
				...action.payload
			}
		default:
			return state
	}
}
//小金库的点击详情，赔偿详细信息
export const getReparation = (state = {}, action) => {
	switch (action.type) {
		case DOLDEN_REPARATION_DETAIL:
			return {
				...state,
				...action.payload
			}
		default:
			return state
	}
}
