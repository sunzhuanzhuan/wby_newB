import api from '../../api/index'
import {
	GET_DATA_COMPANY, GET_META, POST_PROOF, POST_FILE, INVOICE_COUNT, MODIFIED_FORM, GET_TOKEN
} from "../constants/ActionTypes"
import * as Types from '../constants/ActionTypes'
import axios from 'axios'

//获取公司相关信息
export const getCompanyInfo = (id) => (dispatch) => {
	return api.get('/finance/invoice/application/companyInfo?company_id=' + id).then((response) => {
		const data = response;
		dispatch({
			type: GET_DATA_COMPANY,
			payload: {
				data
			}
		})
		return response
	})
}

//获取单元数据信息
export const getMeta = () => (dispatch) => {
	api.get('/finance/invoice/application/metadata').then((response) => {
		const data = response.data;
		dispatch({
			type: GET_META,
			payload: {
				data
			}
		})
	})
}

//表单提交
export const postForm = (obj) => (dispatch) => {
	return api.post('/finance/invoice/application/create', { ...obj }).then((response) => {
		const data = response;
		dispatch({
			type: GET_META,
			payload: {
				data
			}
		})
		return data
	})
}

//表单提交之后判断是否需要上传证明
export const postProof = (id) => (dispatch) => {
	return api.get('/finance/invoice/application/proof?id=' + id).then((response) => {
		const data = response;
		dispatch({
			type: POST_PROOF,
			payload: {
				data
			}
		})
		return data
	})
}

//上传文件
export const uploadFile = (obj) => (dispatch) => {
	return axios({
		method: 'post',
		url: '/upload/upload',
		data: obj
	}).then((response) => {
		const data = response.data;
		dispatch({
			type: POST_FILE,
			payload: {
				data
			}
		})
		return data
	})

}

//获取token和上传服务器地址、
export const getToken = () => (dispatch) => {
	return api.get('/finance/invoice/application/getUploadToken?purposes[0]=invoice_company_relation_proof&purposes[1]=special_invoice_proof&purposes[2]=invoice_title_code_proof&purposes[3]=contract_scan_file&purposes[4]=mail_screenshot').then((response) => {
		const data = response.data;
		dispatch({
			type: GET_TOKEN,
			payload: {
				data
			}
		})
		return response
	})
}

//上传文件名
export const postFileName = (obj) => () => {
	return api.post('/finance/invoice/application/uploadProof', { ...obj }).then((response) => {
		return response
	})
}

//获取开票统计
export const invoiceState = (id, num) => (dispatch) => {
	let obj = {};
	obj.company_id = id;
	obj.type = num;

	api.get('/finance/invoice/application/invoiceStatByApplicationType', { params: { ...obj } }).then((response) => {
		const data = response.data;
		dispatch({
			type: INVOICE_COUNT,
			payload: {
				data
			}
		})
	})
}

//搜索po单
export const searchPo = (id) => () => {
	return api.get('/finance/invoice/application/getExecutionEvidenceByCode?execution_evidence_code=' + id).then((response) => {
		return response
	})
}
//修改发票申请单
export const modifiyInvoice = (id) => (dispatch) => {
	api.get('/finance/invoice/application/detail?id=' + id).then((response) => {
		const data = response.data;
		dispatch({
			type: MODIFIED_FORM,
			payload: {
				data
			}
		})
		data
	})
}
//修改发票申请单
export const modifiyInvoiceSucc = (id) => () => {
	return api.get('/finance/invoice/application/detail?id=' + id).then((response) => {
		return response
	})
}
//提交修改的表单修改
export const modifiedSubmit = (data) => () => {
	return api.post('/finance/invoice/application/modify', { ...data }).then((response) => {
		return response
	})
}

//发票抬头关联处理
export const getInvoiceTitleRelation = (title) => dispatch => {
	return api.get('/finance/invoice/application/invoiceTitleList', { params: { invoice_title: title } }).then(response => {
		const { data } = response;
		dispatch({
			type: Types.GET_INVOICE_TITLE_RELATION,
			payload: data
		})
	})
}
//获取发票抬头关联内容
export const getInvoiceTitleContent = (id) => dispatch => {
	return api.get('/finance/invoice/application/invoiceTitleDetail', { params: { invoice_id: id } }).then(response => {
		const { data } = response;
		dispatch({
			type: Types.GET_INVOICE_TITLE_CONTENT,
			payload: data
		})
	})
}
