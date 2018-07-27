import { combineReducers } from 'redux'
import {
	reservationList,
	role_id,
	MediaUsers,
	VolUsers,
	PlatformList,
	QcStatusList,
	activeInspectionData,
	complainData,
	agreeRejectionCheckData,
	appealCheckData,
	appealInspectionData,
	mediaModifyCheckData,
	managerInspectionCheckData,
	mediaAppealWaive,
	appealForm,
	modifyComplainData,
	historyData,
	appealUnquilfyReasons,
	managerInspectionUnquilfyData,
	mediaModifyForm
} from './reservation'
import readyonlyaction from './readyonlyaction'

export default combineReducers({
	reservationList,
	MediaUsers,
	PlatformList,
	VolUsers,
	QcStatusList,
	readyonlyaction,
	role_id,
	activeInspectionData,
	complainData,
	agreeRejectionCheckData,
	appealCheckData,
	appealInspectionData,
	mediaModifyCheckData,
	managerInspectionCheckData,
	mediaAppealWaive,
	appealForm,
	modifyComplainData,
	historyData,
	appealUnquilfyReasons,
	managerInspectionUnquilfyData,
	mediaModifyForm
})
