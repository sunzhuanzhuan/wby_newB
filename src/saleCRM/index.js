import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'


// 懒加载路由级组件
// const MainBody = lazyLoadComponent(() => import('./containers/MainBody'))
// const Company = lazyLoadComponent(() => import('./containers/Company'))
// const CompanyDetail = lazyLoadComponent(() => import('./containers/CompanyDetail'))
const BusinessOpportunity = lazyLoadComponent(() => import('./containers/BusinessOpportunity'))
const BusinessOpportunityDetail = lazyLoadComponent(() => import('./containers/BusinessOpportunityDetail'))
const BusinessEdit = lazyLoadComponent(() => import('./containers/BusinessEdit'))

class SaleCRMIndex extends Component {
	state = {}
	render() {
		return (
			<div>
				{/* <Route path='/sale/mainBody' component={MainBody} />
				<Route exact path='/sale/company' component={Company} />
				<Route path='/sale/company/detail' component={CompanyDetail} /> */}
				<Route exact path='/sale/businessOpportunity' component={BusinessOpportunity} />
				<Route exact path='/sale/businessOpportunity/add' component={BusinessEdit} />
				<Route exact path='/sale/businessOpportunity/detail' component={BusinessOpportunityDetail} />

			</div>
		);
	}
}

export default SaleCRMIndex;
