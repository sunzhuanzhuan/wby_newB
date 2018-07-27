import {
	GET_RESERVATION_LIST,
	GET_MEDIA_USERS,
	GET_VOL_USERS,
	GET_PLATFORM_LIST,
	GET_QC_STATUS_LIST,
	TRANSFORM_ROLEID,
	RESETACTIVEINSPECTIONDATA
} from "../constants/ActionTypes";
import { handleActions } from 'redux-actions';

import {
	getActiveInspectionData_success,
	getComplainData_success,
	getAgreeRejectionCheckData_success,
	getAppealCheckData_success,
	getAppealInspectionData_success,
	getMediaModifyCheckData_success,
	getManagerInspectionCheckData_success,
	fetchAppealWaive_success,
	getAppealForm_success,
	createAppeal_success,
	getModifyComplainData_success,
	getHistoryData_success,
	getAppealFormData_success,
	getManagerInspectionUnquilfyData_success,
	getMediaModifyForm_success
} from '../actions/reservation'

export const reservationList = (state = {}, action) => {
	switch (action.type) {
		case GET_RESERVATION_LIST:
			return {
				item: [...action.payload.items],
				statistics: [...action.payload.statistics],
				pagination: { ...action.payload.pagination },
				values: { ...action.payload.values },
				babysitter_host: action.payload.babysitter_host
			}
		default:
			return state
	}
}

//获取用户角色
export const role_id = (state = {}, action) => {
	switch (action.type) {
		case TRANSFORM_ROLEID:
			return action.payload.role_id
		default:
			return state
	}
}
export const MediaUsers = (state = {}, action) => {
	switch (action.type) {
		case GET_MEDIA_USERS:
			return {
				data: action.payload.data
			}
		default:
			return state
	}
};

export const VolUsers = (state = {}, action) => {
	switch (action.type) {
		case GET_VOL_USERS:
			return {
				data: action.payload.data
			}
		default:
			return state
	}
};

export const PlatformList = (state = {}, action) => {
	switch (action.type) {
		case GET_PLATFORM_LIST:
			return {
				data: action.payload.data
			}
		default:
			return state
	}
};

export const QcStatusList = (state = {}, action) => {
	switch (action.type) {
		case GET_QC_STATUS_LIST:
			return {
				...action.payload.data,
				qc_stages: [{
					id: 0, display: '请选择', selected: true, states: []
				}, ...action.payload.data.qc_stages],
				qc_status: { ...action.payload.data.qc_status }
			};
		default:
			return state
	}
};
//处理-质检员主动质检-获取数据
export const activeInspectionData = handleActions({
	[getActiveInspectionData_success]: (state, action) => ({
		...state,
		...action.payload.data
	}),
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {})
//处理-确认投诉-获取数据
export const complainData = handleActions({
	[getComplainData_success]: (state, action) => ({
		...state,
		execution_content: { ...action.payload.data.meta.order_basic_info.execution_content },
		reasons: [...action.payload.data.complaint.data_execution_results],
		comment: action.payload.data.complaint.comment,
		attachments: [...action.payload.data.complaint.attachments]
	}),
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {})
//修改投诉-获取数据
export const modifyComplainData = handleActions({
	[getModifyComplainData_success]: (state, action) => ({
		...state,
		execution_content: { ...action.payload.data.meta.order_basic_info.execution_content },
		reasons: [...action.payload.data.complaint.data_execution_results],
		comment: action.payload.data.complaint.comment,
		attachments: [...action.payload.data.complaint.attachments],
		upload_info: action.payload.data.upload_info
	}),
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {})
//处理-质检员确认驳回（查看）-获取数据
export const agreeRejectionCheckData = handleActions({
	[getAgreeRejectionCheckData_success]: (state, action) => ({
		...state,
		execution_content: { ...action.payload.data.meta.order_basic_info.execution_content },
		reasons: [...action.payload.data.complaint.data_execution_results],
		comment: action.payload.data.complaint.comment,
		attachments: [...action.payload.data.complaint.attachments],
		rejectedComment: action.payload.data.complaint_rejected.comment
	}),
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {})
//处理-申诉（查看）-获取数据
export const appealCheckData = handleActions({
	[getAppealCheckData_success]: (state, action) => ({
		...state,
		execution_content: { ...action.payload.data.execution_content },
		data_execution_results: [...action.payload.data.data_execution_results],
		charge_ratio: action.payload.data.charge_ratio,
		attachments: action.payload.data.attachments,
		comment: action.payload.data.comment,
		title: action.payload.data.title
	}),
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {})
//处理-质检员质检申诉内容-获取数据
export const appealInspectionData = handleActions({
	[getAppealInspectionData_success]: (state, action) => ({
		...state,
		execution_content: { ...action.payload.data.execution_content },
		data_execution_results: [...action.payload.data.data_execution_results],
		comment: action.payload.data.comment,
		attachments: action.payload.data.attachments
	}),
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {})
//处理-申诉修改（查看）-获取数据
export const mediaModifyCheckData = handleActions({
	[getMediaModifyCheckData_success]: (state, action) => ({
		...state,
		execution_content: { ...action.payload.data.execution_content },
		data_execution_results: [...action.payload.data.data_execution_results],
		comment: action.payload.data.comment,
		charge_ratio: action.payload.data.charge_ratio,
		status: action.payload.data.status,
		attachments: action.payload.data.attachments,
		title: action.payload.data.title
	}),
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {})
//处理-质检员最终质检-获取数据
export const managerInspectionCheckData = handleActions({
	[getManagerInspectionCheckData_success]: (state, action) => ({
		...state,
		...action.payload.data
	}),
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {})

//媒介同意质检结果
export const mediaAppealWaive = handleActions({
	[fetchAppealWaive_success]: (state) => {
		return {
			...state
		}
	},
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {});

//媒介申述表单
export const appealForm = handleActions({
	[getAppealForm_success]: (state, action) => {
		return {
			...state,
			appealFormList: action.payload.data.data,
			uploadInfo: action.payload.data.upload_info
		}
	},
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {})

//媒介创建申述表单
export const createAppeal = handleActions({
	[createAppeal_success]: (state) => {
		return {
			state
		}
	},
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {});
//获取历史记录
export const historyData = handleActions({
	[getHistoryData_success]: (state, action) => {
		return {
			...state,
			...action.payload.data
		}
	},
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {});
//获取质检申诉不合格表单
export const appealUnquilfyReasons = handleActions({
	[getAppealFormData_success]: (state, action) => {
		return {
			...state,
			...action.payload.data
		}
	},
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {});
//质检主管判定不合格-获取数据
export const managerInspectionUnquilfyData = handleActions({
	[getManagerInspectionUnquilfyData_success]: (state, action) => {
		return {
			...state,
			...action.payload.data
		}
	},
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {});
//媒介获取修改表单
export const mediaModifyForm = handleActions({
	[getMediaModifyForm_success]: (state, action) => {
		return {
			...state,
			mediaFormList: action.payload.data.data,
			uploadInfo: action.payload.data.upload_info
		}
	},
	[RESETACTIVEINSPECTIONDATA]: () => {
		return {}
	}
}, {});

