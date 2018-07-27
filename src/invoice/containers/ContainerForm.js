import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as invoiceApply from '../actions/invoiceApply'
import './createdApplyList.less'
import Apply from './CreateApplyList'
import qs from "qs";
class List extends Component {
	constructor(props) {
		super(props)
		this.state = ({
			//公司id
			comp_id: '',
			data: {},
			applyType: '',
			//发票申请单ID
			id: ''
		})
	}
	componentWillMount() {
		// this.setState({ comp_id: this.props.location.query.company_id, applyType: this.props.location.query.applyType });

		// if (this.props.location.query.applyType == undefined) { this.setState({ data: {} }) }
		// if ((this.props.location.query.applyType == 2) || (this.props.location.query.applyType == 3)) {
		// 	this.props.actions.modifiyInvoiceSucc(this.props.location.query.id).then((response) => {
		// 		this.setState({ data: response.data, id: this.props.location.query.id })
		// 	})
		// 	//console.log(response.data.contract_scanning_copy)

		// }
		//修改了获取值的方式
		const search = qs.parse(this.props.location.search.substring(1))
		this.setState({ comp_id: search.company_id, applyType: search.applyType });

		if (search.applyType == undefined) { this.setState({ data: {} }) }
		if ((search.applyType == 2) || (search.applyType == 3)) {
			this.props.actions.modifiyInvoiceSucc(search.id).then((response) => {
				this.setState({ data: response.data, id: search.id })
			})
			//console.log(response.data.contract_scanning_copy)

		}
	}
	render() {
		//修改了获取值的方式
		const search = qs.parse(this.props.location.search.substring(1))
		return (
			<div>
				{this.state.applyType != undefined ? Object.keys(this.state.data).length == 0 ? null : <Apply
					comp_id={this.state.comp_id}
					applyType={this.state.applyType}
					data={this.state.data}
					id={this.state.id}
					//return={this.props.location.query.return}
					return={search.return}
				/>
					: <Apply
						comp_id={this.state.comp_id}
						applyType={this.state.applyType}
						data={this.state.data}
						id={this.state.id}
						//return={this.props.location.query.return}
						return={search.return}
					/>}

			</div>)
	}
}
const mapStateToProps = (state) => ({
	corpInfo: state.invoice.companyInfo.data,
	meta: state.invoice.getMeta,
	countInfo: state.invoice.getCountInfo,
	token: state.invoice.getToken,
	modifiedFormData: state.invoice.modifiedForm

})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...invoiceApply
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(List)
