import api from '../../api/index'
import {
	GET_ACCOUNT_DETAIL,
	GET_FREEZE_DETAIL,
	GET_COFFERS_LIST
} from "../constants/ActionTypes"
import Axios from 'axios';

//公司详情
export const getAccountDetail = (company_id) => (dispatch) => {
	api.get('/finance/account/detail?company_id=' + company_id).then((response) => {
		const {
			data
		} = response
		dispatch({
			type: GET_ACCOUNT_DETAIL,
			payload: {
				data
			}
		})
	})
}

//冻结详情
export const getFreezeDetail = (company_id, product_line, page, page_size, created_at_start, created_at_end) => (dispatch) => {
	let obj = {}
	obj = {
		company_id,
		product_line,
		page_size,
		page,
		created_at_start,
		created_at_end

	}
	api.get('/finance/account/freezeDetail', {
		params: {
			...obj
		}
	}).then((response) => {
		const {
			data
		} = response
		dispatch({
			type: GET_FREEZE_DETAIL,
			payload: {
				data
			}
		})
	})
}

//小金库账户详情
export const getCoffersList = (id) => (dispatch) => {
	api.get('finance/coffers/info?company_id=' + id).then((response) => {
		const {
			data
		} = response
		dispatch({
			type: GET_COFFERS_LIST,
			payload: {
				data
			}
		})
	})
}

//小金库额度修改
export const getEduModified = (obj) => () => {
	// console.log({ ...obj })
	return Axios.post('/api/finance/coffers/updateCost',
		{ ...obj }
	).then((response) => {
		return response
	})
}
