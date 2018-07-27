import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'


// 懒加载路由级组件
const Reservation = lazyLoadComponent(() => import('./containers/Reservation'))


class ReservationIndex extends Component {
	state = {}
	render() {
		return (
			<div>
				<Route path='/qc/reservation' component={Reservation} />
			</div>
		);
	}
}

export default ReservationIndex;
