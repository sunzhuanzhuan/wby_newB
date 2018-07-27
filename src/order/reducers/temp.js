import {
	TEMP_LIST,
	DEL_TEMP,
	TEMP_DETAIL,
	TEMP_ALL_DETAIL,
	GET_ORDER_FIELDS_SUCCESS,
	UPDATE_ORDER_FIELDS,
	UPDATE_FIELD_NAME
} from '../../constants/ActionTypes'

export const templateList = (state = [], action) => {
	switch (action.type) {
		case TEMP_LIST:
			return [...action.payload.tempList]
		case DEL_TEMP:
			return [...state.filter((item) => { return item.id !== action.payload.id })]
		// case ADD_TEMP:
		// 	return [action.payload.adddata, ...state]
		default:
			return state
	}
}

export const tempInfo = (state = {}, action) => {
	switch (action.type) {
		case TEMP_DETAIL:
			return action.payload.tempInfo
		case GET_ORDER_FIELDS_SUCCESS:
			return action.payload.data.tempInfo
		case 'clearInfo':
			return {
				template_name: '',
				describe: ''
			}
		default:
			return state
	}
}

export const orderFields = (state = {}, action) => {
	switch (action.type) {
		case GET_ORDER_FIELDS_SUCCESS:
			return action.payload.data.orderFields
		case TEMP_ALL_DETAIL:
			return action.payload.orderFields
		default:
			return state
	}
}
export const orderFieldsByIds = (state = {}, action) => {
	switch (action.type) {
		case TEMP_ALL_DETAIL:
		case GET_ORDER_FIELDS_SUCCESS:
			const { orderFields = {} } = action.payload.data || action.payload;
			const { order = [], account = [], assess = [] } = orderFields;
			return [...order, ...account, ...assess].reduce((obj, product) => {
				obj[product.id] = product
				return obj
			}, {})
		case UPDATE_FIELD_NAME:
			const { id, fieldName } = action.payload;
			const currentField = state[id];

			if (!currentField) {
				return state;
			}
			return {
				...state,
				[id]: {
					...currentField,
					field_name: fieldName
				}
			}
		default:
			return state
	}
}

export const checkedFields = (state = {}, action) => {
	switch (action.type) {
		case GET_ORDER_FIELDS_SUCCESS:
			const _checkedFields = {};
			const { orderFields = {} } = action.payload.data;
			for (const key in orderFields) {
				if (orderFields.hasOwnProperty(key)) {
					_checkedFields[key] = orderFields[key].filter(item => item.checked === true).map(item => item.id)
				}
			}
			return _checkedFields;
		case UPDATE_ORDER_FIELDS:
			const { type, checkedFields } = action.payload;
			return {
				...state,
				[type]: checkedFields
			}
		case "clearCheckedFiled":
			return {
				account: [],
				assess: [],
				order: []
			}
		default:
			return state;
	}
}
