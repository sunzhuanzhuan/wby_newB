import api from "../../api/index";
import * as Types from "../constants/ActionTypes";

//获取发票申请单详情
export const getApplyDetail = id => dispatch => {
	return api.get(`/finance/invoice/application/detail?id=${id}`).then(response => {
		const { data } = response;
		dispatch({
			type: Types.GET_APPLY_DETAIL,
			payload: data
		});

	})
}

export const getAssociatedOrders = (id, product_line) => dispatch => {
	return api.get(`/finance/invoice/application/associatedOrders?id=${id}&product_line=${product_line}`).then(response => {
		const { data } = response;
		let key = product_line === '3' ? 'reservation' : product_line === '2' ? 'activity' : product_line === '7' ? 'business' : product_line === '5' ? 'weibo' : product_line === '1' ? 'recharge' : null;
		dispatch({
			type: Types.GET_COMPANY_ORDERS_INFO,
			key: key,
			payload: data
		});
		// dispatch({
		// 	type: Types.SET_ORDER_COLUMNS,
		// 	key: key,
		// 	payload: handleOrderInfo(key, data)
		// });
	})
}
//发票申请单关联
export const getiInvoiceRelation = (id) => dispatch => {
	return api.get(`/finance/invoice/application/invoiceRelation?id=${id}`).then(response => {
		const { data } = response;
		dispatch({
			type: Types.GET_INVOICE_RELATION,
			payload: data
		})
	})
}

