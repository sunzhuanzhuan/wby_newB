import Interface from '../constants/Interface'
import { createHttpAction } from '../../store/ajaxMiddleware'

/**
 * 公共数据
 */
// 获取平台列表
export const {
    getPlatformList,
    getPlatformList_success
} = createHttpAction('getPlatformList', Interface.common.getPlatformList, {
    method: 'get',
});
// 获取平台列表
export const {
    getAllPlatformList,
    getAllPlatformList_success
} = createHttpAction('getAllPlatformList', Interface.common.getAllPlatformList, {
    method: 'get',
});
/**
 * 销售AE模块
 */
// 获取已导入账号列表
export const {
    getImportAccountList,
    getImportAccountList_success
} = createHttpAction('getImportAccountList', Interface.sellerAndAE.getImportAccountList, {
    method: 'get',
});

// 创建拓号需求
export const {
    postCreateDemand,
} = createHttpAction('postCreateDemand', Interface.sellerAndAE.createDemand, {
    method: 'post',
});

// 终止拓号
export const {
    postEndReason,
} = createHttpAction('postEndReason', Interface.sellerAndAE.postEndReason, {
    method: 'post',
});

// 获取名下已有需求列表
export const {
    getRequirementlist,
    getRequirementlist_success
} = createHttpAction('getRequirementlist', Interface.sellerAndAE.getRequirementlist, {
    method: 'get',
});

// 需求数据统计
export const {
    getRequirementStat,
    getRequirementStat_success
} = createHttpAction('getRequirementStat', Interface.sellerAndAE.requirementStat, {
    method: 'get',
});

// 模糊查询已有需求
export const {
    queryRequirement,
} = createHttpAction('queryRequirement', Interface.sellerAndAE.getRequirementlist, {
    method: 'get',
});

// 校验需求名是否重复
export const {
    validateRequirementName,
} = createHttpAction('validateRequirementName', Interface.sellerAndAE.validateRequirementName, {
    method: 'get',
});

// 历史拓号需求列表
export const {
    getDemandHistory,
    getDemandHistory_success
} = createHttpAction('getDemandHistory', Interface.sellerAndAE.getDemandHistory, {
    method: 'get',
});

/**
 * 拓号任务模块
 */
// 拓号任务分配列表
export const {
    getAllotList,
    getAllotList_success
} = createHttpAction('getAllotList', Interface.media.getAllotList, {
    method: 'get',
});

// 获取媒介经理列表
export const {
    getMediaManagerList,
    getMediaManagerList_success
} = createHttpAction('getMediaManagerList', Interface.media.getMediaManager, {
    method: 'get',
});

// 固定媒介经理主账号查询
export const {
    getUserList,
} = createHttpAction('getUserList', Interface.media.getUserList, {
    method: 'get',
});

// 分配媒介
export const {
    postAllotMediaManager,
} = createHttpAction('postAllotMediaManager', Interface.media.postAllotMediaManager, {
    method: 'post',
});

// 重新分配媒介
export const {
    postAllotMediaManagerAdmin,
} = createHttpAction('postAllotMediaManagerAdmin', Interface.media.postAllotMediaManagerAdmin, {
    method: 'post',
});

//分配主账号
export const {
    postMainAccount,
} = createHttpAction('postMainAccount', Interface.media.postMainAccount, {
    method: 'post',
});
//主账号审核的同意转移的接口

export const {
    postAgree,
} = createHttpAction('postAgree', Interface.media.postAgree, {
    method: 'post',
});

// 更新拓号进度
export const {
    postProgressStatusUpdate,
} = createHttpAction('postProgressStatusUpdate', Interface.media.postProgressStatusUpdate, {
    method: 'post',
});

// 定向拓号任务列表
export const {
    getOrientationList,
    getOrientationList_success,
} = createHttpAction('getOrientationList', Interface.media.getOrientationList, {
    method: 'get',
});

//主账号审核的列表

export const {
    getAuditedList,
    getAuditedList_success,
} = createHttpAction('getAuditedList', Interface.media.getAuditedList, {
    method: 'get',
});


//主账号分配
export const {
    getMainAllotList,
    getMainAllotList_success,
} = createHttpAction('getMainAllotList', Interface.media.getMainAllotList, {
    method: 'get',
});

//日常拓号
export const {
    getUsualAllotList,
    getUsualAllotList_success,
} = createHttpAction('getUsualAllotList', Interface.media.getUsualAllotList, {
    method: 'get',
});

// 获取分类列表
export const {
    getCategoryList,
} = createHttpAction('getCategoryList', Interface.media.getCategoryList, {
    method: 'get',
});
// 获取标签列表
export const {
    getTagList,
} = createHttpAction('getTagList', Interface.media.getTagList, {
    method: 'get',
});

//关联accountID
export const {
	postrelateAccountId,
} = createHttpAction('postrelateAccountId', Interface.media.postrelateAccountId, {
	method: 'post',
});







// export const resetNeed_verify = createAction('resetNeed_verify')
