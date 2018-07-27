import { getAuthorizations_success } from '../actions'
import { combineReducers } from 'redux'
// import { handleAction, handleActions, combineActions } from 'redux-actions';
import { handleAction, handleActions } from 'redux-actions';

const filterAuthorizations = (data, rule) => {
	return data.find(item => item.rule === rule)
}
const getAuthVisible = (data) => {
	let authVisible = filterAuthorizations(data, 'bool');
	if (authVisible) {
		return authVisible.permissions;
	} else {
		return {}
	}
}

const getSiderMenuAuth = (data) => {
	let navigation = filterAuthorizations(data, 'navigation');
	if (navigation) {
		return navigation.permissions.reduce((a, b) => a.concat(b))
	} else {
		return [{ name: "noPermissions" }]
	}
}


export const authVisibleList = handleAction(getAuthorizations_success, (state, action) => {
	return getAuthVisible(action.payload.data)
}, {})


export const siderMenuAuth = handleActions({
	'RESET_SIDERMENU_AUTH': (state, action) => {
		return action.payload.data
	},
	getAuthorizations_success: (state, action) => {
		return getSiderMenuAuth(action.payload.data)
	}
}, [])


export default combineReducers({
	authVisibleList,
	siderMenuAuth
})
