import { handleActions } from 'redux-actions';
import {
	getData_success
} from '../actions/accountEnterActions'

export const data = handleActions({
	[getData_success]: (state, action) => ({
		...state,
		...action.payload.data
	})
}, {})
