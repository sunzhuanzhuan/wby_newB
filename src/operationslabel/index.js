import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'

import './style.less';

// 懒加载路由级组件
const Operationslabel = lazyLoadComponent(() => import('./containers/Operationslabel'))
const OperationslabelRecycle = lazyLoadComponent(() => import('./containers/OperationslabelRecycle'))
const Blacklist = lazyLoadComponent(() => import('./containers/Blacklist'))
const LabelDetailManualImport = lazyLoadComponent(() => import('./containers/LabelDetailManualImport'))
const LbelRecycleDetails = lazyLoadComponent(() => import('./containers/LbelRecycleDetails'))
const MinApp = lazyLoadComponent(() => import('../minAppExcel/containers/MinApp'))

class OperationslabelIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<Route exact path='/ol/operationslabel' component={Operationslabel} />
				<Route exact path='/ol/OperationslabelRecycle' component={OperationslabelRecycle} />
				<Route path='/ol/blacklist' component={Blacklist} />
				<Route path='/ol/operationslabel/details/:id' component={LabelDetailManualImport} />
				<Route path='/ol/OperationslabelRecycle/details/:id' component={LbelRecycleDetails} />
				<Route exact path='/ol/minAppInformation' component={MinApp} />
			</div>
		);
	}
}

export default OperationslabelIndex;
