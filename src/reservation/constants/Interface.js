export default {
	getActiveInspectionData: '/reservationOrderQc/v2/checkPoint/getForm',
	getComplainData: '/reservationOrderQc/qc/getOrderQcPreview',
	getAgreeRejectionCheckData: '/reservationOrderQc/qc/getOrderQcPreview',
	getAppealCheckData: '/reservationOrderQc/qc/getFormDispose',
	getAppealInspectionData: '/reservationOrderQc/qc/getFormDispose',
	getMediaModifyCheckData: '/reservationOrderQc/qc/getFormDispose',
	getManagerInspectionCheckData: '/reservationOrderQc/qc/getFormDispose',
	qualifiedByInspector: '/reservationOrderQc/qc/qualifiedByInspector',
	unqualifiedByInspector: '/reservationOrderQc/qc/unqualifiedByInspector',
	confirmedByInspector: '/reservationOrderQc/complaint/confirmedByInspector',
	rejectedByInspector: '/reservationOrderQc/complaint/rejectedByInspector',
	fetchAppealWaive: '/reservationOrderQc/appeal/waive',
	getAppealForm: '/reservationOrderQc/appeal/getAppealForm',
	createAppeal: '/reservationOrderQc/appeal/create',
	modifiedByInspector: '/reservationOrderQc/complaint/modifiedByInspector',
	approveRejection: '/reservationOrderQc/complaint/approveRejection',
	refuseRejection: '/reservationOrderQc/complaint/refuseRejection',
	getHistoryData: '/reservationOrderQc/qc/getQcHistory',
	appealQualifiedByInspector: '/reservationOrderQc/appeal/qualifiedByInspector',
	getAppealFormData: '/reservationOrderQc/appeal/getAppealConfirmForm',
	judgeToRehandle: '/reservationOrderQc/appeal/judgeToRehandle',
	qualifiedByManager: '/reservationOrderQc/qc/qualifiedByQcLeader',
	suspendedByQcLeader: '/reservationOrderQc/qc/suspendedByQcLeader',
	getManagerInspectionUnquilfyData: '/reservationOrderQc/checkPoint/getSecondQcForm',
	unqualifiedByQcLeader: '/reservationOrderQc/qc/unqualifiedByQcLeader',
	batchInspectionQuailfy: '/reservationOrderQc/qc/qualifiedByInspector',
	getMediaModifyForm: '/reservationOrderQc/appeal/getMediaModifyForm',
	appealModify: '/reservationOrderQc/appeal/modify'
}

/**
 * qrViewInfo 扫码成功后，会返回user_list ,
 * loginWithSign   参数：user_id 
 * getLoginConfig  返回跳转的链接
 */
