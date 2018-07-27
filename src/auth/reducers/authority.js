import { GET_AUTHORITY_LIST } from "../constants/ActionTypes"

export const userAuthorityList = (state = [], action) => {
	switch (action.type) {
		case GET_AUTHORITY_LIST:
			if (action.payload.userAuthorityList.assignments) {
				return [...action.payload.userAuthorityList.assignments]
			} else {
				return []
			}

		default:
			return state
	}
}