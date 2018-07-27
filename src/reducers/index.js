import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';
import authReducers from '../auth/reducers'
import adminUserList from '../adminUser/reducers'
import orderReducers from '../order/reducers'
import reservationReducers from '../reservation/reducers'
import companyDetail from '../companyDetail/reducers'
import invoice from '../invoice/reducers'
import accountUploadReducers from "../accountUpload/reducers";
import loginReducer from '../login/reducer/index'
import withdraw from '../extractCoin/reducers'
import extensionNumber from '../extensionNumber/reducers'
import siderMenuReducer from '../siderMenu/reducers'
import operationslabelReducers from '../operationslabel/reducers'
import saleCRMReducers from "../saleCRM/reducers";
import authorizationsReducers from './authorizations'
import minApp from '../minAppExcel/reducers'
import manage from '../manage/reducers'
import accountEnterReducers from '../accountEnter/reducers'

export default combineReducers({
	routing: routerReducer,
	auth: authReducers,
	...adminUserList,
	orderReducers,
	reservationReducers,
	companyDetail,
	invoice,
	accountUploadReducers,
	loginReducer,
	withdraw,
	extensionNumber,
	siderMenuReducer,
	operationslabelReducers,
	saleCRMReducers,
	authorizationsReducers,
	minApp,
	manage,
	accountEnterReducers
});
