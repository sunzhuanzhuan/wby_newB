import { combineReducers } from 'redux'
import { handleAction, /*handleActions, combineActions*/ } from 'redux-actions';
import {
    getKolList_success,
    getExcel_success
} from '../actions'


// 处理列表数据为map表
function handleListToMap(primary_key) {
    return (state, action) => {
        let { count = 0, page = 1, pageNum = 20, data: resultAry = [], } = action.payload.data.ClewList,
            map = {},
            list = resultAry.map(item => {
                map[item[primary_key]] = item
                return item[primary_key]
            })

        return {
            count, page, pageNum, list, map: { ...map }
        }
    }
}

// 初始化列表数据
function initList() {
    return { list: [], map: {}, count: 0, page: 1, pageNum: 20 }
}

// 获取KOL列表
export const KolList = handleAction(getKolList_success, handleListToMap('id'), initList())
//下载地址
export const excelAddress = handleAction(getExcel_success, (state, action) => {
    return {
        ...state,
        ...action.payload.data
    }
}, {})

export default combineReducers({
    KolList,
    excelAddress
})