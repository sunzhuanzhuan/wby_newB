import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Form, Input, Button, Modal, notification, Icon, Col, Row, message } from 'antd';
// import { Link } from 'react-router'

import * as accountDetailAction from '../actions/index'
import './detail.less'

const FormItem = Form.Item;
// const Option = Select.Option;
// const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
let moneyDiffer = '';
class UpdateCase extends Component {
	constructor(props) {
		super(props)
		this.state = ({
			visibleConfirm: false,
			visible: false,
			isShow: 'none',
			isGreen: 'none',
			isRed: 'none',
			money: '',
			formDate: {},
			isDisable: false
		})
	}
	componentDidMount() {
		this.props.actions.getCoffersList(this.props.company_id);
	}
	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			values.company_id = this.props.company_id
			if (!err) {
				this.setState({
					formDate: values
				})
				this.setState({
					visibleConfirm: true
				})
			}
		});
	}
	handleGetNumber(e) {
		let value = e.target.value;
		if (value != "") {
			let coffers_amount = this.props.coffersList.coffers_amount;
			if ((value - coffers_amount) < 0) {
				let cha = value - coffers_amount + "";
				let differ = cha.split('');
				differ.shift();
				moneyDiffer = differ.join('');
				this.setState({
					isGreen: 'block',
					isRed: 'none',
					money: moneyDiffer
				})
			} else {
				this.setState({
					isRed: 'block',
					isGreen: 'none',
					money: value - coffers_amount
				})
			}
		}
	}
	validateToNextPassword(rule, value, callback) {
		if (/^([1-9]\d*|0)(\.\d{1,2})?$/.test(value)) {
			callback();
		} else {
			callback('调整后的额度必须为小数位不超过2位的正数');
		}
	}
	//打开另一个弹窗,提交
	handlePush() {
		this.props.form.validateFieldsAndScroll((err, values) => {
			// console.log(values)
			let coffers_amount = this.props.coffersList.coffers_amount;
			let value = values.after_cost;
			if ((value - coffers_amount) < 0) {
				let cha = value - coffers_amount + "";
				let differ = cha.split('');
				differ.shift();
				moneyDiffer = differ.join('');
				this.setState({
					isGreen: 'block',
					isRed: 'none',
					money: moneyDiffer
				})
			} else {
				this.setState({
					isRed: 'block',
					isGreen: 'none',
					money: value - coffers_amount
				})
			}
			if (!err) {
				this.setState({
					visibleConfirm: true
				})
			}
		})
	}
	handleNoPush() {
		this.props.handleNoPush()
		this.props.form.resetFields()
	}
	//确认提交
	handleOk() {
		this.setState({ isDisable: true })
		this.props.actions.getEduModified(this.state.formDate).then((response) => {
			if (response.data.code == 1000) {
				notification.open({
					message: '提交成功',
					icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
				});
				this.setState({
					visibleConfirm: false
				});
				this.props.handleNoPush();
				moneyDiffer = ''
				this.props.getList()
			} else {
				message.error(response.message)
			}
		});

	}
	//取消提交
	handleCancel() {
		this.setState({
			visibleConfirm: false,
			isDisable: false
		})
		moneyDiffer = ''
	}
	render() {
		const { coffersList = {} } = this.props;
		const { getFieldDecorator } = this.props.form;

		const formItemLayout = {
			labelCol: {
				xs: { span: 20 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 20 },
				sm: { span: 18 },
			},
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					span: 16,
					offset: 8,
				},
			},
		};



		return (
			<div className="costBox">
				<Form onSubmit={this.handleSubmit.bind(this)}>
					<FormItem
						{...formItemLayout}
						label="当前额度"
					>
						{getFieldDecorator('before_cost', {})(
							<span>{coffersList.coffers_amount}</span>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="调整后额度(元)"
					>
						{getFieldDecorator('after_cost', {
							rules: [
								{
									required: true,
									validator: this.validateToNextPassword.bind(this)
								}
							]
						})(
							<p>
								<Input onBlur={this.handleGetNumber.bind(this)} />
							</p>
						)}
					</FormItem>

					<FormItem
						{...formItemLayout}
						label="调整的额度"
					>
						{getFieldDecorator('change_cost', {})(
							<p>
								<span style={{ color: 'green', display: this.state.isGreen }}>{isNaN(this.state.money) == true ? '输入错误' : '减少了' + this.state.money}</span>
								<span style={{ color: 'red', display: this.state.isRed }}>{isNaN(this.state.money) == true ? '输入错误' : '增加了' + this.state.money}</span>
							</p>
						)}
					</FormItem>

					<FormItem
						{...formItemLayout}
						label="备注信息"
					>
						{getFieldDecorator('description', {})(
							<TextArea rows={6} />
						)}
					</FormItem>
					<FormItem {...tailFormItemLayout}>
						<Row style={{ marginTop: '10px' }}>
							<Col span={24} style={{ textAlign: 'center' }}>
								<Button type="primary" htmlType="submit" onClick={this.handlePush.bind(this)} >提交</Button>
								<Button type="primary" onClick={this.handleNoPush.bind(this)} style={{ marginLeft: '30px' }} >取消</Button>
							</Col>
						</Row>

					</FormItem>
				</Form>
				<Modal
					title="确认提交"
					visible={this.state.visibleConfirm}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}
					footer={[
						<Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
						<Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk.bind(this)} disabled={this.state.isDisable}>
							确定
                        </Button>,
					]}
				>
					<p>提交成功之后，该厂商的小金库额度会调整为{this.state.formDate.after_cost},是否确认提交？</p>
				</Modal>
			</div>
		);
	}
}
const updateCase = Form.create()(UpdateCase);
UpdateCase.propTypes = {
	actions: PropTypes.shape({

	}),
	// companyDetail: PropTypes.object.isRequired,
	// gift: PropTypes.object.isRequired,
	// credit: PropTypes.object.isRequired,
	// cash: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
	coffersList: state.companyDetail.coffersList,
	getReparation: state.companyDetail.getReparation
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...accountDetailAction
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(updateCase)

