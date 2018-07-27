import {
	GET_APPLYLIST,
	GET_APPLYMETADATA,
	GET_APPLYLISTSTAT,
	GET_SALELIST,
	GET_CREATELIST,
	GET_AVILABLEINVOICELIST,
	GET_COMMITREVIEWCHECK,
	POST_CHANGESTATE,
	GET_INVOICESTAT,
	POST_ASSOCIATENEWINVOICE,
	GET_INVOICERELATION,
	GET_PART_MONEY
} from '../constants/ActionTypes'


//发票申请单列表统计数据
export const applyListStat = (state = {}, action) => {
	switch (action.type) {
		case GET_APPLYLISTSTAT:
			return {
				...state,
				...action.payload.data
			}
		default:
			return state
	}
}
//获取销售列表
export const saleList = (state = [], action) => {
	switch (action.type) {
		case GET_SALELIST:
			return action.payload.data
		default:
			return state
	}
}

//获取创建人列表
export const createList = (state = [], action) => {
	switch (action.type) {
		case GET_CREATELIST:
			return action.payload.data
		default:
			return state
	}
}

//发票申请单元数据
export const applyMetaData = (state = {}, action) => {
	switch (action.type) {
		case GET_APPLYMETADATA:
			return {
				...state,
				...action.payload.data
			}
		default:
			return state
	}
}

//发票申请单列表
export const applyList = (state = {}, action) => {
	switch (action.type) {
		case GET_APPLYLIST:
			return {
				...state,
				...action.payload.data
			}
		default:
			return state
	}
}
//发票列表
export const availableInvoiceList = (state = [], action) => {
	switch (action.type) {
		case GET_AVILABLEINVOICELIST:
			return action.payload.data
		default:
			return state
	}
}
//提交审核
export const commitReviewCheck = (state = {}, action) => {
	switch (action.type) {
		case GET_COMMITREVIEWCHECK:
			return action.payload.data
		default:
			return state
	}
}
//申请单状态
export const changeState = (state = {}, action) => {
	switch (action.type) {
		case POST_CHANGESTATE:
			return action.payload.data
		default:
			return state
	}
}
//已开发票统计
export const invoiceStat = (state = {}, action) => {
	switch (action.type) {
		case GET_INVOICESTAT:
			return action.payload.data
		default:
			return state
	}
}

//创建发票申请单和发票关联关系(新开发票)
export const postAssociateNewInvoice = (state = {}, action) => {
	switch (action.type) {
		case POST_ASSOCIATENEWINVOICE:
			return action.payload.data
		default:
			return state
	}
}

//查看发票申请单发票关联关系
export const getInvoiceRelation = (state = [], action) => {
	switch (action.type) {
		case GET_INVOICERELATION:
			return action.payload.data
		default:
			return state
	}
}

//部分回款
export const partMoney = (state = [], action) => {
	switch (action.type) {
		case GET_PART_MONEY:
			return action.payload.data
		default:
			return state
	}
}



