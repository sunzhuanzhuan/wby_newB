import { combineReducers } from 'redux'
import { handleAction, /*handleActions, combineActions*/ } from 'redux-actions';
import {
    getImportAccountList_success,
    getPlatformList_success,
    getDemandHistory_success,
    getAllotList_success,
    getMediaManagerList_success,
    getOrientationList_success,
    getAuditedList_success,
    getMainAllotList_success,
    getUsualAllotList_success,
    getRequirementlist_success,
    getRequirementStat_success,
    getAllPlatformList_success,
} from '../actions'

// 处理列表数据为map表
function handleListToMap(primary_key) {
    return (state, action) => {
        let { count = 0, page = 1, pageNum = 100, rows: resultAry = [], search_flag = false } = action.payload.data.list,
            map = {},
            list = resultAry.map(item => {
                map[item[primary_key]] = item
                return item[primary_key]
            })
        return {
            count, page, pageNum, list, search_flag,map: { ...state.map, ...map },
            stat: action.payload.data.statistics || {}
        }
    }
}

// 初始化列表数据
function initList() {
    return { list: [], map: {}, count: 0, page: 1, pageNum: 100, stat: {},search_flag:false }
}

// 已导入账号列表
export const importAccountList = handleAction(getImportAccountList_success, handleListToMap('ext_account_id'), initList())

// 平台列表
export const platformList = handleAction(getPlatformList_success, (state, action) => {
    return {
        ...state,
        ...action.payload.data
    }
}, {})

// 所有平台列表
export const allPlatformList = handleAction(getAllPlatformList_success, (state, action) => {
    return {
        ...state,
        ...action.payload.data
    }
}, {})

// 需求统计
export const requirementStat = handleAction(getRequirementStat_success, (state, action) => {
    return {
        ...state,
        ...action.payload.data
    }
}, {})

// 获取名下已有需求列表
export const requirementlist = handleAction(getRequirementlist_success, (state, action) => {
    return {
        ...state,
        ...action.payload.data
    }
}, {})


// 历史拓号需求列表
export const demandHistory = handleAction(getDemandHistory_success, handleListToMap('id'), initList())

// 拓号任务分配列表
export const allotList = handleAction(getAllotList_success, handleListToMap('id'), initList())

// 媒介经理列表
export const mediaManagerList = handleAction(getMediaManagerList_success, (state, action) => {
    let list = action.payload.data.admin_user || []
    return [...list]
}, [])

// 定向拓号任务列表
export const orientationList = handleAction(getOrientationList_success, handleListToMap('id'), initList())

//主账号审核
export const auditedList = handleAction(getAuditedList_success, handleListToMap('id'), initList())

//主账号分配列表
export const mainAllotList = handleAction(getMainAllotList_success, handleListToMap('user_id'), initList())

//日常拓号
export const usualAllotList = handleAction(getUsualAllotList_success, handleListToMap('key'), initList())


export default combineReducers({
    importAccountList,
    platformList,
    demandHistory,
    allotList,
    mediaManagerList,
    orientationList,
    requirementlist,
    requirementStat,
    auditedList,
    mainAllotList,
    usualAllotList,
    allPlatformList,
})


/*export const loginConfig = handleActions({
    [combineActions(getLoginConfig_success, login_success, verifysms_success)]: (state, action) => {
        return {
            ...state,
            ...action.payload.data
        }
    },
    [resetNeed_verify]: (state) => ({
        ...state,
        need_verify: false
    })
}, {})*/
