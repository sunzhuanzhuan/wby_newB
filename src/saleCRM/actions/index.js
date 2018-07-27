import { Interface } from "../constants/Interface";
import { createHttpAction } from '../../store/ajaxMiddleware'
import { createAction } from 'redux-actions';

//清除一个微信绑定多个账号的用户列表
// export const clearLoginUserList = createAction('clearLoginUserList', () => {
// 	return {};
// })
//图片上传获取token
export const {
	getUploadCompanyToken,
	getUploadCompanyToken_success
} = createHttpAction('getUploadCompanyToken', Interface.common.getUploadCompanyToken)

//下拉框筛选（商机阶段，跟进筛选类型，预估销售金额）
export const {
	getSelect,
	getSelect_success
} = createHttpAction('getSelect', Interface.common.getSelect);


//获取公司名称
export const {
	getCompanyName,
	getCompanyName_success
} = createHttpAction('getCompanyName', Interface.common.getCompanyName)

//清空公司名称
export const cleanCompanyName = createAction('cleanCompanyName', () => {
	return {};
})

//获取公司资质
export const {
	getCompanyFile,
	getCompanyFile_success
} = createHttpAction('getCompanyFile', Interface.common.getCompanyFile)

//添加跟进记录item_type=1时发送公司，item_type=2时发送商机id
export const {
	addFollowUp
} = createHttpAction('addFollowUp', Interface.common.addFollowUp, {
	method: 'post'
})
//获取跟进记录列表
export const {
	getFollowUpList,
	getFollowUpList_success
} = createHttpAction('getFollowUpList', Interface.common.getFollowUpList)

//获取销售经理
export const {
	getSalesManager,
	getSalesManager_success
} = createHttpAction('getSalesManager', Interface.common.getSalesManager);

//商机名称唯一性
export const {
	verifyNameOnly,
	verifyNameOnly_success
} = createHttpAction('verifyNameOnly', Interface.business.verifyNameOnly);


//添加商机
export const {
	addBusiness,
	addBusiness_success
} = createHttpAction('addBusiness', Interface.business.addBusiness, {
	method: 'post'
})



//商机筛选列表（统计信息，列表信息）
export const {
	getBoList,
	getBoList_success
} = createHttpAction('getBoList', Interface.business.getBoList)

//暂停商机
export const {
	pauseBo,
	pauseBo_success
} = createHttpAction('pauseBo', Interface.business.pauseBo, {
	method: 'post'
})

//终止商机
export const {
	stopBo,
	stopBo_success
} = createHttpAction('stopBo', Interface.business.stopBo, {
	method: 'post'
})


//编辑商机+商机详情信息获取
export const {
	getBoInfo,
	getBoInfo_success
} = createHttpAction('getBoInfo', Interface.business.getBoInfo)

//清除编辑商机 + 商机详情信息获取
export const cleanBoInfo = createAction('cleanBoInfo', () => {
	return {};
})

//重新跟进商机
export const {
	recoverBusinessOpportunity,
	recoverBusinessOpportunity_success
} = createHttpAction('recoverBusinessOpportunity', Interface.business.recoverBusinessOpportunity, {
	method: 'post'
})


