import * as Types from '../constants/ActionTypes'

export const associateInvoiceDetail = (state = {}, action) => {
	switch (action.type) {
		case Types.ASSOCIATE_INVOICE_DETAIL:
			return { ...action.payload };
		default:
			return { ...state };
	}
}
export const invoiceList = (state = {
	rows: [],
	total: 0,
	filters: {
		inputID: '',
		pageSize: 50
	},
	page: 1,
	hashMap: {}
}, action) => {
	let newState = { ...state };
	switch (action.type) {
		case Types.INVOICE_LIST:
			newState.total = action.payload.total;
			newState.rows = action.payload.rows.map(item => item['invoice_id']);
			action.payload.rows.reduce((pre, cur) => {
				pre[cur['invoice_id']] = cur
				return pre
			}, newState.hashMap)
			return newState
		case Types.FILTERS_INVOICE_LIST:
			newState.filters = { ...newState.filters, ...action.payload };
			newState.page = 1
			return newState
		case Types.PAGE_INVOICE_LIST:
			newState.page = action.payload || 1;
			return newState
		default:
			return newState;
	}
};
export const invoiceListSelected = (state = [], action) => {
	let newState = [...state];
	switch (action.type) {
		case Types.INVOICE_LIST_SELECTED:
			newState = action.payload;
			return newState
		case Types.DELECT_INVOICE_SELECTED_ALL:
			newState = [];
			return newState;
		default:
			return newState;
	}
};
export default {
	associateInvoiceDetail,
	invoiceList,
	invoiceListSelected
};
