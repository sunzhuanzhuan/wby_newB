
import {
	ORDER_EXCEL_LIST, ORDER_TEMP_LIST, TEMP_LIST,
	GET_OPTIONS_SUCCESS
} from '../../constants/ActionTypes'


export const orderList = (state = {}, action) => {
	switch (action.type) {
		case ORDER_EXCEL_LIST:
			return { ...action.payload.excelList }
		default:
			return state
	}
}

export const tempList = (state = [{
	"id": 8,
	"owner_id": 1,
	"template_name": "新模版",
	"describe": "啦啦啦"
}, {
	"id": 9,
	"owner_id": 1,
	"template_name": "test",
	"describe": "testtest",
	"is_default": 1
}], action) => {
	switch (action.type) {
		case ORDER_TEMP_LIST:
			return [...action.payload.tempList]
		case TEMP_LIST:
			return [...action.payload.tempList]
		default:
			return state
	}
}

export const options = (state = {}, action) => {
	switch (action.type) {
		case GET_OPTIONS_SUCCESS:
			return { ...action.payload.data }
		default:
			return state
	}
}
