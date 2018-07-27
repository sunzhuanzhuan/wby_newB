export default {
	branch: {
		getBranchList: '/organization/getDepartmentList',
		addBranch: '/organization/addDepartment',
		queryBranch: '/organization/getDepartment',
		editBranch: '/organization/updateDepartment',
		deleteBranch: '/organization/deleteDepartment',
		getBranchTree: '/organization/getDepartmentTree'
	},
	job: {
		getJobList: '/organization/getJobList',
		addJob: '/organization/addJob',
		queryJob: '/organization/getJob',
		editJob: '/organization/updateJob',
		deleteJob: '/organization/deleteJob',
		getRoleJobList: '/rbac/getRolesList',
		getJobTree: '/organization/getJobTree'
	},
	jobType: {
		getJobTypeList: '/organization/getJobTypeList',
		addJobType: '/organization/addJobType',
		queryJobType: '/organization/getJobType',
		editJobType: 'organization/updateJobType',
		deleteJobType: '/organization/deleteJobType',
		getUserByJobType: '/organization/getAssignmentByJobType',
	}

}
