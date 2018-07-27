import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AccountFlow from './accountFlow'
import AccountDetail from './AccountDetail'
import qs from "qs";

class companyDetail extends Component {
	constructor(props) {
		super(props);
		//修改了获取值的方式
		const search = qs.parse(props.location.search.substring(1))
		this.state = ({
			company_id: search.company_id
		})
	}
	componentDidMount() {
		// console.log(123)
		//console.log(this.props.location.query.company_id)
		//this.props.actions.goldenDataAction.getGoldenList()
	}
	render() {
		return (
			<div>
				<AccountDetail id={this.state.company_id}></AccountDetail>
				<AccountFlow id={this.state.company_id}></AccountFlow>
			</div>
		)
	}
}

companyDetail.propTypes = {

}

const mapStateToProps = (/*state*/) => ({

})

const mapDispatchToProps = (/* dispatch */) => ({

})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(companyDetail)
