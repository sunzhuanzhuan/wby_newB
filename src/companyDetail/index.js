import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const data = lazyLoadComponent(() => import('./containers/data'))
const freezeDetail = lazyLoadComponent(() => import('./containers/FreezeDetail'))
const golden = lazyLoadComponent(() => import('./containers/GoldenDetail'))
// import SourceType from './containers/SourceType'
// import Sources from './containers/Sources'
// import NavType from './containers/NavType'
// import Nav from './containers/Nav'
// import NavGroup from './containers/NavGroup'
// import Roles from './containers/Roles'
// import Authority from './containers/Authority'
// import RoleRelation from './containers/RoleRelation'

class Company extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<dic>
				<Route path='/detail/company' component={data} />
				<Route path='/freeze/detail/:company_id' component={freezeDetail} />
				<Route path='/golden/detail/:company_id' component={golden} />
			</dic>
		);
	}
}

export default Company;
