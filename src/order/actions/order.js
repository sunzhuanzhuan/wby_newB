import api from '../../api/index'
import { ORDER_EXCEL_LIST, ORDER_TEMP_LIST, GET_OPTIONS_SUCCESS } from "../../constants/ActionTypes";
import { sortSelectOptions } from '../util/sortSelectOptions';

export const getList = (params) => (dispatch) => {
	return api.get('/toolbox/order/excelList', { params }).then((response) => {
		const { data: { excelList } } = response;
		dispatch({
			type: ORDER_EXCEL_LIST,
			payload: {
				excelList
			}
		})
	})
}

export const getTempList = () => (dispatch) => {
	return api.get('/toolbox/order/templateList').then((response) => {
		const { data: { tempList } } = response;
		dispatch({
			type: ORDER_TEMP_LIST,
			payload: {
				tempList: tempList
			}
		})
		return tempList;
	})
}


const zipArray = (object, key, value) => {

	const _options = [];
	if (Object.prototype.toString.call(object) !== '[object Array]') {
		for (const id in object) {
			if (object.hasOwnProperty(id)) {
				const name = object[id];
				_options.push({ [key]: id, [value]: name })
			}
		}
	} else {
		_options.concat(object)
	}
	return _options;
}

export const getOptions = () => (dispatch) => {
	return api.get('/toolbox/order/options').then((response) => {
		const { data: { options } } = response;

		for (const key in options) {
			if (options.hasOwnProperty(key)) {

				const element = options[key];
				options[key] = zipArray(element, 'id', 'name')

				key === 'execution_status'
					? options[key] = sortSelectOptions(options[key])
					: '';
			}
		}
		dispatch({
			type: GET_OPTIONS_SUCCESS,
			payload: {
				data: options
			}
		})
		return options;
	})
}

