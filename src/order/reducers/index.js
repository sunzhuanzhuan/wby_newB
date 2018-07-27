import { combineReducers } from 'redux'
import { filedList, filedAmendDetail } from './fieldEdit'
import { templateList, tempInfo, orderFields, orderFieldsByIds, checkedFields } from './temp'
import { orderList, tempList, options } from './order'

export default combineReducers({
	orderList,
	filedList,
	filedAmendDetail,
	tempList,
	templateList,
	options,
	tempInfo,
	orderFields,
	orderFieldsByIds,
	checkedFields
})
