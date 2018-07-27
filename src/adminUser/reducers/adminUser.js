import { combineReducers } from 'redux'
import * as types from '../constants/ActionTypes'

const byId = (state = {}, action) => {
	switch (action.type) {
		case types.GET_ADMIN_USER_LIST:
			return {
				...state,
				...action.payload.data.rows.reduce((obj, product) => {
					obj[product.user_id] = product
					return obj
				}, {}),
				current_page: action.payload.data._meta.currentPage,
				total: action.payload.data._meta.totalCount,
				perPage: action.payload.data._meta.perPage
			};
		case types.ADD_ADMIN_USER:
			return {
				...state,
				[action.payload.user_id]: action.payload
			};
		//修改用户信息
		case types.EDIT_ADMIN_USER:
			return { ...state, [action.payload.data.user_id]: action.payload.data }
		//修改密码
		case types.RESETPWD:
			return { ...state, [action.payload.data.user_id]: action.payload.data }
		//删除微信绑定
		// case types.DELETE_WECHAT:
		//     return { ...state, [action.payload.data.user_id]: action.payload.data }
		default:
			return state
	}
}

const visibleIds = (state = [], action) => {
	switch (action.type) {
		case types.GET_ADMIN_USER_LIST:
			return action.payload.data.rows.map(product => product.user_id)
		//新增用户信息
		case types.ADD_ADMIN_USER:
			if (state.indexOf(action.payload.user_id) === -1) {
				return state
			}
			return [...state, action.payload.user_id]
		//修改用户信息
		case types.EDIT_ADMIN_USER:
			if (state.indexOf(action.payload.user_id) === -1) {
				return state
			}
			return [...state, action.payload.user_id]
		//修改密码
		case types.RESETPWD:
			if (state.indexOf(action.payload.user_id) === -1) {
				return state
			}
			return [...state, action.payload.user_id]
		//删除微信绑定
		case types.DELETE_WECHAT:
			if (state.indexOf(action.payload.user_id) === -1) {
				return state
			}
			return [...state, action.payload.user_id]
		//删除用户信息
		case types.DELETE_ADMIN_USER:
			if (state.indexOf(action.payload.user_id) === -1) {
				return state;
			}
			return state.filter(id => id !== action.payload.user_id)
		default:
			return state
	}
}
const userGroupOption = (state = [], action) => {
	switch (action.type) {
		case types.GET_USER_GROUP:
			return action.payload.data
		default:
			return state
	}
}
const selectMemberpList = (state = {}, action) => {
	switch (action.type) {
		case types.GET_SELECT_MEMBERP:
			return action.payload.data
		case types.CLEAN_SELECT_MEMBERP:
			return []
		default:
			return state
	}
}
//用户树形图
const userTreeList = (state = [], action) => {
	switch (action.type) {
		case types.GET_USER_TREE:
			return action.payload.data
		default:
			return state
	}
}
//部门列表
const departmentList = (state = [], action) => {
	switch (action.type) {
		case types.GET_DEPARTMENT_LIST:
			return action.payload.data
		default:
			return state
	}
}

//岗位类型列表
const jobTypeList = (state = [], action) => {
	switch (action.type) {
		case types.GET_JOB_TYPE_LIST:
			return action.payload.data
		default:
			return state
	}
}
//岗位列表
const jobList = (state = [], action) => {
	switch (action.type) {
		case types.GET_JOB_LIST:
			return action.payload.data
		case types.CLEAN_JOB_LIST:
			return [{}]
		default:
			return state
	}
}
//岗位列表
const userRoleAssignments = (state = [], action) => {
	switch (action.type) {
		case types.USER_ROLE_ASSIGNMENTS:
			return action.payload.data && action.payload.data.assignments || []
		default:
			return state
	}
}
export default combineReducers({
	byId,
	visibleIds,
	userGroupOption,
	selectMemberpList,
	userTreeList,
	departmentList,
	jobList,
	jobTypeList,
	userRoleAssignments
})

export const getAdminUserList = (state, id) => state.byId[id]
export const getVisibleAdminUser = state => state.visibleIds.map(id => getAdminUserList(state, id))
