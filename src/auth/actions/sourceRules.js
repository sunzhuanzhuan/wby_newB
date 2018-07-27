import api from '../../api/index'
import Interface from '../constants/Interface'
import { ADD_SOURCE_RULES, DELETE_SOURCE_RULES, GET_SOURCERULES_LIST, UPDATE_SOURCERULES, GET_SOURCERULES_DETAIL, TRANS_SOURCERULES_PARAM } from "../constants/ActionTypes";

export const getList = () => (dispatch) => {
	api.get('/rbac/getResourceRuleList').then((response) => {
		const sourceRulesList = response.data.rows;
		dispatch({
			type: GET_SOURCERULES_LIST,
			payload: {
				sourceRulesList
			}
		})
	})
}

// export const deleteSourceRule = (id) => (dispatch) => {
// 	api.post('/rbac/deleteResourceRule', { id }).then(() => {
// 		dispatch({
// 			type: DELETE_SOURCE_RULES,
// 			payload: {
// 				id
// 			}
// 		})
// 	})
// }
export const deleteSourceRuleAction = (id) => (dispatch) => {
	return api.post(Interface.sourceRulesUrl.delete, { id }).then((response) => {
		dispatch({
			type: DELETE_SOURCE_RULES,
			payload: {
				id
			}
		})
		return response
	})
}

export const addSourceRule = (SourceRule) => ({
	type: ADD_SOURCE_RULES,
	payload: {
		...SourceRule
	}
})
export const addSourceRuleAction = (params) => (dispatch) => {
	return api.post('/rbac/addResourceRule', { ...params }).then(response => {
		const { data } = response;
		dispatch(addSourceRule(data))
		return response;
	})
}

export const updateSourceRules = (values) => (dispatch) => {
	api.post('/rbac/updateResourceRule', { ...values }).then((response) => {
		const { data } = response;
		dispatch({
			type: UPDATE_SOURCERULES,
			payload: {
				data
			}
		})
	})
}

export const getItemDetail = (id) => (dispatch) => {
	return api.get('/rbac/getResourceRule?id=' + id).then((response) => {
		const { data } = response;
		dispatch({
			type: GET_SOURCERULES_DETAIL,
			payload: {
				data
			}
		})
	})
}
export const transParam = (param) => (dispatch) => {
	dispatch({
		type: TRANS_SOURCERULES_PARAM,
		payload: {
			param
		}
	})
}
