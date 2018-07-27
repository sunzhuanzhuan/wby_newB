
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
// import { Router, Route, IndexRedirect } from 'react-router';
import store, { history } from './store';
import "babel-polyfill";
//登录login
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './index.less'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import App from './containers/App'
//懒加载
import Order from './order/index'
import AuthRoute from './auth/index'
import ReservationRoute from './reservation/index'
import SaleCRMRoute from './saleCRM/index'
import Detail from './companyDetail/index'
import Invoice from './invoice/index'
import AccountUploadRoute from "./accountUpload/index";
import ExtractCoin from './extractCoin/index'
import OperationslabelRoute from './operationslabel/index'
import ExtensionNumber from './extensionNumber/index'
import ManageRoute from './manage/index'
import LoginSuccess from './loginIndex/index'
import VideoMark from './videomark/index'
import AccountEnter from './accountEnter/index'
//import FormTest from './components/Form/FormTest'

import ErrorIndex from './containers/error'
import Login from './login/container/Login'
//404错误页面



render(
	<LocaleProvider locale={zhCN}>
		<Provider store={store}>
			<BrowserRouter>
				<Switch>
					{/* <Route exact path='/test' component={FormTest} /> */}
					<Route exact path='/' component={Login} />
					<Route path='/login' component={Login} />
					<App history={history}>
						<Switch>
							<Route path='/orderTools' component={Order} />
							<Route path='/toolbox' component={AccountUploadRoute} />
							<Route path='/qc' component={ReservationRoute} />
							<Route path='/auth' component={AuthRoute} />
							<Route path='/manage' component={ManageRoute} />

							<Route path='/detail' component={Detail} />
							<Route path='/freeze' component={Detail} />
							<Route path='/golden' component={Detail} />
							<Route path='/sale' component={SaleCRMRoute} />
							<Route path='/invoice' component={Invoice} />
							<Route path='/contractManage' component={ExtractCoin} />
							<Route path='/extractManage' component={ExtractCoin} />

							<Route path='/ol' component={OperationslabelRoute} />
							<Route path='/extensionNumber' component={ExtensionNumber} />
							<Route path='/loginSuccess' component={LoginSuccess} />
							<Route path='/vm' component={VideoMark} />
							<Route path='/accountEnter' component={AccountEnter} />
							<Route path='/error' component={ErrorIndex} />
							<Redirect to={'/error'} />
						</Switch>
					</App>
				</Switch>
			</BrowserRouter>
		</Provider></LocaleProvider>,
	document.getElementById('root')
)
