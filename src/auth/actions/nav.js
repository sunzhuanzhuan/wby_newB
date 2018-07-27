import api from '../../api/index'
import { GET_NAV_LIST, DELETE_NAV, ADD_NAV, UPDATE_NAV, GET_NAV_DETAIL, TRANS_NAV_PARAM } from "../constants/ActionTypes";


export const getNavList = (state) => (dispatch) => {
	api.get('/rbac/getNavigationList?app_id=' + state.app_id + "&page=" + state.page)
		.then((response) => {
			dispatch({
				type: GET_NAV_LIST,
				payload: {
					navList: response.data
				}
			})
		})
}
export const addNav = (values) => (dispatch) => {
	return api.post('/rbac/addNavigation', { values }).then((response) => {
		const data = response.data[0];
		dispatch({
			type: ADD_NAV,
			payload: {
				data
			}
		})
		return response
	})
}

export const updateNav = (values) => (dispatch) => {
	return api.post('/rbac/updateNavigation', { ...values }).then((response) => {
		const { data } = response;
		dispatch({
			type: UPDATE_NAV,
			payload: {
				data
			}
		})
		return response
	})
}

export const deleteNav = (id) => (dispatch) => {
	return api.get('/rbac/deleteNavigation?id=' + id).then((response) => {
		dispatch({
			type: DELETE_NAV,
			payload: {
				id
			}
		})
		return response
	})
}

export const getNavDetail = (id) => (dispatch) => {
	return api.get('/rbac/getNavigation?id=' + id).then((response) => {
		const { data } = response;
		dispatch({
			type: GET_NAV_DETAIL,
			payload: {
				data
			}
		})
	})
}

export const getNavParam = (params) => (dispatch) => {
	dispatch({
		type: TRANS_NAV_PARAM,
		payload: {
			params
		}
	})
}
