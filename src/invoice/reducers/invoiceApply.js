import {
	GET_DATA_COMPANY, GET_META, POST_FILE, INVOICE_COUNT, MODIFIED_FORM, GET_TOKEN
} from '../constants/ActionTypes'

import * as Types from '../constants/ActionTypes'
//公司详情
export const companyInfo = (state = {}, action) => {
	switch (action.type) {
		case GET_DATA_COMPANY:
			return {
				...state,
				...action.payload.data
			}
		default:
			return state
	}
}
//获取发票单元申请
export const getMeta = (state = {}, action) => {
	switch (action.type) {
		case GET_META:
			return {
				...state,
				...action.payload.data
			}
		default:
			return state
	}
}
//获取文件上传的信息
export const getFileInfo = (state = {}, action) => {
	switch (action.type) {
		case POST_FILE:
			return {
				...state,
				...action.payload.data
			}
		default:
			return state
	}
}
//获取统计
export const getCountInfo = (state = {}, action) => {
	switch (action.type) {
		case INVOICE_COUNT:
			return {
				...state,
				...action.payload.data
			}
		default:
			return state
	}
}
//修改表单元素
export const modifiedForm = (state = {}, action) => {
	switch (action.type) {
		case MODIFIED_FORM:
			return {
				...state,
				...action.payload.data
			}
		default:
			return state
	}
}

export const getToken = (state = {}, action) => {
	switch (action.type) {
		case GET_TOKEN:
			return {
				...state,
				...action.payload.data
			}
		default:
			return state
	}
}

export const getInvoiceTitle = (state = {
	invoiceTitleRelation: [],
	invoiceTitleContent: {}
}, action) => {
	switch (action.type) {
		case Types.GET_INVOICE_TITLE_RELATION:
			state.invoiceTitleRelation = action.payload;
			break;
		case Types.GET_INVOICE_TITLE_CONTENT:
			state.invoiceTitleContent = action.payload;
			break;
		default:
			break;
	}
	return state;
}
