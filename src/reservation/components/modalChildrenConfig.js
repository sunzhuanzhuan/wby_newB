import ActiveInspection from '../containers/modalChildren/ActiveInspection'
import Complain from '../containers/modalChildren/Complain'
import AgreeRejectionCheck from '../containers/modalChildren/AgreeRejectionCheck'
import AppealCheck from '../containers/modalChildren/AppealCheck'
import AppealInspection from '../containers/modalChildren/AppealInspection'
import MediaModifyCheck from '../containers/modalChildren/MediaModifyCheck'
import ManagerInspectionCheck from '../containers/modalChildren/ManagerInspectionCheck'
import ManagerInspectionCheckNoPause from '../containers/modalChildren/ManagerInspectionCheckNoPause'
import Appeal from '../containers/modalChildren/Appeal'
import ModifyComplaint from '../containers/modalChildren/ModifyComplaint'
import MediaModify from '../containers/modalChildren/MediaModify'
import RefuseRejection from '../containers/modalChildren/RefuseRejection'
import AppealInspectionUnqualify from '../containers/modalChildren/AppealInspectionUnqualify'
import ManagerInspectionUnquailfy from '../containers/modalChildren/ManagerInspectionUnquailfy'

const modalChildrenConfig = {
	"1": ActiveInspection,
	"3": AppealCheck,
	"4": Complain,
	"5": AppealCheck,
	"6": AgreeRejectionCheck,
	"7": AppealCheck,
	"8": AppealCheck,
	"10": AppealCheck,
	"11": AppealCheck,
	"12": AppealInspection,
	"14": MediaModifyCheck,
	"15": ManagerInspectionCheck,
	"16": MediaModifyCheck,
	"17": ManagerInspectionCheck,
	"18": ManagerInspectionCheck,
	"19": ManagerInspectionCheck,
	"22": ManagerInspectionCheckNoPause,
	"appeal": Appeal,
	"modifyComplaint": ModifyComplaint,
	"mediaModify": MediaModify,
	"refuseRejection": RefuseRejection,
	"appealInspectionUnqualify": AppealInspectionUnqualify,
	"managerInspectionUnquailfy": ManagerInspectionUnquailfy
}
export default modalChildrenConfig
