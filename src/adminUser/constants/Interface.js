export default {
	adminUser: {
		getUserList: '/user/getUserList',//获取管理员用户信息
		getUserTree: '/user/getUserTree',//获取用户树状图
		selectMember: '/user/selectMember',//获取所属大区等下拉菜单
		getUserGroup: '/user/getUserGroup',//获取分组信息
		getClickData: '/user/getClickData',//点击修改获取当前账号信息
		addUser: '/user/add',//添加管理员用户
		deleteUser: '/user/delete',//删除管理员用户信息
		editUser: '/user/edit',//修改管理员用户信息
		resetPwd: '/user/resetPwd',//修改密码
		deleteWechat: '/user/deleteWechat',//删除微信绑定
		flushSaleList: '/user/flushSaleList',// 清除销售列表缓存
		getDepartmentList: '/organization/getDepartmentTree',//获取部门信息
		getJobList: '/organization/getJobTree',//获取岗位信息
		getJobTypeList: '/organization/getJobTypeList',//岗位类型列表
		resetAuthorizations: '/rbac/resetAuthorizations',//清空缓存
		getUserRoleAssignments: '/rbac/getUserRoleAssignments',//查看权限
	}
}
