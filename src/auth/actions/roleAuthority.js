import api from '../../api/index'
import { GET_ROLE_AUTHORITY_LIST, TRANSFORM_PERMISSION_ID } from "../constants/ActionTypes"
import Interface from "../constants/Interface"

export const getRoleAuthorityList = (state) => (dispatch) => {
	api.get(
		Interface.roleAuthorityUrl.get + '?id=' + state.id + '&app_id=' + state.app_id
	).then((response) => {
		dispatch({
			type: GET_ROLE_AUTHORITY_LIST,
			payload: {
				roleAuthorityList: response.data
			}
		})
	})
}


export const addRoleAuthorityAction = (params) => (dispatch) => {
	let arr = [];
	arr.push(params.role_id)
	params.role_id = arr;
	params.is_return_assignment = 1;
	return api.post(Interface.roleAuthorityUrl.add, { ...params })
		.then(response => {
			if (response.data) {
				api.get(
					Interface.roleAuthorityUrl.get + '?id=' + params.role_id
				).then((response) => {
					dispatch({
						type: GET_ROLE_AUTHORITY_LIST,
						payload: {
							roleAuthorityList: response.data
						}
					})
				});
			}

		})
}

export const deleteRoleAuthorityAction = (params) => (dispatch) => {
	return api.post(Interface.roleAuthorityUrl.delete, params)
		.then(response => {
			if (response.data) {
				api.get(
					Interface.roleAuthorityUrl.get + '?id=' + params.role_id
				).then((response) => {
					dispatch({
						type: GET_ROLE_AUTHORITY_LIST,
						payload: {
							roleAuthorityList: response.data
						}
					})
				});
			}
		})
}
//传递permissionId
export const transformPermissionId = (permissionId, type) => (dispatch) => {
	dispatch({
		type: TRANSFORM_PERMISSION_ID,
		payload: {
			permissionId, type
		}
	})
}

