import React, { Component } from 'react'
import { Select, Row, Col, Input, Icon, Button, Spin, Modal, DatePicker, Form } from 'antd';
import { connect } from 'react-redux'
import * as actions from '../actions/completeApply';
// import { Button } from 'antd/lib/radio';
const { RangePicker } = DatePicker;
const TextArea = Input.TextArea
const Option = Select.Option;

class tableFilter extends Component {
	state = {
		filters: {
			selectBrands: [],
			selectProject: [],
			inputID: '',
			pageSize: 50
		},
		brandLoading: false,
		projectLoading: false,
		showBatchModal: false,
		batchText: ''
	}
	constructor(props) {
		super(props)
	}
	componentWillMount() {
		let { setTablefilters, tabType } = this.props;
		setTablefilters(tabType, this.state.filters)
	}
	// 选择每页显示数量
	selectLimit = (val) => {
		let { filters } = this.state;
		filters.pageSize = val
		this.setState({ ...this.state })
	}
	// 获取品牌/项目列表
	getBrandAndProjectDate = async type => {
		let { brandAndProjectList: { brands, projects } } = this.props;
		let { getBrandList, getProjectList } = this.props;

		if (type === 'brand' && brands.length <= 0) {
			this.setState({ brandLoading: true })
			await getBrandList()
			this.setState({ brandLoading: false })
		} else if (type === 'project' && projects.length <= 0) {
			this.setState({ projectLoading: true })
			await getProjectList()
			this.setState({ projectLoading: false })
		}
	}
	// 处理选中品牌/项目选中
	handleBrandSelected = (keys) => {
		let { filters } = this.state;
		filters.selectBrands = keys
		this.setState({ ...this.state })
	}
	handleProjectSelected = (keys) => {
		let { filters } = this.state;
		filters.selectProject = keys
		this.setState({ ...this.state })
	}
	// 处理id输入(传值)
	changeInputID = (val) => {
		let { filters } = this.state;
		filters.inputID = val || '';
		this.setState({ ...this.state })
	}
	// 处理批量输入
	handleBatchId = () => {
		let { batchText } = this.state
		const reg = /\b(\d)+\b/g
		let ary = batchText.match(reg);
		if (ary) this.changeInputID(ary.toString())
		this.setState({ ...this.state, batchText: '', showBatchModal: false });
	}
	// 处理筛选查询
	handleFilter = async () => {
		let { setTablefilters, tabType, getOrderList, tableLoaing } = this.props;
		// action 请求action
		let values = {};
		this.props.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			if (fieldsValue['settle_time']) {
				let rangeValue = fieldsValue['settle_time'];
				values = {
					'time_start': rangeValue.length > 0 ? rangeValue[0].format('YYYY-MM-DD') : '',
					'time_end': rangeValue.length > 0 ? rangeValue[1].format('YYYY-MM-DD') : ''
				};
			}
		});
		let { filters } = this.state
		filters = JSON.parse(JSON.stringify(filters))
		setTablefilters(tabType, filters)
		tableLoaing(true)
		await getOrderList({ tabType, ...filters, page: 1, id: this.props.id, ...values })
		tableLoaing(false)
	}
	render() {
		const pageSizeList = [25, 50, 100, 200]
		let { getFieldDecorator } = this.props.form;
		let { brandAndProjectList: { brands, projects }, tabType } = this.props;
		let { brandLoading, projectLoading, filters } = this.state;
		let { inputID, selectBrands, selectProject, pageSize } = filters
		const suffix = inputID ? <Icon type="close-circle" style={{ opacity: '.5' }}
			onClick={() => { this.changeInputID('') }} /> : null;
		return (
			<haeder className='table-top-filter' >
				<Row type="flex" justify="start" gutter={16} style={{ padding: '10px 0' }}>
					<Col >
						每页显示：
						<Select style={{ width: '80px' }}
							defaultValue={pageSize}
							onChange={this.selectLimit}
							getPopupContainer={() => document.getElementById('box')}
						>
							{pageSizeList.map(item => <Option key={item} value={item}>{item}</Option>)}
						</Select>
					</Col>
					{tabType === 'weibo' ? null : <Col>
						<div className='brand-select' style={{ height: '52px' }} >
							<Select
								value={selectBrands}
								ref={node => this.brandSelect = node}
								mode="multiple"
								style={{ width: '160px' }}
								placeholder="所属品牌"
								allowClear
								showSearch
								getPopupContainer={() => document.getElementById('box')}
								filterOption={(input, option) => (
									option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								)}
								onChange={this.handleBrandSelected}
								onFocus={() => { this.getBrandAndProjectDate('brand') }}
								notFoundContent={brandLoading ? <Spin size="small" /> : null}
							>
								{
									brands.map(({ id, view_name }) => (<Option key={id}>{view_name}</Option>))
								}
							</Select>
						</div>
					</Col>}
					{tabType === 'weibo' ? null : <Col>
						<div className='brand-select'>
							<Select
								mode="multiple"
								style={{ width: '160px' }}
								value={selectProject}
								placeholder="所属项目"
								allowClear
								getPopupContainer={() => document.getElementById('box')}
								filterOption={(input, option) => (
									option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								)}
								onChange={this.handleProjectSelected}
								onFocus={() => { this.getBrandAndProjectDate('project') }}
								notFoundContent={projectLoading ? <Spin size="small" /> : null}
							// maxTagCount={1}
							// maxTagPlaceholder={'...'}
							>
								{
									projects.map(({ id, name }) => (<Option key={id}>{name}</Option>))
								}
							</Select>
						</div>
					</Col>}
					<Col>
						<Input style={{ width: '220px' }}
							placeholder='订单/活动ID'
							suffix={suffix}
							value={inputID}
							onChange={e => { this.changeInputID(e.target.value) }}
							ref={node => this.idInput = node}
							addonAfter={<a onClick={() => { this.setState({ showBatchModal: true }) }}>批量</a>}
						/>
					</Col>
					{(tabType === 'reservation' || tabType === 'business') && this.props.type === 5 ? <Col>
						{getFieldDecorator('settle_time')(<RangePicker format={'YYYY-MM-DD'} placeholder={['结算开始日期', '结算结束日期']} />)}
					</Col> : (tabType === 'activity' || tabType === 'weibo') && this.props.type === 5 ? <Col>
						{getFieldDecorator('settle_time')(<RangePicker format={'YYYY-MM-DD'} placeholder={['创建开始日期', '创建结束日期']} />)}
					</Col> : null}
					<Col>
						<Button type="primary" onClick={this.handleFilter}>查询</Button>
					</Col>
				</Row>
				<Modal
					title="批量输入查询ID"
					visible={this.state.showBatchModal}
					onOk={this.handleBatchId}
					onCancel={() => {
						this.setState({ showBatchModal: false })
					}}
					bodyStyle={{ padding: '16px' }}
				>
					<p>每一行输入一个ID</p>
					<TextArea
						value={this.state.batchText}
						placeholder={`100021\n100022`}
						autosize={{ minRows: 4, maxRows: 6 }}

						onInput={(e) => {
							this.setState({ batchText: e.target.value })
						}}
					/>
				</Modal>
			</haeder >
		)
	}
}
const TableFilter = Form.create({})(tableFilter);
export default connect(state => ({ ...state.invoice }), actions)(TableFilter)
