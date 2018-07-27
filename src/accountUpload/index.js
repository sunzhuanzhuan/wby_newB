import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const ListFrom = lazyLoadComponent(() => import('./containers/index'))


class AccountUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Switch>
				<Route path="/toolbox/account" component={ListFrom} />
			</Switch>
		);
	}
}

export default AccountUpload;
