import api from "../../api/index";
import * as Types from "../constans/ActionTypes";
//获取合同列表
export const getContractsList = (obj) => dispath => {
	return api.get("/contracts/list", { params: obj }).then(response => {
		const { data } = response;
		dispath({ type: Types.GET_CONTRACTS_LIST, payload: data });
	});
};
//设置显示的合同列表
// export const setContractsList = (ary) => dispath => {
// 	dispath({ type: Types.SET_CONTRACTS_LIST, payload: ary });
// };
//删除合同
export const delContract = (contract_id, hide) => () => {
	return api.get("/contracts/remove_contract", { params: contract_id }).catch(() => {
		hide();
	});
};
//添加合同页面展示的订单列表
export const getContractsOrderList = (obj) => dispath => {
	return api.get(`/contracts/info`, { params: obj }).then(response => {
		const { data } = response;
		dispath({ type: Types.GET_CONTRACTS_ORDER_LIST, payload: data });
	});
};
//设置合同页的订单列表
export const setContractsOrderList = (ary) => dispath => {
	dispath({ type: Types.SET_CONTRACTS_ORDER_LIST, payload: ary });
};
//删除合同中的订单
export const delContractsOrder = (contract_order_id, hide) => () => {
	return api.get(`/contracts/remove_contract`, { params: contract_order_id }).catch(() => {
		hide();
	});
};
//添加订单页面展示的订单列表
export const getOrderAdd = (obj) => dispath => {
	return api.get("/contracts/search_for_add", { params: obj }).then(response => {
		const { data } = response;
		dispath({ type: Types.GET_ORDER_LIST, payload: data });
	});
};
//设置选中项到redux
export const getSelectedRows = (ary) => dispath => {
	dispath({ type: Types.GET_SELECTED_ROWS, payload: ary });
};
//订单编辑
export const postContractsEdit = (obj) => () => {
	return api.post("/contracts/edit", obj);
};
//订单创建
export const postContractsAdd = (obj, hide) => () => {
	return api.post("/contracts/add", obj).catch(err => {
		hide();
		return err;
	});
};
//快速提现申请单列表
export const gettApplyList = (obj) => dispath => {
	return api.get("/flash/apply-list", { params: obj }).then(response => {
		const { data } = response;
		dispath({ type: Types.GET_APPLY_LIST, payload: data, status: data.order_status });
	});
};
//申请单详情页
export const getWithdrawApplyDetail = (id) => dispath => {
	return api.get(`/flash/apply-detail`, { params: id }).then(response => {
		const { data } = response;
		dispath({ type: Types.GET_WITHDRAW_APPLY_DETAIL, payload: data });
	});
};
//审核通过
export const setSuccess = (obj, hide) => () => {
	return api.get(`/flash/set-success`, { params: obj }).catch(() => {
		hide();
	})
};
//驳回
export const setFail = (obj, hide) => () => {
	return api.get(`/flash/set-fail`, { params: obj }).catch(() => {
		hide();
	})
}
//提交
export const setPay = (obj, hide) => () => {
	return api.get('/flash/set-pay', { params: obj }).catch(() => {
		hide();
	});
}
//计算金额
export const calculateCost = (obj) => dispath => {
	if (!obj) {
		dispath({ type: Types.GET_CALCULATE_COST, payload: {} });
		return;
	}
	return api.get('/flash/calculate_cost', { params: obj }).then(response => {
		const { data } = response;
		dispath({ type: Types.GET_CALCULATE_COST, payload: data });
	});
}
//权限管理
export const getAuthorizations = () => dispath => {
	return api.get("/rbac/getAuthorizations").then(response => {
		const { data } = response;
		dispath({ type: Types.GET_AUTHORIZATIONS, payload: data });
	});
}
