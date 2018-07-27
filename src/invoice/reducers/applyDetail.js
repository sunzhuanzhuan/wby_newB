import * as Types from '../constants/ActionTypes'


export const getApplyDetail = (state = {
	detailInfo: {},
	orderInfo: {},
	orderColumns: {},
	invoiceRelation: []
},
	action
) => {
	switch (action.type) {
		case Types.GET_APPLY_DETAIL:
			state.detailInfo = action.payload;
			break;
		case Types.GET_COMPANY_ORDERS_INFO:
			state.orderInfo[action.key] = action.payload;
			break;
		case Types.GET_INVOICE_RELATION:
			state.invoiceRelation = action.payload;
			break;
		default:
			break;
	}
	return state;
}

export default {
	getApplyDetail
}
