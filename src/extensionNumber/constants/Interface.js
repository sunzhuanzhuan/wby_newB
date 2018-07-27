export default {
    common: {
        getPlatformList: '/extentionAccount/getplatform', // 获取平台列表
        getAllPlatformList: '/extentionAccount/getWeiBoType' // 获取平台列表
    },
    sellerAndAE: {
        getImportAccountList: '/extentionAccount/extaccount', //获取导入账号列表
        getRequirementlist: '/extentionAccount/getRequirementlist', //获取名下已有需求列表
        postImportAccount: '/extentionAccount/extaccount', //导入账号
        createDemand: '/extentionAccount/requirement', // 创建拓号需求
        postEndReason: '/extentionAccount/stopExtAccount', // 终止拓号
        getDemandHistory: '/extentionAccount/requirement', // 历史拓号需求
        validateRequirementName: '/s', // 校验需求名是否重复
        requirementStat: '/extentionAccount/requirementcount' // 需求数据统计
    },
    media: {
        getAllotList: '/extentionAccount/allotList', //拓号任务分配列表
        getMediaManager: '/extentionAccount/getAdminUser', //媒介经理列表
        postAllotMediaManager: '/extentionAccount/allotAdmin', //分配媒介
        postAllotMediaManagerAdmin: '/extentionAccount/retransferUsersToOwnerAdmin', //重新分配媒介
        getOrientationList: '/extentionAccount/orientationList', //定向拓号任务列表
        postProgressStatusUpdate: '/extentionAccount/progressStatusUpdate', //更新拓号进度
        getUserList: '/extentionAccount/getUser', //主账号查询
        getAuditedList: '/extentionAccount/userChangeApplyList',//主账号审核
        getMainAllotList: '/extentionAccount/getUser',//主账号分配列表
        postAgree: '/extentionAccount/applyUserChange',//主账号分配同意转移
        postMainAccount: '/extentionAccount/userShift',//主账号分配
        getUsualAllotList: '/extentionAccount/dailyExtensionList',//日常拓号
        getCategoryList: '/extentionAccount/getCategoryList',//获取分类列表
        getTagList: '/extentionAccount/getTagList',//获取标签列表
        getMediaUsersList:'/user/getMediaUsers',//获取资源媒介
		postrelateAccountId:'/extentionAccount/relateAccountId'//关联accountID
    }
}
