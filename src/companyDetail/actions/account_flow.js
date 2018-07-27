import { GET_GOLDEN_FLOW } from '../constants/ActionTypes'
import api from '../../api/index'
// import Interface from '../constants/Interface'

//账户流水接口
export const getGoldenList = (company_id, billing_type, account_type, created_at_start, created_at_end, page, page_size) => (dispatch) => {
    let obj = {}
    obj = { company_id, account_type, billing_type, created_at_start, created_at_end, page, page_size }
    return api.get('/finance/account/billing', { params: { ...obj } }).then((response) => {
        const goldenFlowList = response.data;
        dispatch({
            type: GET_GOLDEN_FLOW,
            payload: {
                goldenFlowList
            }
        })
    })
}


//获取账户详情
export const getDetail = (values) => () => {
    return api.get('/finance/account/billDetail', { params: { ...values } }).then((response) => {

        return response
    })
}






























