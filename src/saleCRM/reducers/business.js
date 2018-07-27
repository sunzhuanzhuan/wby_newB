
//import * as businessType from "../constants/componentsActionTypes";

// import { handleAction, handleActions, combineActions } from 'redux-actions';
import { handleActions, handleAction } from 'redux-actions';
import { combineReducers } from 'redux'
import * as businessAction from '../actions'
//下拉框筛选（商机阶段，跟进筛选类型，预估销售金额）
export const selectList = handleActions({
	[businessAction.getSelect_success]: (state, action) => {
		return {
			...state, ...action.payload.data
		}
	},
	[businessAction.getSalesManager_success]: (state, action) => {
		return {
			...state,
			saleManagerList: [...action.payload.data.list]
		}
	},

}, {})

//商机是否唯一
export const verifyNameOnly = handleActions({
	[businessAction.verifyNameOnly_success]: (state, action) => {
		return {
			...action.payload.data
		}
	},
}, {})

//图片上传获取token
export const uploadCompanyToken = handleActions({
	[businessAction.getUploadCompanyToken_success]: (state, action) => {
		return {
			...action.payload.data
		}
	},
}, {})

//获取公司名称
export const compayNameList = handleActions({
	[businessAction.getCompanyName_success]: (state, action) => {
		return action.payload.data.list
	},
	[businessAction.cleanCompanyName]: () => {
		return []
	}
}, [])

//获取公司资质
export const getCompanyFile = handleActions({
	[businessAction.getCompanyFile_success]: (state, action) => {
		return {
			...action.payload.data
		}
	},
}, {})

//添加商机信息
export const addBusiness = handleActions({
	[businessAction.addBusiness_success]: (state, action) => {
		return {
			...action.payload.data
		}
	},
}, {})

//商机筛选列表（列表信息）
export const boList = handleActions({
	[businessAction.getBoList_success]: (state, action) => {
		return {
			...action.payload.data
		}
	},
}, {})

//商机筛选列表（统计信息）
export const boStatistics = handleActions({
	[businessAction.getBoList_success]: (state, action) => {
		return {
			...action.payload.data.statistics
		}
	},
}, [])
//暂停商机
export const pauseBo = handleAction(businessAction.pauseBo_success, (state, action) => {
	return action.payload.data
}, {})

//终止商机
export const stopBo = handleAction(businessAction.stopBo_success, (state, action) => {
	return action.payload.data
}, {})

//获取跟进记录列表(item_type:1代表公司，2代表商机)
export const followUpList = handleActions({
	[businessAction.getFollowUpList_success]: (state, action) => {
		return {
			...action.payload.data
		}
	},
}, {})
//编辑商机+商机详情信息获取
export const boInfo = handleActions({
	[businessAction.getBoInfo_success]: (state, action) => {
		return {
			...action.payload.data.list
		}
	},
	[businessAction.cleanBoInfo]: () => {
		return {}
	}
}, {})
//重新跟进商机
export const recoverBusinessOpportunity = handleAction(businessAction.recoverBusinessOpportunity_success, (state, action) => {
	return action.payload.data
}, {})

export default combineReducers({
	selectList,
	verifyNameOnly,
	uploadCompanyToken,
	compayNameList,
	getCompanyFile,
	addBusiness,
	boList,
	boStatistics,
	boInfo,
	followUpList,
})
