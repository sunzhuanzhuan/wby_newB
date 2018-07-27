import Interface from '../constants/Interface'
import { createHttpAction } from '../../store/ajaxMiddleware'
import api from '../../api/index'
import { GET_JOB_AUTHORITY_LIST } from "../constants/ActionTypes"
//获取部门列表带分页的数据
export const {
	getBranchList,
	getBranchList_success
} = createHttpAction('getBranchList', Interface.branch.getBranchList, {
	method: 'get'

})
//获取部门列表所有数据
export const {
	getBranchListAll,
	getBranchListAll_success
} = createHttpAction('getBranchListAll', Interface.branch.getBranchList, {
	method: 'get'

})
//添加部门
export const {
	addBranch,
	addBranch_success
} = createHttpAction('addBranch', Interface.branch.addBranch, {
	method: 'post'

})
//查询部门
export const {
	queryBranch,
	queryBranch_success
} = createHttpAction('queryBranch', Interface.branch.queryBranch, {
	method: 'get'

})
//修改部门
export const {
	editBranch,
	editBranch_success
} = createHttpAction('editBranch', Interface.branch.editBranch, {
	method: 'post'

})
//删除部门
export const {
	deleteBranch,
	deleteBranch_success
} = createHttpAction('deleteBranch', Interface.branch.deleteBranch, {
	method: 'post'

})

//获取岗位列表
export const {
	getJobList,
	getJobList_success
} = createHttpAction('getJobList', Interface.job.getJobList, {
	method: 'get'

})
//获取岗位列表所有
export const {
	getJobListAll,
	getJobListAll_success
} = createHttpAction('getJobListAll', Interface.branch.getJobList, {
	method: 'get'

})
//添加岗位
export const {
	addJob,
	addJob_success
} = createHttpAction('addJob', Interface.job.addJob, {
	method: 'post'

})
//查询岗位
export const {
	queryJob,
	queryJob_success
} = createHttpAction('queryJob', Interface.job.queryJob, {
	method: 'get'

})
//修改岗位
export const {
	editJob,
	editJob_success
} = createHttpAction('editJob', Interface.job.editJob, {
	method: 'post'

})
//删除岗位
export const {
	deleteJob,
	deleteJob_success
} = createHttpAction('deleteJob', Interface.job.deleteJob, {
	method: 'post'

})
//
//获取岗位角色列表
export const {
	getRoleJobList,
	getRoleJobList_success
} = createHttpAction('getRoleJobList', Interface.job.getRoleJobList, {
	method: 'get'

})
//树形结构图
export const {
	getJobTree,
	getJobTree_success
} = createHttpAction('getJobTree', Interface.job.getJobTree, {
	method: 'get'

})

//树形结构图
export const {
	getBranchTree,
	getBranchTree_success
} = createHttpAction('getBranchTree', Interface.branch.getBranchTree, {
	method: 'get'

})


//
//获取岗位类型列表第一页
export const {
	getJobTypeList,
	getJobTypeList_success
} = createHttpAction('getJobTypeList', Interface.jobType.getJobTypeList, {
	method: 'get'

})
//获取岗位类型列表所有
export const {
	getJobTypeListAll,
	getJobTypeListAll_success
} = createHttpAction('getJobTypeListAll', Interface.jobType.getJobTypeList, {
	method: 'get'

})
//添加岗位
export const {
	addJobType,
	addJobType_success
} = createHttpAction('addJobType', Interface.jobType.addJobType, {
	method: 'post'

})
//查询岗位
export const {
	queryJobType,
	queryJobType_success
} = createHttpAction('queryJobType', Interface.jobType.queryJobType, {
	method: 'get'

})
//修改岗位
export const {
	editJobType,
	editJobType_success
} = createHttpAction('editJobType', Interface.jobType.editJobType, {
	method: 'post'

})
//删除岗位
export const {
	deleteJobType,
	deleteJobType_success
} = createHttpAction('deleteJobType', Interface.jobType.deleteJobType, {
	method: 'post'

})

//用户去查岗位权限
// export const {
// 	getUserByJobType,
// 	getUserByJobType_success
// } = createHttpAction('getUserByJobType', Interface.jobType.getUserByJobType, {
// 	method: 'get'

// })


export const getUserByJobType = (state) => (dispatch) => {
	api.get(
		Interface.jobType.getUserByJobType + '?id=' + state.id
	).then((response) => {
		dispatch({
			type: GET_JOB_AUTHORITY_LIST,
			payload: {
				roleAuthorityList1: response.data
			}
		})
	})
}


