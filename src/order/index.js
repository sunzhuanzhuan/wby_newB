import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const OrderList = lazyLoadComponent(() => import('./containers/order/OrderList'))
const TempList = lazyLoadComponent(() => import('./containers/order/TempList'))
const EditField = lazyLoadComponent(() => import('./containers/order/EditField'))
const FilterExport = lazyLoadComponent(() => import('./containers/order/FilterExport'))


class Order extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<Route path='/orderTools/orderList' component={OrderList} />
				<Route path='/orderTools/tempList' component={TempList} />
				<Route path='/orderTools/editField' component={EditField} />
				<Route path='/orderTools/filterExport' component={FilterExport} />

			</div>
		);
	}
}

export default Order;
