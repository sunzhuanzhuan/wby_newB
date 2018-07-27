import api from '../../api/index'
import * as Types from "../constants/ActionTypes";

// 获取关联申请单详情
export const getAssociateInvoiceDetail = (id = 1) => (dispatch) => {
	return api.get('/finance/invoice/application/detail', {
		params: { id }
	}).then((response) => {
		const { data } = response;
		dispatch({
			type: Types.ASSOCIATE_INVOICE_DETAIL,
			payload: data || {}
		})
	})
}
// 获取已开发票列表
export const getInvoiceList = (_params) => (dispatch) => {
	// 此处处理筛选
	let params = {}
	params['page_size'] = _params['pageSize'] || 25
	params['page'] = _params['page'] || 1
	params['special_invoice_application_ids'] = _params['inputID'] || ''
	params['invoice_application_id'] = _params['id'] || 0
	return api.get('/finance/invoice/application/invoiceList', {
		params,
	}).then((response) => {
		// console.log(response)
		const { data } = response;
		dispatch({
			type: Types.INVOICE_LIST,
			payload: data || []
		})
	})
}
// 设置筛选信息
export const setInvoiceListfilters = (filters) => ({
	type: Types.FILTERS_INVOICE_LIST,
	payload: filters || {}
})
// 设置页码
export const setInvoiceListPage = (page) => ({
	type: Types.PAGE_INVOICE_LIST,
	payload: page || 1
})

// 设置列表选中项
export const setInvoiceListSelected = (keys) => ({
	type: Types.INVOICE_LIST_SELECTED,
	payload: keys || []
})

//删除selected
export const clearInvoiceSelected = () => dispatch => {
	dispatch({
		type: Types.DELECT_INVOICE_SELECTED_ALL
	});
}
