// 这是销售CRM公司列表的搜索组件
// 1.新建一个包含全部搜索项的数组
// 2.把传入的下拉框数组与全部搜索项数组合并
// 3.根据可见性过滤数组，留下当前登录用户拥有的搜索项

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class CompanySearch extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}
	render() {
		// const { form } = this.props;
		// 1.新建一个包含全部搜索项的数组
		// const searchArr={
		// 	"company_name": {

		// 	}
		// }
		return (
			<div>

			</div>
		)
	}
}

CompanySearch.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = () => ({


})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({

	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CompanySearch)


