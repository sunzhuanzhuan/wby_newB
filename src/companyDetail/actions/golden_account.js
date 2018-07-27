import {
	DOLDEN_ACCOUNT_FLOW,
	DOLDEN_GET_COST,
	DOLDEN_REPARATION_DETAIL,
	GET_COFFERS_LIST
} from '../constants/ActionTypes'
import api from '../../api/index'
// import Interface from '../constants/Interface'

//小金库流水查询
export const goldenFlow = (company_id, is_revoke_type, page_size, page, create_time_start, create_time_end) => (dispatch) => {
	let obj = {}
	obj = {
		company_id,
		is_revoke_type,
		page_size,
		page,
		create_time_start,
		create_time_end

	}
	return api.get('/finance/coffers/billing', {
		params: {
			...obj
		}
	}).then((response) => {
		const goldenList = response.data;
		dispatch({
			type: DOLDEN_ACCOUNT_FLOW,
			payload: {
				goldenList
			}
		})
	})
}

//小金库额度变更
export const getCostBilling = (company_id, create_time_start, create_time_end, page, page_size) => (dispatch) => {
	let obj = {}
	obj = {
		create_time_start,
		create_time_end,
		page,
		page_size,
		company_id
	}
	return api.get('/finance/coffers/costBilling', {
		params: {
			...obj
		}
	}).then((response) => {
		const goldenCostList = response.data;
		dispatch({
			type: DOLDEN_GET_COST,
			payload: {
				goldenCostList
			}
		})
	})
}

//小金库（赔偿）
export const getRparationInfo = (id) => (dispatch) => {
	return api.get('/finance/reparation/info?company_id' + id, {
		id
	}).then((response) => {
		const reparationList = response.data;
		dispatch({
			type: DOLDEN_REPARATION_DETAIL,
			payload: {
				reparationList
			}
		})
		return reparationList
	})
}

//小金库列表
export const getCoffersList = (id) => (dispatch) => {
	api.get('finance/coffers/info?company_id' + id).then((response) => {
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

