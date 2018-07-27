import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
//import { browserHistory } from 'react-router'
import qs from 'qs'
import { Modal, message, Button, Row, Col, Form } from 'antd';
import * as invoiceApply from '../actions/invoiceApply'
import './createdApplyList.less'
import { WBYUploadFile } from 'wbyui'
const img1 = require('../img/1.jpg');
const img2 = require('../img/2.png')
const imgType = 'image/jpg,image/jpeg,image/png,image/bmp'
const FormItem = Form.Item;

class upload extends Component {
	constructor(props) {
		super(props);
		this.state = ({
			previewVisible: false,
			previewImage: '',
			fileListRelation: [],
			fileListProof: [],
			fileListCode: [],
			relation: '',
			proof: '',
			code: '',
			url: '',
			//发票申请单ID
			id: '',
			disableNext: false

		});
	}
	componentDidMount() {
		//修改了获取值的方式
		const search = qs.parse(this.props.location.search.substring(1))
		this.props.actions.modifiyInvoiceSucc(search.id).then((response) => {
			let arrR = response.data.invoice_company_relation_proof ? response.data.invoice_company_relation_proof.map(item => { return { ...item, filepath: item.url.replace(/^http(s)?:\/\/(.*?)\//, '/') } }) : [];
			let arrP = response.data.special_invoice_proof ? response.data.special_invoice_proof.map(item => { return { ...item, filepath: item.url.replace(/^http(s)?:\/\/(.*?)\//, '/') } }) : [];
			let arrC = response.data.invoice_title_code_proof ? response.data.invoice_title_code_proof.map(item => { return { ...item, filepath: item.url.replace(/^http(s)?:\/\/(.*?)\//, '/') } }) : [];
			this.setState({
				fileListRelation: arrR,
				fileListProof: arrP,
				fileListCode: arrC,
				id: search.id
			})
		})
		this.props.actions.getToken();
		//获取哪个是隐藏和出现
		//this.props.actions.postProof(this.props.location.state.id).then(response => {
		this.props.actions.postProof(search.id).then(response => {
			if (response.data.is_need_invoice_company_relation_proof) {
				this.setState({ relation: 'block' })
			} else {
				this.setState({ relation: 'none' })
			}
			if (response.data.is_need_special_invoice_proof
			) {
				this.setState({ proof: 'block' })
			} else {
				this.setState({ proof: 'none' })
			}
			if (response.data.is_need_invoice_title_code_proof
			) {
				this.setState({ code: 'block' })
			} else {
				this.setState({ code: 'none' })
			}
		})

	}
	beforeUpload = (file) => {
		const reg = /^[.\w\u4E00-\u9FFF\s()（）#—~【】[\]-]+$/;
		const formateName = file.name.replace(/\.\w+$/, '');
		if (!reg.test(formateName)) {
			message.error('你上传的文件名包含不支持的特殊字符');
			return false;
		} else {
			return true;
		}
	}
	handleCancel = () => {
		this.setState({ previewVisible: false })
	}

	handlePreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}
	handleNext = (e) => {
		this.props.form.getFieldsError()
		const search = qs.parse(this.props.location.search.substring(1))
		const token = this.props.token;
		const { relation, proof, code } = this.state;
		this.setState({ disableNext: true });
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (err) {
				message.error(err || '上传失败');
				this.setState({ disableNext: false })
				return
			}
			let params = { id: search.id };
			let ary1 = relation && values.invoice_company_relation_proof ? values.invoice_company_relation_proof.map(item => {
				return item.filepath
			}) : [];
			let ary2 = proof && values.special_invoice_proof ? values.special_invoice_proof.map(item => {
				return item.filepath
			}) : [];
			let ary3 = code && values.invoice_title_code_proof ? values.invoice_title_code_proof.map(item => {
				return item.filepath
			}) : [];
			params.invoice_company_relation_proof = ary1;
			params.special_invoice_proof = ary2;
			params.invoice_title_code_proof = ary3;
			params.invoice_company_relation_proof_token = relation ? token.invoice_company_relation_proof.token :
				'';
			params.special_invoice_proof_token = proof ? token.special_invoice_proof.token : '';
			params.invoice_title_code_proof_token = code ? token.invoice_title_code_proof.token : '';
			Object.keys(params).forEach(item => {
				if (!params[item]) {
					delete params[item];
				}
			});
			this.props.actions.postFileName(params).then(() => {
				this.props.actions.modifiyInvoiceSucc(search.id).then((response) => {
					if (response.code == 1000) {
						if (response.data.type == 1 || response.data.type == 5) {
							//修改了push的方式
							const params = {
								id: search.id
							}
							this.props.history.push({
								pathname: '/invoice/completeApply',
								search: '?' + qs.stringify(params)
							})
						} else {
							//修改了push的方式
							this.props.history.push("/invoice/applyList")
						}
					}
				})
			})
		})
	}
	handlePreve = () => {
		//修改了获取值的方式
		const search = qs.parse(this.props.location.search.substring(1));
		const { company_id, applyType = 2, id } = search;
		const params = { company_id, applyType, id };
		//修改了push的方式
		this.props.history.push({
			pathname: '/invoice/apply',
			search: '?' + qs.stringify(params)
		})
	}
	render() {
		const { previewVisible, previewImage, fileListRelation, fileListProof, fileListCode } = this.state;
		const { getFieldDecorator } = this.props.form;
		let isCreateApply = window.localStorage.getItem('createApply')
		return (
			<div>
				<fieldset>
					<legend>上传证明信息</legend>
					<Form className='upload-form' onSubmit={this.handleNext}>
						{this.state.relation == 'block' && this.props.token.invoice_company_relation_proof ? <div className="lineBottom">
							<legend style={{ fontSize: '18px' }} className='upload-legend'>上传关系证明</legend>
							<div className="clearfix">
								<span style={{ color: 'red' }}>最多可上传5个附件，单附件不能超过10M，格式：png、jpg、jpeg</span>
								<p><a href={img1} target='_blank'>查看图例1</a> ，适用情况：同一发票抬头被2个或以上公司简称开过，请上传该公司简称与此次要开的发票抬头的关系证明</p>
								<p><a href={img2} target='_blank'>查看图例2</a> ，适用情况：同一公司简称已开过2个或以上不同的发票抬头,请上传该公司简称与此次要开的发票抬头的关系证明</p>
								<FormItem>
									{getFieldDecorator('invoice_company_relation_proof', {
										rules: [{ required: true, message: '请上传关系证明' }],
										initialValue: fileListRelation
									})(
										<WBYUploadFile
											tok={{ token: this.props.token.invoice_company_relation_proof.token, upload_url: this.props.token.upload_uri }} listType="picture-card" multiple={true} size={10} len={5} accept={imgType} beforeUpload={this.beforeUpload}
											onPreview={this.handlePreview}>
										</WBYUploadFile>
									)}
								</FormItem>
								<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
									<img alt="example" style={{ width: '100px' }} src={previewImage} />
								</Modal>
							</div>
						</div>
							: null}
						{this.state.proof == 'block' && this.props.token.special_invoice_proof ? <div className="lineBottom">
							<legend style={{ fontSize: '18px' }} className='upload-legend'>资质证明</legend>
							<div className="clearfix">
								<span style={{ color: 'red' }}>最多可上传5个附件，单附件不能超过10M，格式：png、jpg、jpeg</span>
								<p>该发票抬头首次开专票，请上传营业执照副本、加盖一般纳税人条形章的税务登记证或税务事项通知书，两证都要加盖公司公章，确保上传的信息与填写的一致，否则会审核不通过！</p>

								<FormItem>
									{getFieldDecorator('special_invoice_proof', {
										rules: [{ required: true, message: '请上传资质证明' }],
										initialValue: fileListProof
									})(
										<WBYUploadFile
											tok={{ token: this.props.token.special_invoice_proof.token, upload_url: this.props.token.upload_uri }} listType="picture-card" multiple={true} size={10} len={5} accept={imgType} beforeUpload={this.beforeUpload}
											onPreview={this.handlePreview}>
										</WBYUploadFile>
									)}
								</FormItem>
								<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
									<img alt="example" style={{ width: '100%' }} src={previewImage} />
								</Modal>
							</div>
						</div>
							: null}
						{this.state.code == 'block' && this.props.token.invoice_title_code_proof ? <div className="lineBottom">
							<legend style={{ fontSize: '18px' }} className='upload-legend'>客户编码证明</legend>
							<div className="clearfix">
								<span style={{ color: 'red' }}>最多可上传5个附件，单附件不能超过10M，格式：png、jpg、jpeg</span>
								<p>填写或修改开票信息（纳税人识别号、开票地址、开户银行、银行账号、座机），请上传开票信息附件且需要加盖公司公章，确保上传的信息与填写的一致，否则会审核不通过！</p>

								<FormItem>
									{getFieldDecorator('invoice_title_code_proof', {
										rules: [{ required: true, message: '请上传客户编码证明' }],
										initialValue: fileListCode
									})(
										<WBYUploadFile
											tok={{ token: this.props.token.invoice_title_code_proof.token, upload_url: this.props.token.upload_uri }} listType="picture-card" multiple={true} size={10} len={5} accept={imgType} beforeUpload={this.beforeUpload}
											onPreview={this.handlePreview}>
										</WBYUploadFile>
									)}
								</FormItem>
								<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
									<img alt="example" style={{ width: '100%' }} src={previewImage} />
								</Modal>
							</div>
						</div>
							: null}
						<Row style={{ marginTop: '30px' }}>
							<Col span={24} style={{ textAlign: 'center' }}>
								{/* 修改了goBack */}
								<FormItem>
									<Button type="primary" onClick={isCreateApply ? this.handlePreve : this.props.history.goBack}>上一步</Button>
									<Button htmlType="submit" type="primary" style={{ marginLeft: '30px' }} disabled={this.state.disableNext}>下一步</Button>
								</FormItem>
							</Col>
						</Row>
					</Form>
				</fieldset>
			</div>
		)
	}
}
const UploadPage = Form.create()(upload);
const mapStateToProps = (state) => ({
	flieInfo: state.invoice.getFileInfo.data,
	token: state.invoice.getToken
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...invoiceApply
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UploadPage)
