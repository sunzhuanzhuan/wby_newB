export const Interface = {

	common: {
		getUploadCompanyToken: '/salecrm/upload/getUploadCompany',//图片上传获取token
		getSelect: '/salecrm/getSelect',//下拉框筛选（商机阶段，跟进筛选类型，预估销售金额）
		getCompanyName: '/salecrm/getCompanyName',//获取公司名称
		getCompanyFile: '/salecrm/getFile',//获取公司资质
		addFollowUp: '/salecrm/addCompanyFollowupRecord',//添加跟进记录item_type=1时发送公司，item_type=2时发送商机id
		getFollowUpList: '/salecrm/getCompanyFollowupList',//获取跟进记录列表,
		getSalesManager: '/salecrm/getSalesManager',//获取销售经理
	},
	business: {
		addBusiness: '/salecrm/addBo',//添加商机
		verifyNameOnly: '/salecrm/onlyBoName',//验证商机唯一
		getBoList: '/salecrm/getBoList',//商机筛选列表（统计信息，列表信息）
		pauseBo: '/salecrm/pauseBo',//暂停商机
		stopBo: '/salecrm/stopBo',//终止商机
		getBoInfo: '/salecrm/getBoInfo',//编辑商机+商机详情信息获取
		recoverBusinessOpportunity: "/salecrm/recoverBo",//重新跟进商机
	},
	company: {}
}

