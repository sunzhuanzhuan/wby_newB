import api from '../../api/index'
import * as types from "../constants/ActionTypes";
import Interface from "../constants/Interface";
//获取管理员用户信息
export const getAdminUserList = (values) => (dispatch) => {
	return api.get(Interface.adminUser.getUserList, { params: { ...values } }).then((response) => {
		const { data } = response
		dispatch({
			type: types.GET_ADMIN_USER_LIST,
			payload: {
				data
			}
		})
		return data
	})
}

//获取用户组
export const getUserGroup = () => (dispatch) => {
	return api.get(Interface.adminUser.getUserGroup).then((response) => {
		const { data } = response
		dispatch({
			type: types.GET_USER_GROUP,
			payload: {
				data
			}
		})
		return data
	})
}
//获取用户树形图
export const getUserTree = () => (dispatch) => {
	return api.get(Interface.adminUser.getUserTree).then((response) => {
		const { data } = response
		dispatch({
			type: types.GET_USER_TREE,
			payload: {
				data
			}
		})
		return data
	})
}
//获取所属大区等下拉菜单
export const getSelectMemberp = (values) => (dispatch) => {
	return api.get(Interface.adminUser.selectMember, { params: { ...values } }).then((response) => {
		const { data } = response
		dispatch({
			type: types.GET_SELECT_MEMBERP,
			payload: {
				data
			}
		})
		return data
	})
}
//添加用户信息
export const addAdminUserList = (params) => (dispatch) => {
	return api.post(Interface.adminUser.addUser, { ...params }).then((response) => {
		const { data } = response
		dispatch({
			type: types.ADD_ADMIN_USER,
			payload: {
				data
			}
		})
		return data
	})
}
//修改用户信息
export const editAdminUserList = (params) => (dispatch) => {
	return api.post(Interface.adminUser.editUser, { ...params }).then((response) => {
		const { data } = response
		dispatch({
			type: types.EDIT_ADMIN_USER,
			payload: {
				data
			}
		})
		return data
	})
}
//删除用户
export const deleteAdminUserList = (user) => (dispatch) => {
	return api.post(Interface.adminUser.deleteUser, { ...user }).then((response) => {
		const { data } = response
		dispatch({
			type: types.DELETE_ADMIN_USER,
			payload: {
				user_id: user.user_id
			}
		})
		return data
	})
}
//修改密码
export const resetPwd = (values) => (dispatch) => {
	return api.post(Interface.adminUser.resetPwd, { ...values }).then((response) => {
		const { data } = response
		dispatch({
			type: types.RESETPWD,
			payload: {
				data
			}
		})
		return data
	})
}
//删除微信绑定
export const deleteWechat = (values) => (dispatch) => {
	return api.get(Interface.adminUser.deleteWechat, { params: { ...values } }).then((response) => {
		const { data } = response
		dispatch({
			type: types.DELETE_WECHAT,
			payload: {
				data
			}
		})
		return data
	})
}
//清除销售列表缓存
export const flushSaleList = (values) => (dispatch) => {
	return api.get(Interface.adminUser.flushSaleList, { params: { ...values } }).then((response) => {
		const { data } = response
		dispatch({
			type: types.FLUSH_SALE_LIST,
			payload: {
				data
			}
		})
		return data
	})
}
//获取部门信息
export const getDepartmentList = (values) => (dispatch) => {
	return api.get(Interface.adminUser.getDepartmentList, { params: { ...values } }).then((response) => {
		const { data } = response
		dispatch({
			type: types.GET_DEPARTMENT_LIST,
			payload: {
				data
			}
		})
		return data
	})
}
//岗位类型列表
export const getJobTypeList = (values) => (dispatch) => {
	return api.get(Interface.adminUser.getJobTypeList, { params: { ...values } }).then((response) => {
		const { data } = response
		dispatch({
			type: types.GET_JOB_TYPE_LIST,
			payload: {
				data
			}
		})
		return data
	})
}
//获取岗位信息
export const getJobList = (values) => (dispatch) => {
	return api.get(Interface.adminUser.getJobList, { params: { ...values } }).then((response) => {
		const { data } = response
		dispatch({
			type: types.GET_JOB_LIST,
			payload: {
				data
			}
		})
		return data
	})
}
//清除岗位信息
export const cleanJobList = () => {
	return {
		type: types.CLEAN_JOB_LIST
	}
}
//清除所属大区信息
export const cleanSelectMemberp = () => {
	return {
		type: types.CLEAN_SELECT_MEMBERP
	}
}
//清空缓存
export const resetAuthorizations = () => () => {
	return api.get('/rbac/resetAuthorizations').then(response => {
		return response
	})
}
//查看权限
export const getUserRoleAssignments = (values) => (dispatch) => {
	return api.get(Interface.adminUser.getUserRoleAssignments, { params: { ...values } }).then((response) => {
		const { data = [] } = response
		dispatch({
			type: types.USER_ROLE_ASSIGNMENTS,
			payload: {
				data
			}
		})
		return data
	})
}
