import api from '../../api/index'

import { FILEDAMEND_DETAIL, FILED_LIST, DELETE_FIELD, EDIT_FIELD, ADD_FIELD } from "../../constants/ActionTypes";

export const getFieldList = () => (dispatch) => {
	api.get('/toolbox/orderField/fieldsList').then((response) => {
		const { data: { orderFieldsList } } = response;
		dispatch({
			type: FILED_LIST,
			payload: {
				orderFieldsList
			}
		})
	})
}

export const getDetail = (id) => (dispatch) => {
	api.get('/toolbox/orderField/fieldInfo?id=' + id).then((response) => {
		const { data: { fieldInfo } } = response;
		dispatch({
			type: FILEDAMEND_DETAIL,
			payload: {
				fieldInfo
			}
		})
	})
}

export const fieldDelete = (id) => (dispatch) => {
	api.post('/toolbox/orderField/action/delete', { id: id }).then(() => {
		dispatch({
			type: DELETE_FIELD,
			payload: {
				id
			}
		})
	})
}

export const fieldAdd = (values) => (dispatch) => {
	api.post('/toolbox/orderField/action/insert', { ...values }).then((response) => {
		const adddata = response.data;
		dispatch({
			type: ADD_FIELD,
			payload: {
				adddata
			}
		})
	})
}

export const fieldEdit = (values, id) => (dispatch) => {
	api.post('/toolbox/orderField/action/update', { ...values }).then((response) => {
		const newdata = response.data;
		dispatch({
			type: EDIT_FIELD,
			payload: {
				id, newdata
			}
		})
	})
}
