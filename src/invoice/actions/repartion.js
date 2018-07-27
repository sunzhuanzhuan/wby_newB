import api from '../../api/index'
import * as Types from "../constants/ActionTypes";
// 获取所属销售列表
export const getSaleList = () => (dispatch) => {
    api.get('/finance/reparation/saleList').then((response) => {
        const { data } = response;
        dispatch({
            type: Types.GET_SALE_LIST,
            payload: data || {}
        })
    })
}

// 获取赔偿列表
export const getRepartionList = (value) => (dispatch) => {
    return api.get('/finance/reparation/info', { params: { ...value } }).then((response) => {
        const { data } = response;
        dispatch({
            type: Types.GET_REPARATION_LIST,
            payload: data
        })
        return response
    })
}
//赔偿状态
export const getRepartionStatus = () => (dispatch) => {
    api.get('/finance/reparation/status').then((response) => {
        const { data } = response;
        dispatch({
            type: Types.REPARION_STATUS,
            payload: data
        })
    })
}

// 获取赔偿详情
export const getRepartionDetail = (obj) => () => {
    return api.get('/finance/reparation/info', { params: { ...obj } }).then((response) => {
        return response
    })
}