import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Statistic } from '../components/company/Statistic'
import CompanySearch from '../components/company/CompanySearch'
import { Button, Form } from 'antd';
import './company.less'

class Company extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}
	render() {
		return (
			<div>
				{/* 顶部 */}
				<header className="saleCRM-company-header">
					<span className="saleCRM-company-header-title">公司列表</span>
					<Button type="primary">添加公司</Button>
					<Button type="primary" className="saleCRM-company-header-addBusiness">添加商机</Button>
				</header>
				{/* 统计 */}
				<Statistic />
				{/* 搜索 */}
				<Form>
					<CompanySearch form={this.props.form} />
				</Form>
			</div>
		)
	}
}

Company.propTypes = {
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
)(Form.create()(Company))

