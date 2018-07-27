import { combineReducers } from 'redux'
import * as business from './business'

export default combineReducers({
	...business
})
