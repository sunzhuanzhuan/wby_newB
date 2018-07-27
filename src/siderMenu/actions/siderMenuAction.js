import api from '../../api/index'
import {
	GET_SIDERMENU_AUTH,
	RESET_SIDERMENU_AUTH
} from "../constants/ActionTypes"

export const getSiderAuth = () => (dispatch) => {
	return api.get('/rbac/getAuthorizations').then((response) => {
		const { data } = response
		dispatch({
			type: GET_SIDERMENU_AUTH,
			payload: {
				data
			}
		})
	})
}
export const resetSiderAuth = () => (dispatch) => {
	dispatch({
		type: RESET_SIDERMENU_AUTH,
		payload: {
			data: []
		}
	})
}
