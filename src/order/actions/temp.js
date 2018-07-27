import api from '../../api/index'

import {
	TEMP_LIST,
	DEL_TEMP,
	EDIT_TEMP,
	TEMP_DETAIL,
	TEMP_ALL_DETAIL,
	GET_ORDER_FIELDS_SUCCESS,
	UPDATE_ORDER_FIELDS,
	UPDATE_FIELD_NAME
} from "../../constants/ActionTypes";

export const getTempList = () => (dispatch) => {
	return api.get('/toolbox/order/templateList').then((response) => {
		const { data: { tempList } } = response;

		dispatch({
			type: TEMP_LIST,
			payload: {
				tempList: tempList
			}
		})
	})
}
export const tempDel = (id) => (dispatch) => {
	return api.post('/toolbox/order/deleteTemplateInfo', { id: id }).then(() => {
		dispatch({
			type: DEL_TEMP,
			payload: {
				id
			}
		})
	})
}

export const tempAdd = (values) => () => {
	return api.post('toolbox/order/createTemplateInfo', { ...values })
}
export const tempEdit = (values, id) => (dispatch) => {
	return api.post('/toolbox/order/updateTemplateInfo', { ...values }).then((response) => {
		const newdata = response.data;
		dispatch({
			type: EDIT_TEMP,
			payload: {
				id, newdata
			}
		})
	})
}
export const getDetail = (id) => (dispatch) => {
	return api.get('/toolbox/order/templateInfo?id=' + id).then((response) => {
		const { data: { tempInfo } } = response;
		dispatch({
			type: TEMP_DETAIL,
			payload: {
				tempInfo
			}
		})
	})
}
export const getAllDetail = () => (dispatch) => {
	return api.get('/toolbox/order/initCreateTemplate').then((response) => {
		const { data: { orderFields } } = response;
		dispatch({
			type: TEMP_ALL_DETAIL,
			payload: {
				orderFields
			}
		})
	})
}

export const getOrderFields = (id) => (dispatch) => {
	return api.get('/toolbox/order/initUpdateTemplate', { params: { id } }).then((response) => {
		const { data } = response;
		dispatch({
			type: GET_ORDER_FIELDS_SUCCESS,
			payload: {
				data
			}
		})
		return data;
	})
}

export const updateOrderFields = (type, checkedFields) => (dispatch) => {
	dispatch({
		type: UPDATE_ORDER_FIELDS,
		payload: {
			type,
			checkedFields
		}
	})
}
export const updateFieldName = (id, fieldName) => (dispatch) => {
	dispatch({
		type: UPDATE_FIELD_NAME,
		payload: {
			id, fieldName
		}
	})
}
export const clearCheckedFiled = () => (dispatch) => {
	dispatch({
		type: 'clearCheckedFiled'
	})
}
export const clearInfo = () => (dispatch) => {
	dispatch({
		type: 'clearInfo'
	})
}
