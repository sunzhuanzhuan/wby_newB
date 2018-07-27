import api from '../../api/index'
import { GET_ROLE_LIST, ADD_ROLE_TYPE, GET_ROLE_AUTHORITY_LIST } from "../constants/ActionTypes"
import { UPDATE_ROLE_TYPE } from "../constants/ActionTypes"
import Interface from "../constants/Interface"

export const getRoleList = (params) => (dispatch) => {
    api.get(Interface.roleUrl.get + "?app_id=" + params.app_id + "&page=" + params.page).then((response) => {
        dispatch({
            type: GET_ROLE_LIST,
            payload: {
                roleList: response.data
            }
        })
    })
}

export const addRole = (Role) => ({
    type: ADD_ROLE_TYPE,
    payload: {
        ...Role
    }
})
export const addRoleAction = (params) => (dispatch) => {
    return api.post(Interface.roleUrl.add, { ...params }).then(response => {
        const { data } = response;
        dispatch(addRole(data));
    })
}

export const updateRole = (Role) => ({
    type: UPDATE_ROLE_TYPE,
    payload: {
        ...Role
    }
})
export const updateRoleAction = (params) => (dispatch) => {
    return api.post(Interface.roleUrl.update, { ...params }).then(response => {
        const { data } = response;
        dispatch(updateRole(data));
    })
}
//增加批量操作
export const addRoleAuthorityAction = (params) => (dispatch) => {
    let arr = [];
    arr.push(...params.role_id)
    params.role_id = arr;
    params.is_return_assignment = 0;
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
            return response
        })
}

