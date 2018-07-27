import React, { Component } from 'react'
import { Row, Button, Modal, Input, Form, Col, Divider } from "antd";
import { businessModal } from "../../constants/config";
import './business.less'
import VerticalAlignTable from "./VerticalAlignTable";
const { TextArea } = Input;
const FormItem = Form.Item;
const confirm = Modal.confirm;
class BusinessStage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			showModalType: ''
		};
	}
	showModal = (type) => {
		this.setState({
			visible: true,
			showModalType: type,
		})
	}
	onCancel = () => {
		this.setState({
			visible: false,
		})
		this.props.form.resetFields()
	}
	onOk = () => {
		const { boInfo, pauseBo, stopBo, theQueryAgain } = this.props
		const id = boInfo.id
		const { showModalType } = this.state
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (showModalType === businessModal.stop) {
					//暂停接口
					pauseBo({ id: id, pause_reason: values.reason }).then(response => {
						if (response) {
							theQueryAgain()
						}
					})
				}
				if (showModalType === businessModal.over) {
					//终止商机
					stopBo({ id: id, termination_reason: values.reason }).then(response => {
						if (response) {
							theQueryAgain()
						}
					})
				}
				this.onCancel()
			}
		})
	}
	lengthVali = (rule, value, callback) => {
		const { showModalType } = this.state
		if (value) {
			if (value.length < 1) {
				callback();
			} else if (value.length > 50) {
				callback(`${showModalType}原因不能超过50个字`);
			} else {
				callback();
			}
		} else {
			callback();
		}
	}
	render() {
		const { boInfo, history, saleCRM_business_detail_operating_button, theQueryAgain, recoverBusinessOpportunity } = this.props
		const { visible, showModalType } = this.state
		const { form } = this.props;
		const { getFieldDecorator } = form;
		function stageContant(type, reason, time) {
			const list = [{ title: `${type}原因：`, detail: reason, color: 'red' }
				, { title: `${type}时间：`, detail: time }]
			return <div style={{ marginBottom: 20 }}><VerticalAlignTable width={78} list={list} /></div>
		}
		function showConfirm() {
			confirm({
				title: '重新跟进商机',
				content: <div style={{ width: 160, margin: '29px auto 12px', paddingRight: 10 }}>确定重新跟进该商机吗？</div>,
				onOk() {
					recoverBusinessOpportunity({ id: boInfo.id }).then(() => {
						theQueryAgain()
					});
				},
				onCancel() {
					theQueryAgain()
				},
			});
		}
		const businessStage = parseInt(boInfo.status)
		{/* 是否暂停1.否 2.是 */ }
		const isStop = boInfo.is_pause === 2
		return (
			<div className='businessStage'>
				<Row className='detail-stage'>
					<div>商机阶段</div>
					当前阶段：{boInfo.status_name}&nbsp;&nbsp;&nbsp;&nbsp;

					{isStop ? <span>已暂停</span> : null}
				</Row>
				{businessStage === 4 ?
					<Row className='contract-style'>
						<Col span={4}></Col>
						<Col span={3} style={{ width: 110 }}>合同或邮件截图：</Col>
						<Col span={12}>
							{boInfo.contract && boInfo.contract.map((one, index) => {
								return <div style={{ marginBottom: 6 }} key={index} >{one.file_name}<a onClick={() => window.open(boInfo.image_host + one.url)}><Divider type="vertical" />下载</a></div>
							})}
						</Col>
					</Row>
					: null}
				<Row className='stage-contant' style={{ margin: businessStage === 4 ? 30 : '20%' }}>
					{/* 显示内容 */}
					{isStop ? stageContant("暂停", boInfo.pause_reason, boInfo.pause_at) : null}
					{businessStage === 5 ? stageContant("终止", boInfo.termination_reason, boInfo.termination_at) : null}
					{/* 操作内容 */}
					{saleCRM_business_detail_operating_button ? <div>
						{isStop ? <Button type="primary" onClick={showConfirm}>重新跟进</Button> : null}
						{isStop || businessStage == 5 ? null :
							<div>
								<Button type="primary" onClick={() => history.push(`/sale/businessOpportunity/add?id=${parseInt(boInfo.id)}`)}>编辑商机</Button>
								{
									businessStage === 4 ? null :
										<Button type="primary" onClick={this.showModal.bind(null, businessModal.stop)}>暂停商机</Button>
								}
								<Button type="primary" onClick={this.showModal.bind(null, businessModal.over)}>终止商机</Button>
							</div>
						}</div> : null}
				</Row>
				<Modal
					visible={visible}
					title={`${showModalType}商机`}
					onCancel={this.onCancel}
					onOk={this.onOk}
					maskClosable={false}
				>

					<Form layout="inline" className='businessSearch'>
						<FormItem label={`${showModalType}原因`}>
							{getFieldDecorator('reason', {
								rules: [{
									required: true,
									message: `请输入${showModalType}原因`,
								}, {
									validator: this.lengthVali,
								}],
								validateTrigger: 'onBlur'
							})(
								<TextArea style={{ width: 350 }} placeholder={`请输入${showModalType}原因`} />
							)}
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
}
export default Form.create()(BusinessStage);
