import api from '../../api/index'
import { GET_ROLE_RELATION_LIST } from "../constants/ActionTypes"
import { UPDATE_USER_ROLE_TYPE } from "../constants/ActionTypes"
import Interface from "../constants/Interface"

export const getRoleRelationList = (params) => (dispatch) => {
	if (params.app_id == undefined) {
		params.app_id = ''
	} else if (params.username == undefined) {
		params.username = '';
	}
	api.get(Interface.roleRelationUrl.get + '?app_id=' + params.app_id + '&page=' + params.page + '&user_name=' + params.username)
		.then((response) => {
			dispatch({
				type: GET_ROLE_RELATION_LIST,
				payload: {
					roleRelationList: response.data
				}
			})
		})
}

export const updateRoleRelation = (RoleRelation) => ({
	type: UPDATE_USER_ROLE_TYPE,
	payload: {
		...RoleRelation
	}
})
export const updateRoleRelationAction = (params) => (dispatch) => {
	return api.post(Interface.roleRelationUrl.update, { ...params }).then(response => {
		dispatch(updateRoleRelation(response.data));
	})
}

export const deleteCache = () => () => {
	return api.get('/rbac/resetAuthorizations').then(response => {
		return response
	})
}

