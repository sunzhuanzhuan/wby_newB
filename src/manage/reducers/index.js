import { combineReducers } from 'redux'
import { handleAction } from "redux-actions";
import jobAuthorityList1 from './roleAuthority'

import {
	getBranchList_success,
	getBranchListAll_success,
	queryBranch_success,
	getJobList_success,
	queryJob_success,
	getRoleJobList_success,
	getJobTree_success,
	getBranchTree_success,
	getJobListAll_success,
	getJobTypeList_success,
	queryJobType_success,
	getJobTypeListAll_success


} from "../actions";

// 处理列表数据为map表
function handleListToMap(primary_key) {
	return (state, action) => {
		let { _meta: { currentPage, perPage, totalCount, }, rows: resultAry = [], } = action.payload.data,

			map = {},
			list = resultAry.map(item => {
				map[item[primary_key]] = item
				return item[primary_key]
			})
		return {
			currentPage, perPage, totalCount, list, map: { ...map }
		}
	}
}

// 初始化列表数据
function initList() {
	return { list: [], map: {}, currentPage: 1, perPage: 20, totalCount: 0 }
}

// 获取部门第一页列表
export const branchList = handleAction(getBranchList_success, handleListToMap('id'), initList())
// 获取部门所有列表
export const branchListAll = handleAction(getBranchListAll_success, (state, action) => {
	return [
		...action.payload.data
	]
}, [])
// 获取岗位所有列表
export const jobListAll = handleAction(getJobListAll_success, (state, action) => {
	return [
		...action.payload.data
	]
}, [])

//查询部门
export const queryBranchSucc = handleAction(queryBranch_success, (state, action) => {
	return {
		...state,
		...action.payload.data
	}
}, {})

// 获取岗位第一页列表
export const jobList = handleAction(getJobList_success, handleListToMap('id'), initList())
// 获取用户角色所有列表
export const jobRoleListAll = handleAction(getRoleJobList_success, (state, action) => {
	return [
		...action.payload.data.rows
	]
}, [])
//查询岗位
export const queryJobSucc = handleAction(queryJob_success, (state, action) => {
	return {
		...state,
		...action.payload.data
	}
}, {})

//获取岗位树形图
export const jobTree = handleAction(getJobTree_success, (state, action) => {
	return [
		action.payload.data
	]
}, [])
//获取部门树形图
export const branchTree = handleAction(getBranchTree_success, (state, action) => {
	return [
		action.payload.data
	]
}, [])

// 获取岗位类型第一页列表
export const jobTypeList = handleAction(getJobTypeList_success, handleListToMap('id'), initList())
// 获取用户查看权限列表
// export const userByJobTypeList = handleAction(getUserByJobType_success, (state, action) => {
//     return {
//         ...state,
//         ...action.payload.data
//     }
// }, {})


//查询岗位类型
export const queryJobTypeSucc = handleAction(queryJobType_success, (state, action) => {
	return {
		...state,
		...action.payload.data
	}
}, {})
//查询所有的岗位类型
export const jobTypeListAll = handleAction(getJobTypeListAll_success, (state, action) => {
	return [
		...action.payload.data
	]
}, {})
export default combineReducers({
	branchList,
	branchListAll,
	queryBranchSucc,
	jobList,
	queryJobSucc,
	jobRoleListAll,
	jobTree,
	branchTree,
	jobListAll,
	jobTypeList,
	queryJobTypeSucc,
	jobTypeListAll,
	jobAuthorityList1,

})
