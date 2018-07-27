import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { message } from 'antd'
import lazyLoadComponent from '../components/LazyLoadComponent'
import './moduleCommon.less'

import moment from 'moment';
import 'moment/locale/zh-cn';
import numeral from 'numeral';
import 'numeral/locales/chs';

numeral.locale('chs')
moment.locale('zh-cn');

message.config({
	top: 24,
	maxCount: 3,
});

// 懒加载路由级组件
const ImportNumber = lazyLoadComponent(() => import('./containers/sellerAndAE/ImportNumber'))
const SelectNumber = lazyLoadComponent(() => import('./containers/sellerAndAE/SelectNumber'))
const MyDemandHistory = lazyLoadComponent(() => import('./containers/sellerAndAE/MyDemandHistory'))
const AllocateTask = lazyLoadComponent(() => import('./containers/media/AllocateTask'))
const FixTask = lazyLoadComponent(() => import('./containers/media/FixTask'))
const MainAllocate = lazyLoadComponent(() => import('./containers/media/MainAllocate'))
const UsualExtend = lazyLoadComponent(() => import('./containers/media/UsualExtend'))
const Admin = lazyLoadComponent(() => import('./containers/admin/Admin'))


class ExtensionNumber extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<Route path="/extensionNumber/seller/import" component={ImportNumber} />
				<Route path="/extensionNumber/seller/select" component={SelectNumber} />
				<Route path="/extensionNumber/seller/demandHistory" component={MyDemandHistory} />
				<Route path="/extensionNumber/media/allocateTask" component={AllocateTask} />
				<Route path="/extensionNumber/media/fixTask" component={FixTask} />
				<Route path="/extensionNumber/media/mainAllocate" component={MainAllocate} />
				<Route path="/extensionNumber/media/usualExtend" component={UsualExtend} />
				<Route path="/extensionNumber/admin/admin" component={Admin} />

			</div>
		);
	}
}

export default ExtensionNumber;
