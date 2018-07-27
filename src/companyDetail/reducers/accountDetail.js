// import { combineReducers } from 'redux'
import { GET_ACCOUNT_DETAIL, GET_COFFERS_LIST } from '../constants/ActionTypes'


//供公司账户详情
export const accountDetail = (state = {}, action) => {
	switch (action.type) {
		case GET_ACCOUNT_DETAIL:
			return {
				...state,
				...action.payload.data
			}
		default:
			return state
	}
}
//小金库列表
export const coffersList = (state = {}, action) => {
	switch (action.type) {
		case GET_COFFERS_LIST:
			return {
				...state,
				...action.payload.data
			}
		default:
			return state
	}
}
