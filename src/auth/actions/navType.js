import api from '../../api/index'
import { GET_NAVTYPE_LIST, DELETE_NAVTYPE, ADD_NAVTYPE, UPDATE_NAVTYPE, GET_NAVTYPE_DETAIL, TRANS_NAVTYPE_PARAM } from "../constants/ActionTypes";

export const getNavTypeList = (params) => (dispatch) => {
	return api.get('/rbac/getNavigationCateList?app_id=' + params.app_id + '&page=' + params.page).then((response) => {
		dispatch({
			type: GET_NAVTYPE_LIST,
			payload: {
				navTypeList: response.data
			}
		})
		return response
	})
}

export const deleteNavType = (id) => (dispatch) => {
	api.get('/rbac/deleteNavigationCate?id=' + id).then(() => {
		dispatch({
			type: DELETE_NAVTYPE,
			payload: {
				id
			}
		})
	})
}

export const addNavType = (params) => (dispatch) => {
	return api.post('/rbac/addNavigationCate', { ...params }).then(response => {
		const { data } = response;
		dispatch({
			type: ADD_NAVTYPE,
			payload: {
				data
			}
		})
		return response
	})
}

export const updateNavType = (values) => (dispatch) => {
	return api.post('/rbac/updateNavigationCate', { ...values }).then((response) => {
		const { data } = response;
		dispatch({
			type: UPDATE_NAVTYPE,
			payload: {
				data
			}
		})
		return response
	})
}

export const getNavTypeDetail = (id) => (dispatch) => {
	return api.get('/rbac/getNavigationCate?id=' + id).then((response) => {
		const { data } = response;
		dispatch({
			type: GET_NAVTYPE_DETAIL,
			payload: {
				data
			}
		})
	})
}

export const getNavTypeParam = (params) => (dispatch) => {
	dispatch({
		type: TRANS_NAVTYPE_PARAM,
		payload: {
			params
		}
	})
}
