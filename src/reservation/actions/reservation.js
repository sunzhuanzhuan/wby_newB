import api from '../../api/index'
import Interface from '../constants/Interface'
import { createHttpAction } from '../../store/ajaxMiddleware'
import {
	GET_RESERVATION_LIST,
	GET_MEDIA_USERS,
	GET_VOL_USERS,
	GET_PLATFORM_LIST,
	GET_QC_STATUS_LIST,
	TRANSFORM_ROLEID,
	RESETACTIVEINSPECTIONDATA
} from "../constants/ActionTypes";
//获取用户角色
export const getRole = () => (dispatch) => {
	return api.get('/user/getCurrentUserInfo').then((response) => {
		const { data: { role_id } } = response;
		dispatch({
			type: TRANSFORM_ROLEID,
			payload: {
				role_id
			}
		})
	})
}
export const getList = (values) => (dispatch) => {
	return api.get('/reservationOrderQc/qc/getOrderList', { params: { ...values } }).then((response) => {
		const { data: { items } } = response;
		const { data: { statistics } } = response;
		const { data: { pagination } } = response;
		const { data: { meta: { babysitter_host } } } = response;
		dispatch({
			type: GET_RESERVATION_LIST,
			payload: {
				items, statistics, pagination, values, babysitter_host
			}
		})
	})
}
//获取资源媒介
export const getMediaUsers = () => (dispatch) => {
	return api.get('/user/getMediaUsers', {
	}).then((response) => {
		const { data } = response;
		dispatch({
			type: GET_MEDIA_USERS,
			payload: {
				data
			}
		})
	})
};
//获取项目媒介
export const getVolUsers = () => (dispatch) => {
	return api.get('/user/getVolUsers', {
	}).then((response) => {
		const { data } = response;
		dispatch({
			type: GET_VOL_USERS,
			payload: {
				data
			}
		})
	})
};
//获取平台列表
export const getPlatformList = () => (dispatch) => {
	return api.get('/platform/getAll', {
	}).then((response) => {
		const { data } = response;
		dispatch({
			type: GET_PLATFORM_LIST,
			payload: {
				data
			}
		})
	})
};
//获取质检过程&质检状态
export const getQcStatusList = () => (dispatch) => {
	return api.get('/reservationOrderQc/qc/getQcStatusList', {
	}).then((response) => {
		const { data } = response;
		dispatch({
			type: GET_QC_STATUS_LIST,
			payload: {
				data
			}
		})
	})
};
//closeModal重置store
export const resetData = () => {
	return {
		type: RESETACTIVEINSPECTIONDATA,
		data: {}
	}
}
//处理-质检员主动质检-获取数据
export const {
	getActiveInspectionData,
	getActiveInspectionData_success
} = createHttpAction('getActiveInspectionData', Interface.getActiveInspectionData, {
	method: 'get'
});
//处理-确认投诉-获取数据
export const {
	getComplainData,
	getComplainData_success
} = createHttpAction('getComplainData', Interface.getComplainData, {
	method: 'get'
});
//修改投诉-获取数据
export const {
	getModifyComplainData,
	getModifyComplainData_success
} = createHttpAction('getModifyComplainData', Interface.getComplainData, {
	method: 'get'
});
//处理-质检员确认驳回（查看）-获取数据
export const {
	getAgreeRejectionCheckData,
	getAgreeRejectionCheckData_success
} = createHttpAction('getAgreeRejectionCheckData', Interface.getAgreeRejectionCheckData, {
	method: 'get'
});
//处理-申诉（查看）-获取数据
export const {
	getAppealCheckData,
	getAppealCheckData_success
} = createHttpAction('getAppealCheckData', Interface.getAppealCheckData, {
	method: 'get'
});
//处理-质检员质检申诉内容-获取数据
export const {
	getAppealInspectionData,
	getAppealInspectionData_success
} = createHttpAction('getAppealInspectionData', Interface.getAppealInspectionData, {
	method: 'get'
});
//处理-申诉修改（查看）-获取数据
export const {
	getMediaModifyCheckData,
	getMediaModifyCheckData_success
} = createHttpAction('getMediaModifyCheckData', Interface.getMediaModifyCheckData, {
	method: 'get'
});
//处理-质检员最终质检-获取数据
export const {
	getManagerInspectionCheckData,
	getManagerInspectionCheckData_success
} = createHttpAction('getManagerInspectionCheckData', Interface.getManagerInspectionCheckData, {
	method: 'get'
});
//质检员主动质检合格
export const {
	qualifiedByInspector
} = createHttpAction('qualifiedByInspector', Interface.qualifiedByInspector, {
	method: 'post'
});
//质检员主动质检不合格
export const {
	unqualifiedByInspector
} = createHttpAction('unqualifiedByInspector', Interface.unqualifiedByInspector, {
	method: 'post'
});
//确认投诉
export const {
	confirmedByInspector
} = createHttpAction('confirmedByInspector', Interface.confirmedByInspector, {
	method: 'post'
});
//修改投诉
export const {
	modifiedByInspector
} = createHttpAction('modifiedByInspector', Interface.modifiedByInspector, {
	method: 'post'
});
//驳回投诉
export const {
	rejectedByInspector
} = createHttpAction('rejectedByInspector', Interface.rejectedByInspector, {
	method: 'post'
});
//同意驳回
export const {
	approveRejection
} = createHttpAction('approveRejection', Interface.approveRejection, {
	method: 'post'
});
//拒绝驳回
export const {
	refuseRejection
} = createHttpAction('refuseRejection', Interface.refuseRejection, {
	method: 'post'
});
//媒介同意质检结果
export const {
	fetchAppealWaive,
	fetchAppealWaive_success
} = createHttpAction('fetchAppealWaive', Interface
	.fetchAppealWaive, {
		method: 'post'
	});

//媒介获取申诉表单
export const {
	getAppealForm,
	getAppealForm_success
} = createHttpAction('getAppealForm', Interface
	.getAppealForm, {
		method: 'get'
	});

//媒介创建申述
export const {
	createAppeal,
	createAppeal_success
} = createHttpAction('createAppeal', Interface
	.createAppeal, {
		method: 'post'
	})
//获取历史记录
export const {
	getHistoryData,
	getHistoryData_success
} = createHttpAction('getHistoryData', Interface.getHistoryData, {
	method: 'get'
});
//质检员质检申诉判为合格
export const {
	appealQualifiedByInspector
} = createHttpAction('appealQualifiedByInspector', Interface.appealQualifiedByInspector, {
	method: 'post'
});
//获取质检申诉不合格的不合格表单
export const {
	getAppealFormData,
	getAppealFormData_success
} = createHttpAction('getAppealFormData', Interface.getAppealFormData, {
	method: 'get'
});
//质检申诉判为不合格
export const {
	judgeToRehandle
} = createHttpAction('judgeToRehandle', Interface.judgeToRehandle, {
	method: 'post'
});
//质检主管判定订单合格
export const {
	qualifiedByManager
} = createHttpAction('qualifiedByManager', Interface.qualifiedByManager, {
	method: 'post'
});
//质检主管暂停质检
export const {
	suspendedByQcLeader
} = createHttpAction('suspendedByQcLeader', Interface.suspendedByQcLeader, {
	method: 'post'
});
//质检主管判定不合格-获取数据
export const {
	getManagerInspectionUnquilfyData,
	getManagerInspectionUnquilfyData_success
} = createHttpAction('getManagerInspectionUnquilfyData', Interface.getManagerInspectionUnquilfyData, {
	method: 'get'
});
//质检主管判定不合格
export const {
	unqualifiedByQcLeader
} = createHttpAction('unqualifiedByQcLeader', Interface.unqualifiedByQcLeader, {
	method: 'post'
});
//批量质检合格
export const {
	batchInspectionQuailfy
} = createHttpAction('batchInspectionQuailfy', Interface.batchInspectionQuailfy, {
	method: 'post'
});

//媒介获取修改表单
export const {
	getMediaModifyForm,
	getMediaModifyForm_success
} = createHttpAction('getMediaModifyForm', Interface
	.getMediaModifyForm, {
		method: 'get'
	});

//媒介修改表单
export const {
	appealModify,
	appealModify_success
} = createHttpAction('appealModify', Interface
	.appealModify, {
		method: 'post'
	});
