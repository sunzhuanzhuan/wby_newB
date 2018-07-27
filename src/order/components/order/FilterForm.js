import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import OrderInquireModal from './OrderInquireModal'
import BatchSearchModal from './BatchSearchModal'
import { Form, Button, Modal, message } from 'antd';
import { FormSelect } from '../customField'
import FormDefaultSelect from '../customField/FormDefaultSelect'
import { FormDate } from '../customField/FormDate'
import { FormInput } from '../customField/FormInput'
import { FormBatchSearch } from '../customField/FormBatchSearch'
import { create } from '../../actions/filterForm'
import { serializeValue, processValue } from '../../util/serializeValue'

import api from '../../../api/index'
import './FilterForm.less'
const FormItem = Form.Item;

// function hasErrors(fieldsError) {
// 	return Object.keys(fieldsError).some(field => fieldsError[field]);
// }

class FilterForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modalType: '',
			count: '0',
			values: {},
			tempList: [],
			disable: false,
			batchSearchKey: '',
			batchSearchValue: ''
		}
	}
	componentWillMount() {
		api.get('/toolbox/order/templateList').then((response) => {
			const { data: { tempList } } = response;
			this.setState({
				tempList: tempList
			})
		})
	}
	componentDidMount() {
		this.props.form.validateFields();
	}
	inquire() {
		this.setState({
			disable: true
		})
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (values['range-picker'] == undefined) {
					values.start_time = "";
					values.end_time = "";
				} else {
					let startdate = values['range-picker'][0]._d;
					values.start_time = startdate.getFullYear() + "-" + (startdate.getMonth() + 1) + "-" + startdate.getDate();
					let enddate = values['range-picker'][1]._d;
					values.end_time = enddate.getFullYear() + "-" + (enddate.getMonth() + 1) + "-" + enddate.getDate();
				}
				delete (values['range-picker']);
				var keyarr = Object.keys(values);
				var valuearr = Object.values(values);
				for (var i = 0; i < valuearr.length; i++) {
					if (valuearr[i] == "0" || valuearr[i] == "" || valuearr[i] == undefined) {
						values[keyarr[i]] = "";
					}
				}
				let submitValues = serializeValue(values)

				api.get('/toolbox/order/filter/count', { params: { ...submitValues } }).then((response) => {
					if (response.data.count == 0) {
						this.setState({
							disable: false
						})
						message.error('查询结果为空');
					} else {
						const { data: { count } } = response;
						this.setState({
							count: count,
							values: { ...values },
							disable: false
						})
						this.showModal('OrderInquireModal')
					}
				})
			}
		});
	}
	export() {
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (values['range-picker'] == undefined) {
					values.start_time = "";
					values.end_time = "";
				} else {
					let startdate = values['range-picker'][0]._d;
					values.start_time = startdate.getFullYear() + "-" + (startdate.getMonth() + 1) + "-" + startdate.getDate();
					let enddate = values['range-picker'][1]._d;
					values.end_time = enddate.getFullYear() + "-" + (enddate.getMonth() + 1) + "-" + enddate.getDate();
				}
				delete (values['range-picker']);
				var keyarr = Object.keys(values);
				var valuearr = Object.values(values);
				for (var i = 0; i < valuearr.length; i++) {
					if (valuearr[i] == "0" || valuearr[i] == "" || valuearr[i] == undefined) {
						values[keyarr[i]] = "";
					}
				}

				let submitValues = serializeValue(values)

				api.get('/toolbox/order/filter/downCompleteData', {
					params: { ...submitValues }
				}).then(() => {
					Modal.success({
						title: '申请成功，系统正在导出！',
						content: '请10分钟后在“订单列表”页面下载数据！',
						onOk: function () {
							//browserHistory.push('/orderTools/orderList')
							//修改了push的方式
							this.props.history.push('/orderTools/orderList')
						}.bind(this)
					});
				})
			}
		});
	}
	// 查询结果弹框
	showModal(modalType) {
		this.setState({
			modalType
		})
	}
	closeModal() {
		this.showModal('')
		this.form.resetFields()
	}
	onCreate(values) {
		let nowValues = { ...values, ...this.state.values };
		let submitValues = serializeValue(nowValues);

		this.props.actions.create(submitValues).then(() => {
			Modal.success({
				title: '下载申请已提交，系统正在导出',
				content: '请10分钟后在"下载列表"页面下载数据',
				okText: '确认',
				onOk: function () {
					//修改了push的方式
					this.props.history.push('/orderTools/orderList')
					//browserHistory.push('/orderTools/orderList')
				}.bind(this)
			});
		})
	}
	setBatchSearchKey(batchSearchKey) {
		this.setState({
			batchSearchKey
		})
	}
	setBatchSearchValue(key, value) {
		this.setState({
			batchSearchValue: processValue(value)
		})

		this.props.form.setFieldsValue({
			[key]: processValue(value)
		})
		this.showModal()
	}
	batchSearchValueChange(e) {
		this.setState({
			batchSearchValue: e.target.value
		})
		return e.target.value
	}
	resetBatchSearchValue(key) {
		this.setState({
			batchSearchValue: ''
		})
		this.props.form.setFieldsValue({
			[key]: ''
		})
	}
	// 查询结果弹框结束
	render() {
		const { customField, form } = this.props;
		// const { getFieldsError, getFieldDecorator } = form;
		return (
			<div>
				<Form layout="inline">
					{customField.map(item => {
						if (item.type == 'select') {
							return <FormSelect form={form} key={item.name} {...item} />
						} else if (item.type == 'dateSelect') {
							return <FormDate form={form} key={item.name} {...item} />
						} else if (item.type == 'input') {
							return <FormInput form={form} key={item.name} {...item}></FormInput>
						} else if (item.type == 'defaultSelect') {
							return <FormDefaultSelect form={form} key={item.name} {...item} />
						} else if (item.type == 'batch_search') {
							return <FormBatchSearch
								form={form}
								key={item.name}
								showModal={this.showModal.bind(this)}
								setBatchSearchKey={this.setBatchSearchKey.bind(this)}
								resetBatchSearchValue={this.resetBatchSearchValue.bind(this)}
								batchSearchValue={this.state.batchSearchValue}
								batchSearchValueChange={this.batchSearchValueChange.bind(this)}
								{...item}
							/>
						}
					})}

					<div className='action-container'>
						<FormItem>
							<Button
								type="primary"
								// disabled={hasErrors(getFieldsError())}
								onClick={this.inquire.bind(this)}
								disabled={this.state.disable}
							>查询</Button>
							<Button
								type="primary"
								className="FilterForm_derive"
								// disabled={hasErrors(getFieldsError())}
								onClick={this.export.bind(this)}
								disabled={this.state.disable}
							>导出完成数据</Button>
						</FormItem>
					</div>
				</Form>
				<OrderInquireModal
					title='查询结果'
					onCreate={this.onCreate.bind(this)}
					onCancel={this.closeModal.bind(this)}
					visible={this.state.modalType == 'OrderInquireModal'}
					count={this.state.count}
					values={this.state.values}
					tempList={this.state.tempList}
					ref={form => this.form = form}
				/>

				<BatchSearchModal
					title='批量输入PO单号'
					batchSearchKey={this.state.batchSearchKey}
					batchValue={this.state.batchSearchValue}
					visible={this.state.modalType === 'batchSearch'}
					onOk={this.setBatchSearchValue.bind(this)}
					onCancel={this.closeModal.bind(this)}
				/>


			</div>
		);
	}
}
FilterForm.propTypes = {
	actions: PropTypes.shape({

	}),

}
const mapStateToProps = () => ({

})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		create
	}, dispatch)
})


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(withRouter(FilterForm)));
