import api from '../../api/index'
import {
	GET_APPLYLIST,
	GET_APPLYMETADATA,
	GET_APPLYLISTSTAT,
	GET_SALELIST,
	GET_CREATELIST,
	GET_AVILABLEINVOICELIST,
	GET_COMMITREVIEWCHECK,
	POST_ASSOCIATENEWINVOICE,
	GET_INVOICERELATION,
	GET_PART_MONEY
} from "../constants/ActionTypes"


//获取发票申请单元数据
export const getApplyMetDada = () => (dispatch) => {
	api.get('/finance/invoice/application/metadata').then((response) => {
		const { data } = response
		dispatch({
			type: GET_APPLYMETADATA,
			payload: {
				data
			}
		})
	})
}
//获取销售列表
export const getSaleList = () => (dispatch) => {
	api.get('/finance/invoice/application/saleList').then((response) => {
		const { data } = response
		dispatch({
			type: GET_SALELIST,
			payload: {
				data
			}
		})
	})
}
//获取创建人列表
export const getCreateList = () => (dispatch) => {
	api.get('/finance/invoice/application/createUserList').then((response) => {
		const { data } = response
		dispatch({
			type: GET_CREATELIST,
			payload: {
				data
			}
		})
	})
}
//获取发票申请单列表统计数据
export const getApplyListStat = (values) => (dispatch) => {
	api.get('/finance/invoice/application/listStat', { params: { ...values } }).then((response) => {
		const { data } = response
		dispatch({
			type: GET_APPLYLISTSTAT,
			payload: {
				data
			}
		})
	})
}
//查询/发票申请单列表
export const getApplyList = (value) => (dispatch) => {
	return api.get('/finance/invoice/application/list', { params: { ...value } }).then((response) => {
		const { data } = response
		dispatch({
			type: GET_APPLYLIST,
			payload: {
				data
			}
		})
		return response
	})
}
//申请单状态
export const postChangeState = (id, input_action, express_company, waybill_number, reject_reason) => () => {
	let obj = {}
	obj = { id, input_action, express_company, waybill_number, reject_reason }
	return api.post('/finance/invoice/application/changeState', {
		...obj
	}).then((response) => {
		return response;
	})
}
//发票列表接口
export const getAvailableInvoiceList = (invoice_application_id, exclude_invoice_ids) => (dispatch) => {
	let ids = JSON.stringify(exclude_invoice_ids)
	api.get('/finance/invoice/application/availableInvoiceList?invoice_application_id=' + invoice_application_id + '&exclude_invoice_ids=' + ids).then((response) => {
		const { data } = response
		dispatch({
			type: GET_AVILABLEINVOICELIST,
			payload: {
				data
			}
		})
	})
}

//创建发票申请单和发票关联关系(新开发票)
export const postAssociateNewInvoice = (values) => (dispatch) => {
	return api.post('/finance/invoice/application/associateNewInvoice', { ...values }).then((response) => {
		const { data } = response;
		dispatch({
			type: POST_ASSOCIATENEWINVOICE,
			payload: {
				data
			}
		})
		return data;
	})
}
//提交审核
export const getCommitReviewCheck = (id) => (dispatch) => {
	return api.get('/finance/invoice/application/commitCheck?id=' + id).then((response) => {
		const { data } = response;
		dispatch({
			type: GET_COMMITREVIEWCHECK,
			payload: {
				data
			}
		})
		return data;
	})
}

//获取已开发票统计
export const getInvoiceStat = (id) => (dispatch) => {
	return api.get('/finance/invoice/application/invoiceStat?company_id=' + id).then((response) => {
		const { data } = response;
		dispatch({
			type: GET_COMMITREVIEWCHECK,
			payload: {
				data
			}
		})
		return data;
	})
}

//表单提交
export const postFormVoice = (obj) => () => {
	return api.post('/finance/invoice/application/associateNewInvoice', { ...obj }).then((response) => {
		return response;
	})
}

//查看发票申请单发票关联关系
export const getInvoiceRelation = (id) => (dispatch) => {
	return api.get('/finance/invoice/application/invoiceRelation?id=' + id).then((response) => {
		const { data } = response
		dispatch({
			type: GET_INVOICERELATION,
			payload: {
				data
			}
		})
		return response
	})
}

//发票申请单的部分回款的内容
export const getPartMoney = (id) => (dispatch) => {
	return api.get('/finance/invoice/application/rechargeDetail?invoice_id=' + id).then((response) => {
		const { data } = response
		dispatch({
			type: GET_PART_MONEY,
			payload: {
				data
			}
		})
		return response
	})
}
