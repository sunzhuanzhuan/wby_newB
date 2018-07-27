import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Table, Select, DatePicker, Button, Divider } from 'antd';

import * as freezeDetailAction from '../actions/index'
import './detail.less'
const { RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
// const monthFormat = 'YYYY/MM';
let page_size = '';
let created_at_start = '';
let created_at_end = '';
let product_line = '';
let productLineId = ''
let pageCurrent = ''
class FreezeDetail extends Component {
	constructor(props) {
		super(props);
		this.state = ({
			loading: true,
			current: 1
		})
	}
	componentDidMount = async () => {
		this.setState({ loading: true })
		//修改了获取值的方式
		await this.props.actions.getFreezeDetail(this.props.match.params.company_id, product_line, 1, 20, created_at_start, created_at_end);
		//await this.props.actions.getFreezeDetail(this.props.routeParams.company_id, product_line, 1, 20, created_at_start, created_at_end);
		this.setState({ loading: false })
	}
	//选择页码(额度)
	handlePageFreezeDetail(page) {
		pageCurrent = page.current;
		page_size = page.pageSize;
		this.setState({ loading: false, current: pageCurrent })
		//修改了获取值的方式
		this.props.actions.getFreezeDetail(this.props.match.params.company_id, product_line, pageCurrent, page_size, created_at_start, created_at_end);
		//this.props.actions.getFreezeDetail(this.props.routeParams.company_id, product_line, page, page_size, created_at_start, created_at_end);
	}
	//选择时间范围()
	handleDateFlowSucc(value, dateString) {
		created_at_start = dateString[0];
		created_at_end = dateString[1];
	}
	//业务类型
	handleChangeSelect(value) {
		product_line = value
	}
	//流水的查询
	handleQueryFlowSucc = async () => {
		this.setState({ loading: true })
		//修改了获取值的方式

		const company_id = this.props.match.params.company_id
		//const company_id = this.props.routeParams.company_id
		await this.props.actions.getFreezeDetail(company_id, product_line, 1, 20, created_at_start, created_at_end)
		this.setState({ loading: false, current: 1 })
	}
	render() {
		const { billingsList = [], productLine = [], freezeDetail = {} } = this.props;
		const pageFreezeDetailTotal = freezeDetail.total;
		const freezeDetailTitle = [{
			title: '时间',
			dataIndex: 'created_at',
			key: 'created_at',
		}, {
			title: '冻结金额（元）',
			dataIndex: 'freeze_amount',
			key: 'freeze_amount',
		}, {
			title: '业务类型',
			dataIndex: 'product_line_display',
			key: 'product_line_display',
			render: (text, record) => {
				productLineId = record.product_line
				let productLineDisplay = productLine.map(function (item) {
					if (item.id == productLineId) {
						return <span>{item.display}</span>
					}
				})
				return productLineDisplay
			},

		}, {
			title: '业务名称',
			key: 'biz_name',
			dataIndex: 'biz_name',
			render: (text) => {
				if (text != '') {
					return <span>{text}</span>
				} else {
					return <span>-</span>
				}
			}
		}, {
			title: '业务ID',
			dataIndex: 'order_id',
			key: 'order_id',
			render: (text, record) => {
				if (text != 0) {
					return <a target='_blank' href={record.order_link}>{text}</a>
				} else {
					return <span>-</span>
				}
			}
		}];
		const formatProductLine = [];
		for (let i = 0; i < productLine.length; i++) {
			formatProductLine.push(<Option key={i.toString(36) + i} value={productLine[i].id}>{productLine[i].display}</Option>);
		}
		//翻页
		const paginationFreezeDetail = {
			current: this.state.current,
			pageSize: 20,
			total: pageFreezeDetailTotal
		}
		return (
			<div className='sourceRules-box'>
				<fieldset>
					<legend>账户冻结详情</legend>
					<Row>
						<Col span={20}>总计：{freezeDetail.total_amount}元</Col>
					</Row>
					<Divider />
					<Row type="flex" justify="start" gutter={16} style={{ marginBottom: '20px' }}>
						<Col>业务类型：</Col>
						<Col>
							<Select
								style={{ width: 150 }}
								optionFilterProp="children" onChange={this.handleChangeSelect.bind(this)} placeholder='全部'>
								<Option key={125} value={''}>全部</Option>
								{formatProductLine}
							</Select>
						</Col>
						<Col>选择时间： </Col>
						<Col><RangePicker onChange={this.handleDateFlowSucc.bind(this)} format={dateFormat} /></Col>
						<Col>
							<Button type="primary" onClick={this.handleQueryFlowSucc.bind(this)}>查询</Button>
						</Col>
					</Row>
					<Table
						loading={this.state.loading}
						className=''
						dataSource={billingsList}
						columns={freezeDetailTitle}
						pagination={paginationFreezeDetail}
						onChange={this.handlePageFreezeDetail.bind(this)} />
				</fieldset>
			</div>
		)
	}
}


FreezeDetail.propTypes = {
	actions: PropTypes.shape({

	}),

}


const mapStateToProps = (state) => ({
	freezeDetail: state.companyDetail.freezeDetail,
	billingsList: state.companyDetail.freezeDetail.billings,
	productLine: state.companyDetail.freezeDetail.product_line

})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...freezeDetailAction
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FreezeDetail)

