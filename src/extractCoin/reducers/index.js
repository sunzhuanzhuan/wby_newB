import * as Types from "../constans/ActionTypes";

export default (state = {
	setContractsList: [],
	contractsListData: {},
	getContractsOrderList: [],
	contractsOrderData: {},
	contractsOrderMsg: {},
	getOrderList: [],
	getOrderData: {},
	getApplyList: [],
	order_status: {},
	getApplyDetail: {},
	author: {},
	calculateCost: {},
	getApplyData: {}
}, action) => {
	state = JSON.parse(JSON.stringify(state));
	switch (action.type) {
		case Types.GET_CONTRACTS_LIST:
			state.setContractsList = action.payload.contracts.data;
			state.contractsListData = action.payload;
			break;
		case Types.GET_AUTHORIZATIONS:
			state.author = action.payload;
			break;
		// case Types.SET_CONTRACTS_LIST:
		// 	state.setContractsList = action.payload;
		// 	break;
		case Types.GET_ORDER_LIST:
			state.getOrderList = action.payload.orderlist;
			state.getOrderData = action.payload;
			break;
		case Types.GET_CONTRACTS_ORDER_LIST:
			state.getContractsOrderList = action.payload.contractOrder.data;
			state.contractsOrderData = action.payload.contractOrder;
			state.contractsOrderMsg = action.payload.contract;
			break;
		case Types.SET_CONTRACTS_ORDER_LIST:
			state.getContractsOrderList = action.payload;
			break;
		case Types.GET_SELECTED_ROWS:
			state.getContractsOrderList = [...state.getContractsOrderList, ...action.payload];
			break;
		case Types.GET_APPLY_LIST:
			state.getApplyList = action.payload.list;
			state.getApplyData = action.payload
			state.order_status = action.status;
			break;
		case Types.GET_WITHDRAW_APPLY_DETAIL:
			state.getApplyDetail = action.payload;
			break;
		case Types.GET_CALCULATE_COST:
			state.calculateCost = action.payload;
			break;
		default:
			break;
	}
	return state;

};
