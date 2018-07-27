import api from '../../api/index'
import { GET_AUTHORITY_LIST } from "../constants/ActionTypes"
import Interface from "../constants/Interface"

export const getAuthorityList = (state) => (dispatch) => {
	api.get(
		Interface.authority.get + '?app_id=' + state.app_id +
		'&id=' + state.id
	).then((response) => {
		dispatch({
			type: GET_AUTHORITY_LIST,
			payload: {
				userAuthorityList: response.data
			}
		})
	})
}



