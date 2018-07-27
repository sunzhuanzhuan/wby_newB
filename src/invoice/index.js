import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const ContainerForm = lazyLoadComponent(() => import('./containers/ContainerForm'))
const Upload = lazyLoadComponent(() => import('./containers/Upload'))
const ApplyList = lazyLoadComponent(() => import('./containers/ApplyList'))
const CompleteApplyList = lazyLoadComponent(() => import('./containers/CompleteApplyList'))
const InvoiceApplyDetail = lazyLoadComponent(() => import('./containers/invoiceApplyDetail'))
//const modified = lazyLoadComponent(() => import('./containers/modifiedApply'))
const Reparation = lazyLoadComponent(() => import('./containers/reparation'))
const AssociateInvoice = lazyLoadComponent(() => import('./containers/associateInvoice/AssociateInvoice'))
//import modifiedUpload = lazyLoadComponent(() => import('./containers/uploadModified'))
//import newInvoice = lazyLoadComponent(() => import('./containers/newInvoice'))
class Invoice extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<Route path="/invoice/applyList" component={ApplyList}></Route>
				<Route path="/invoice/apply" component={ContainerForm}></Route>
				<Route path="/invoice/upload" component={Upload}></Route>
				<Route path="/invoice/completeApply" component={CompleteApplyList}></Route>
				<Route path='/invoice/applyDetail' component={InvoiceApplyDetail}></Route>
				<Route path="/invoice/reparation" component={Reparation}></Route>
				{/* <Route path="/invoice/editApply" component={modified}></Route>
    <Route path="/invoice/editUpload" component={modifiedUpload}></Route> */}
				<Route path="/invoice/associateInvoice" component={AssociateInvoice}></Route>
				{/* <Route path="/invoice/tan" component={newInvoice}></Route> */}

			</div>
		);
	}
}

export default Invoice;
