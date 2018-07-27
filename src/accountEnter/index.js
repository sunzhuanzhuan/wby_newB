import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import lazyLoadComponent from 'lazy-load-component'


// 懒加载路由级组件
const AccountEnter = lazyLoadComponent(() => import('./containers/AccountEnter'))


class AccountEnterIndex extends Component {
	state = {}
	render() {
		return (
			<div>
				<Route path='/accountEnter/detail' component={AccountEnter} />
			</div>
		);
	}
}

export default AccountEnterIndex;
