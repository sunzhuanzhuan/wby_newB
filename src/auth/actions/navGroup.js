import api from "../../api/index";
import { GET_NAVGROUP_LIST, ADD_NAVGROUP, DELETE_NAVGROUP } from "../constants/ActionTypes";
import { UPDATE_NAVGROUP } from "../constants/ActionTypes";
import Interface from "../constants/Interface"

export const getNavGroupList = (state) => (dispatch) => {
	api.get(Interface.navGroupUrl.get + '?app_id=' + state.app_id + '&id=' + state.id)
		.then((response) => {
			dispatch({
				type: GET_NAVGROUP_LIST,
				payload: {
					navGroupList: response.data.navigationCombinations
				}
			})
		})
}


export const addNavigationCombinations = (Nav) => ({
	type: ADD_NAVGROUP,
	payload: {
		...Nav
	}
})
export const addNavigationCombinationsAction = (params) => (dispatch) => {
	return api.post(Interface.navGroupUrl.add, { ...params })
		.then(response => {
			dispatch(addNavigationCombinations(response.data));
			return response
		})
}

export const updateNavigationCombinations = (Nav) => ({
	type: UPDATE_NAVGROUP,
	payload: {
		...Nav
	}
})
export const updateNavigationCombinationsAction = (params) => (dispatch) => {
	return api.post(Interface.navGroupUrl.update + '?id=' + params.id, { sort_priority: params.sort_priority })
		.then(response => {
			dispatch(updateNavigationCombinations(response.data));
		})
}

export const deleteNavigation = (Nav) => ({
	type: DELETE_NAVGROUP,
	payload: {
		...Nav
	}
})
export const deleteNavigationAction = (id) => (dispatch) => {
	return api.post(Interface.navGroupUrl.delete + '?id=' + id)
		.then(response => {
			dispatch(deleteNavigation(response.data));
			return response
		})
}

