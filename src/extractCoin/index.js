import React, { Component } from 'react';
import { Route } from "react-router-dom";
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const contractManage = lazyLoadComponent(() => import("./containers/contractManage"))
const addContract = lazyLoadComponent(() => import("./containers/addContract"))
const addOrder = lazyLoadComponent(() => import("./containers/addOrder"))
const extractManage = lazyLoadComponent(() => import("./containers/extractManage"))
const applyDetail = lazyLoadComponent(() => import("./containers/applyDetail"))

class ExtractConin extends Component {
	state = {}
	render() {
		return (
			<div>
				<Route exact path="/contractManage" component={contractManage} />
				<Route path="/contractManage/addContract" component={addContract} />
				<Route path="/contractManage/addOrder" component={addOrder} />
				<Route exact path="/extractManage" component={extractManage} />
				<Route path="/extractManage/applyDetail" component={applyDetail} />
			</div>
		);
	}
}

export default ExtractConin;
