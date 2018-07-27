import api from '../../api/index'
import * as Types from "../constants/ActionTypes";
import { typeMap } from '../constants/ProductConfig';

// 获取申请单详情
export const getInvioceApplyDetail = (id = 1) => (dispatch) => {
	return api.get('/finance/invoice/application/detail', {
		params: { id }
	}).then((response) => {
		const { data } = response;
		dispatch({
			type: Types.GET_INVOICE_APPLY_DETAIL,
			payload: data || {}
		})
	})
}
// 设置筛选信息
export const setTablefilters = (tabName, filters) => ({
	type: Types.COMPLETE_FILTERS_ORDER_LIST,
	tabName,
	payload: filters || {}
})
// 设置页码
export const setTablePage = (tabName, page) => ({
	type: Types.COMPLETE_PAGE_ORDER_LIST,
	tabName,
	payload: page || 1
})
// 获取订单列表(完善申请单)
export const getOrderList = (_params = { tabType: 'reservation' }) => (dispatch) => {
	// 此处处理筛选
	let params = {}
	params['product_line'] = typeMap[_params['tabType']]
	params['page'] = _params['page']
	params['page_size'] = _params['pageSize']
	params['brand_ids'] = _params['selectBrands'].toString()
	params['project_ids'] = _params['selectProject'].toString()
	params['order_ids'] = _params['inputID']
	params['id'] = _params['id']
	params['time_start'] = _params['time_start']
	params['time_end'] = _params['time_end']

	return api.get('/finance/invoice/application/orderList', {
		params,
	}).then((response) => {
		const { data } = response;
		dispatch({
			type: Types.COMPLETE_ORDER_LIST,
			tabName: _params['tabType'],
			payload: data || []
		})
	})
}
// 设置列表选中项
export const setTableSelectedRowkeys = (tabName, keys) => ({
	type: Types.TABLE_SELECTED_ROWKEYS,
	tabName,
	payload: keys || []
})
// 获取品牌列表
export const getBrandList = () => (dispatch) => {
	return api.get('/finance/invoice/application/brand').then((response) => {
		const { data } = response;
		dispatch({
			type: Types.BRAND_LIST,
			payload: data || []
		})
	})
}
// 获取项目列表
export const getProjectList = () => (dispatch) => {
	return api.get('/finance/invoice/application/project').then((response) => {
		const { data } = response;
		dispatch({
			type: Types.PROJECT_LIST,
			payload: data || []
		})
	})
}

//删除selected
export const clearSelected = () => dispatch => {
	dispatch({
		type: Types.DELECT_SELECTED_ALL
	});
}

