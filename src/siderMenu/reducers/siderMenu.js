import {
	GET_SIDERMENU_AUTH,
	RESET_SIDERMENU_AUTH
} from "../constants/ActionTypes"

export const siderMenuAuth = (state = [], action) => {
	function getSiderMenuAuth(data) {
		let navigation = data.find(item => item.rule === "navigation");
		if (navigation) {
			return navigation.permissions.reduce((a, b) => a.concat(b))
		} else {
			return [{ name: "noPermissions" }]
		}
	}
	switch (action.type) {
		case GET_SIDERMENU_AUTH:
			return getSiderMenuAuth(action.payload.data)
		case RESET_SIDERMENU_AUTH:
			return []
		default:
			return state
	}
}


export const displayConfig = (state = [], action) => {
	function getDisplayConfig(data) {
		let displayConfig = data.find(item => item.type_name === 'display')

		if (displayConfig) {
			return displayConfig.permissions
		} else {
			return { name: "noPermissions" }
		}
	}
	switch (action.type) {
		case GET_SIDERMENU_AUTH:
			return getDisplayConfig(action.payload.data)
		default:
			return state
	}
}