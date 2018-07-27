import React, { Component } from 'react'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import { Select, Row, Col, Button, Table } from 'antd';
import TableFilterContainer from '../../components/TableFilterContainer';
import BatchInput from '../../components/BatchInput';
import * as actions from "../../actions/associateInvoice";

// import { connect } from 'net';
// const TextArea = Input.TextArea
const Option = Select.Option;

class AssociateInvoiceTable extends Component {
	state = {
		loading: false,
		filters: {
			inputID: '',
			pageSize: 50
		},
	}

	// 获取列表数据(传入页数)
	getInvoiceListByParams = async (page = 1) => {
		let { getInvoiceList, detail: { id }, list: { filters } } = this.props;
		filters = JSON.parse(JSON.stringify(filters))
		this.setState({ loading: true })
		await getInvoiceList({ id, ...filters, page });
		this.setState({ loading: false })
	}
	componentWillMount() {
		let { setInvoiceListfilters } = this.props
		this.getInvoiceListByParams()
		setInvoiceListfilters(this.state.filters)
	}

	// 处理id输入(传值)
	changeInputID = (val) => {
		let { filters } = this.state;
		filters.inputID = val || '';
		this.setState({ ...this.state })
	}
	// 设置选中
	onSelectChange = (selectedRowKeys) => {
		let { setInvoiceListSelected } = this.props;
		setInvoiceListSelected(selectedRowKeys)
	}
	// 处理筛选查询
	handleFilter = async () => {
		let { setInvoiceListfilters, getInvoiceList, detail: { id } } = this.props;
		let { filters } = this.state
		filters = JSON.parse(JSON.stringify(filters))
		setInvoiceListfilters(filters)
		this.setState({ loading: true })
		await getInvoiceList({ id, ...this.state.filters, page: 1 })
		this.setState({ loading: false })
	}
	// 选择每页显示数量
	selectLimit = (val) => {
		let { filters } = this.state;
		filters.pageSize = val
		this.setState({ ...this.state })
	}
	rowKeys = (key) => (record) => record[key] || ''
	render() {
		let { selected = [], typeDetail: { columns, key },
			list: { rows, hashMap, page, filters: { pageSize } }, total, detail
		} = this.props;
		let invoice_type = detail['invoice_type_display'] || '';
		let rowSelection = {
			getCheckboxProps: (record) => ({
				disabled: record['invoice_type_display'] != invoice_type
			}),
			selectedRowKeys: selected,
			onChange: this.onSelectChange,
		};
		let pagination = {
			hideOnSinglePage: true,
			onChange: (current) => {
				let { setInvoiceListPage } = this.props
				setInvoiceListPage(current)
				this.getInvoiceListByParams(current)
			},
			total,
			pageSize,
			current: Number(page) || 1
		}
		let data = rows ? rows.map(item => hashMap[item]) : []
		const pageSizeList = [25, 50, 100, 200]
		let { filters } = this.state;
		let { inputID } = filters
		return (
			<div>
				<TableFilterContainer>
					<Row type="flex" justify="start" gutter={16} style={{ padding: '10px 0' }}>
						<Col >每页显示：
						<Select style={{ width: '80px' }}
								defaultValue={pageSizeList[1]}
								onChange={this.selectLimit}
								getPopupContainer={() => document.getElementById('box')}
							>
								{pageSizeList.map(item => <Option key={item} value={item}>{item}</Option>)}
							</Select>
						</Col>
						<BatchInput changeInputID={this.changeInputID} inputID={inputID} />
						<Col>
							<Button type="primary" onClick={this.handleFilter}>查询</Button>
						</Col>
					</Row>
				</TableFilterContainer>
				<Table bordered={true} pagination={pagination}
					rowKey={this.rowKeys(key)} rowSelection={rowSelection}
					columns={columns} dataSource={data}
					loading={this.state.loading}
					size="middle"
				></Table>
			</div >
		)
	}
}
export default connect(
	state => ({
		detail: state.invoice.associateInvoiceDetail,
		list: state.invoice.invoiceList,
		selected: state.invoice.invoiceListSelected,
	}), actions)(AssociateInvoiceTable)
