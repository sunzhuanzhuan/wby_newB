import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const Branch = lazyLoadComponent(() => import('./containers/Branch'))
const Job = lazyLoadComponent(() => import('./containers/Job'))
const JobType = lazyLoadComponent(() => import('./containers/JobType'))
const Authority = lazyLoadComponent(() => import('./containers/Look'))


const AdminUser = lazyLoadComponent(() => import("../adminUser/containers/AdminUser"))
const LookPermission = lazyLoadComponent(() => import("../adminUser/containers/LookPermission"))
class Auth extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			< div >
				<Route path='/manage/branch' component={Branch} />
				<Route path='/manage/job' component={Job} />
				<Route path='/manage/jobType' component={JobType} />
				<Route path='/manage/authority' component={Authority} />
				<Route path='/manage/user' component={AdminUser} />
				<Route path='/manage/lookPermission' component={LookPermission} />
			</div>
		);
	}
}

export default Auth;
