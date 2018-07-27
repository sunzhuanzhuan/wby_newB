import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const AdminUser = lazyLoadComponent(() => import('./containers/AdminUser'))
class AdminUserIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<Route path='/manage/user' component={AdminUser} />
			</div>

		);
	}
}

export default AdminUserIndex;
