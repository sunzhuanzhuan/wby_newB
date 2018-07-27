import api from '../../api/index'
import { GET_SOURCETYPE_LIST, GET_SOURCERULE_LIST, ADD_SOURCETYPE, UPDATE_SOURCETYPE, DELETE_SOURCETYPE, GET_SOURCETYPE_DETAIL, TRANS_SOURCETYPE_PARAM } from "../constants/ActionTypes";

export const getList = () => (dispatch) => {
	return api.get('/rbac/getResourceTypeList').then((response) => {
		const sourceTypeList = response.data.rows;
		dispatch({
			type: GET_SOURCETYPE_LIST,
			payload: {
				sourceTypeList
			}
		})
		return response
	})
}

export const getSourceRuleList = () => (dispatch) => {
	api.get('/rbac/getResourceRuleList').then((response) => {
		const sourceRulesList = response.data.rows;
		dispatch({
			type: GET_SOURCERULE_LIST,
			payload: {
				sourceRulesList
			}
		})
	})
}


export const addSourceType = (values) => (dispatch) => {
	return api.post('/rbac/addResourceType', { ...values }).then((response) => {
		const SourceTypeItem = response.data;
		dispatch({
			type: ADD_SOURCETYPE,
			payload: {
				SourceTypeItem
			}
		})
		return response
	})
}

export const updateSourceType = (values) => (dispatch) => {
	return api.post('/rbac/updateResourceType', { ...values }).then((response) => {
		const { data } = response;
		dispatch({
			type: UPDATE_SOURCETYPE,
			payload: {
				data
			}
		})
		return response
	})
}

export const deleteSourceType = (id) => (dispatch) => {
	api.get('/rbac/deleteResourceType?id=' + id).then(() => {
		dispatch({
			type: DELETE_SOURCETYPE,
			payload: {
				id
			}
		})
	})
}

export const getSourceTypeDetail = (id) => (dispatch) => {
	return api.get('/rbac/getResourceType?id=' + id).then((response) => {
		const { data } = response;
		dispatch({
			type: GET_SOURCETYPE_DETAIL,
			payload: {
				data
			}
		})
	})
}
export const transSourceTypeParam = (params) => (dispatch) => {
	dispatch({
		type: TRANS_SOURCETYPE_PARAM,
		payload: {
			params
		}
	})
}
