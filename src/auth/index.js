import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const SourceRules = lazyLoadComponent(() => import('./containers/SourceRules'))
const SourceType = lazyLoadComponent(() => import('./containers/SourceType'))
const Sources = lazyLoadComponent(() => import('./containers/Sources'))
const NavType = lazyLoadComponent(() => import('./containers/NavType'))
const Nav = lazyLoadComponent(() => import('./containers/Nav'))
const NavGroup = lazyLoadComponent(() => import('./containers/NavGroup'))
const Roles = lazyLoadComponent(() => import('./containers/Roles'))
const Authority = lazyLoadComponent(() => import('./containers/Authority'))
const RoleRelation = lazyLoadComponent(() => import('./containers/RoleRelation'))
const RoleAuthority = lazyLoadComponent(() => import("./containers/RoleAuthority"))


class Auth extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<Route path='/auth/sourceRules' component={SourceRules} />
				<Route path='/auth/sourceType' component={SourceType} />
				<Route path='/auth/sources' component={Sources} />
				<Route path='/auth/navType' component={NavType} />
				<Route path='/auth/nav' component={Nav} />
				<Route path='/auth/navGroup' component={NavGroup} />
				<Route path='/auth/roles' component={Roles} />
				<Route path='/auth/roleAuthority' component={RoleAuthority} />
				<Route path='/auth/authority' component={Authority} />
				<Route path='/auth/roleRelation' component={RoleRelation} />

			</div>
		);
	}
}

export default Auth;
