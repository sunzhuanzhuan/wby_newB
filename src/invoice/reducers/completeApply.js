import * as Types from '../constants/ActionTypes'
import { allTabType, typeConfigMap } from '../constants/ProductConfig';

export const completeApplyDetail = (state = {}, action) => {
	switch (action.type) {
		case Types.GET_INVOICE_APPLY_DETAIL:
			return { ...action.payload };
		default:
			return { ...state };
	}
}
// 初始化订单数据
function initStateData(classAry) {
	return classAry.reduce((pre, cur) => {
		pre[cur] = {
			total: 0,
			rows: [],
			filters: {
				selectBrands: [],
				selectProject: [],
				inputID: '',
				pageSize: 50
			},
			page: 1,
			hashMap: {}
		}
		return pre
	}, {})
}
// 订单列表数据 - 包含(数据,码表,筛选)
export const completeOrderList = (state = initStateData(allTabType), action) => {
	let newState = { ...state };
	let typeState = newState[action.tabName] || {}
	switch (action.type) {
		case Types.COMPLETE_ORDER_LIST:
			typeState.total = action.payload.total;
			typeState.rows = action.payload.rows;
			typeState.rows.reduce((pre, cur) => {
				pre[cur[typeConfigMap[action.tabName]['key']]] = cur
				return pre
			}, typeState.hashMap)
			return newState
		case Types.COMPLETE_FILTERS_ORDER_LIST:
			typeState.filters = { ...typeState.filters, ...action.payload };
			typeState.page = 1
			return newState
		case Types.COMPLETE_PAGE_ORDER_LIST:
			typeState.page = action.payload || 1;
			return newState
		default:
			return newState;
	}
};
export const brandAndProjectList = (
	state = {
		brands: [],
		projects: []
	},
	action
) => {
	switch (action.type) {
		case Types.BRAND_LIST:
			return { ...state, brands: action.payload };
		case Types.PROJECT_LIST:
			return { ...state, projects: action.payload };
		default:
			return { ...state };
	}
};
export const tableSelectedRowKeys = (
	state = {
		reservation: [],
		activity: [],
		business: [],
		weibo: [],
		recharge: []
	},
	action
) => {
	let newState = { ...state };
	switch (action.type) {
		case Types.TABLE_SELECTED_ROWKEYS:
			newState[action.tabName] = action.payload;
			return newState;
		case Types.DELECT_SELECTED_ALL:
			for (let key in newState) {
				newState[key] = [];
			}
			return newState;
		default:
			return newState;
	}
};

export default {
	completeApplyDetail,
	completeOrderList,
	tableSelectedRowKeys,
	brandAndProjectList
};
