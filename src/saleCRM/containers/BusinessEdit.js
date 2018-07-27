import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Input, Form, Select, Button, Upload, message, Spin, Row, Col } from 'antd';
import "../components/business/business.less";
//import ThreeUpload from "../components/ThreeUpload";
import qs from "qs";
import * as business from "../actions";
import axios from 'axios'
import { Link } from "react-router-dom";
import BusinessCompanySelect from "./BusinessCompanySelect";

const FormItem = Form.Item;
const Option = Select.Option;
//const AutoOption = AutoComplete.Option; AutoComplete,
/**
 * 本js是商机添加和修改页面的js
 * 有ID是修改，无id是新增
 */
class BusinessEdit extends Component {
	constructor(props) {
		super(props)
		this.state = {
			okCooperation: false,
			loading: false,
			imagelist: {},
			token: '',
			fileList: [],
			uploadFlag: false,
			isLoading: qs.parse(props.location.search.substring(1)).id > 0 ? true : false,
			fileListUid: 0
		}
		this.changeImagelist.bind(this)

	}
	//确认的方法
	handleOk = () => {
		//
		const { fileList } = this.state;
		const { history, actions, boInfo } = this.props
		//处理传给后台的数据
		const fileListUrl = fileList.map(one => ({
			file_name: one.name,
			url: one.filepath
		}))
		this.props.form.validateFields((err, values) => {
			//公司重新赋值，修改时展示信息是name，保存要保存ID
			if (boInfo.company_id) {
				values.company_id = boInfo.company_id
			} else {
				values.company_id = values.company_id.key
			}
			let allvalue = {
				...values,
				// business_license_file: values.company.business_license_file,
				// organization_code_certificate_file: values.company.organization_code_certificate_file,
				// tax_registration_certificate_file: values.company.tax_registration_certificate_file,
				contract: fileListUrl
			}
			if (!err) {
				//跳转到详情页
				actions.addBusiness(allvalue).then(response => {
					if (response) {
						const id = response.data.id
						history.push(`/sale/businessOpportunity/detail?id=${id}`)
					}

				})
			}
		})
	}
	componentDidMount = () => {
		//清空之前的详情信息
		this.props.actions.cleanBoInfo()
		//清空之前查到的公司信息
		this.props.actions.cleanCompanyName()
		//获取下拉框数据
		this.props.actions.getSelect()
		//获取上传图片的token
		this.props.actions.getUploadCompanyToken()
		//获取是否是修改操作
		const id = qs.parse(this.props.location.search.substring(1)).id
		if (id > 0) {
			this.props.actions.getBoInfo({ id: id })
				.then(response => {
					//初始化上传文件
					const businessDetailInfo = response.data.list
					const fileList = []
					let fileListUidNow = 0
					//状态为4时添加合同下载列表显示
					if (businessDetailInfo.status === 4) {
						businessDetailInfo.contract.map((one, index) => {
							fileList.push({
								uid: index + 1,
								name: one.file_name,
								url: businessDetailInfo.image_host + one.url,
								status: "done"
							})
							fileListUidNow = index + 2
						})
						this.setState({
							fileList: fileList,
							okCooperation: true,
							fileListUid: fileListUidNow
						})
					}
					this.setState({
						isLoading: false
					})
				})
		}

	}
	//确认合作判断
	changeStage = (value) => {
		//获取公司资质
		if (parseInt(value) === 4) {
			//this.props.actions.getCompanyFile({ company_id: this.props.form.getFieldValue('company_id') })
			this.setState({ okCooperation: true })
		} else {
			this.setState({ okCooperation: false })
		}
	}
	//商机需改是否唯一
	getIsOnlyOne = async (rule, value, callback) => {
		let isOnly = false
		//查询是否唯一
		await this.props.actions.verifyNameOnly({ name: value }).then(response => {
			isOnly = !response.data.is_existence
		})
		if (value.length > 30) {
			callback('商机名称不能超过30个字');
		} else if (isOnly) {
			callback('商机名称已存在');
		}
		else {
			callback();
		}
	}
	//修改商机唯一性判断
	getIsOnlyOneUpdate = async (rule, value, callback) => {
		// 		let isOnly = false
		// 		const { boInfo } = this.props
		// 		//查询是否唯一
		// 		await this.props.actions.verifyNameOnly({ name: value }).then(response => {
		// 			isOnly = !response.data.is_existence
		// 		})
		// else if (isOnly && boInfo.name !== value) {
		// 			callback('商机名称已存在');
		// 		}
		if (value.length > 30) {
			callback('商机名称不能超过30个字');
		}
		else {
			callback();
		}
	}
	//操作三证上传的组件信息
	changeImagelist = (codeImage, licenseImage, registerImage) => {
		this.props.form.setFieldsValue({
			'company': {
				business_license_file: licenseImage,
				organization_code_certificate_file: codeImage,
				tax_registration_certificate_file: registerImage,
			}
		})
	}

	//限制图片格式
	beforeUpload = (file) => {
		const isLt2M = file.size / 1024 / 1024 < 20 || file.size / 1024 / 1024 == 20;
		if (file.size / 1024 / 1024 > 20) {
			message.error('文件大小超出20M，请重新选择');
		}
		return isLt2M;
	}
	//上传的方法
	handleChange = (info) => {
		const { upload_url, token } = this.props.uploadCompanyToken;
		const { fileList, fileListUid } = this.state
		let formData = new window.FormData();
		this.setState({
			isLoading: true
		})
		formData.append("qq_file", info.file);
		formData.append("token", token);
		axios.post(upload_url, formData).then(response => {
			if (response) {
				if (response.data.code === 1000) {
					//设置fileList展示出下载列表
					fileList.push({
						uid: fileListUid,
						name: response.data.data.file_original_name,
						url: response.data.data.url,
						filepath: response.data.data.filepath,
						status: "done"
					})
					this.setState({
						fileList: fileList,
						fileListUid: fileListUid + 1,
						isLoading: false
					})
				} else {
					message.error('文件上传失败')
					this.setState({
						isLoading: false
					})
				}
			} else {
				message.error('文件上传失败')
				this.setState({
					isLoading: false
				})
			}

		}).catch(() => {
			message.error('文件上传失败')
		})
	}
	//删除下载列表的方法
	onRemove = (info) => {
		this.setState({
			fileList: [...this.state.fileList.filter((item) => { return item.uid !== info.uid })]
		}, () => {
			//this.props.actions.transformImagePath(this.state.fileList);
		})
	}
	changeCompany = (value) => {
		if (value) {
			this.props.form.setFieldsValue({ 'company_id': value.key })
		}
	}

	render() {
		/**
		 * 参数说明
		 * companyName:所属公司名称
		 * isEditAciton：是否修改
		 */
		const { form, boInfo, selectList, actions, history } = this.props;
		const { bo_stage, estimate_price } = selectList
		const { getFieldDecorator } = form;
		const { okCooperation, fileList, isLoading } = this.state;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 15 },
		}

		//是否是修改
		const isEditAciton = qs.parse(this.props.location.search.substring(1)).id > 0
		const contentBusinessEditFrom = <div>
			<p><Link to='/sale/businessOpportunity'>商机列表</Link>{isEditAciton ? '>编辑商机' : '>添加商机'}</p>
			<Form layout='horizontal' style={{ width: '100%', marginTop: 30 }}>
				{/* 修改时才有ID */}
				{isEditAciton ?
					<FormItem label="商机ID" style={{ display: 'none' }}>
						{getFieldDecorator('id', {
							initialValue: boInfo && boInfo.id,
						})(
							<Input />
						)}
					</FormItem> : ''}
				<h3 >基本信息</h3>
				<div className='businessEdit-box'>
					<Row>
						<Col span={12}>
							<FormItem label="商机名称" {...formItemLayout}>
								{getFieldDecorator('name', {
									validateFirst: true,
									initialValue: boInfo && boInfo.name,
									rules: [{
										required: true,
										message: '商机名称不能为空'
									}, {
										validator: isEditAciton ? this.getIsOnlyOneUpdate : this.getIsOnlyOne,
									}],
									validateTrigger: 'onBlur'
								})(
									<Input placeholder="请输入商机名称" disabled={isEditAciton} />
								)}

							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem label="预估投放金额"  {...formItemLayout}>
								{getFieldDecorator('estimate_sales_amount', {
									initialValue: boInfo && boInfo.estimate_sales_amount,
								})(
									<Select
										style={{ width: '100%' }}
										placeholder='请选择'
										allowClear
									>
										{
											estimate_price && estimate_price.map(one => <Option key={one.id} value={one.id}>{one.name}</Option>)
										}
									</Select>
								)}
							</FormItem>
						</Col>
					</Row>
					<Row style={{ marginTop: 6 }}>
						<Col span={12}>
							{isEditAciton ?
								<FormItem label="所属公司"  {...formItemLayout}>
									{getFieldDecorator('company_id', {
										initialValue: boInfo.company_name,
										rules: [{
											required: true, message: '请输入并从下拉框中选择',
										}],
									})(
										<Input disabled placeholder="请输入并从下拉框中选择" />
									)}
								</FormItem> : <FormItem label="所属公司"  {...formItemLayout}>
									{getFieldDecorator('company_id', {
										rules: [{
											required: true, message: '所属公司不能为空',
										}],
										validateTrigger: 'onBlur'
									})(
										<BusinessCompanySelect getCompanyName={actions.getCompanyName} cleanCompanyName={actions.cleanCompanyName} changeCompany={this.changeCompany} />
									)}
								</FormItem>}
						</Col>
					</Row>
				</div>
				<h3>商机推进信息</h3>
				<div className='businessEdit-box'  >
					<Row>
						<Col span={12}>
							<FormItem label="商机阶段" {...formItemLayout}>
								{getFieldDecorator('status', {
									initialValue: boInfo && boInfo.status || 1,
									rules: [{ required: true, message: '请选择商机阶段' }],

								})(
									<Select
										style={{ width: '100%' }}
										onChange={this.changeStage}
										placeholder='请选择'
										allowClear
										disabled={isEditAciton && boInfo.status === 4}
									>
										{
											//修改是，商机阶段，只能显示本阶段之后的阶段
											isEditAciton ? bo_stage && bo_stage.map(one => {
												return parseInt(one.id) === 5 || parseInt(one.id) < boInfo.status ? null :
													<Option key={one.id} value={one.id}>{one.name}</Option>
											}) : bo_stage && bo_stage.map(one => {
												return parseInt(one.id) === 5 ? null :
													<Option key={one.id} value={one.id}>{one.name}</Option>
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
					</Row>
					{/* okCooperation是否是确认合作，确认合作才展示以下信息 */}
					{okCooperation ?
						<div>
							{/* <FormItem label="公司资质"  {...formItemLayout}>
								{getFieldDecorator('company', {
									rules: [{ required: true, message: '请选择公司资质' }],
								})(
									<ThreeUpload changeImagelist={this.changeImagelist} token={uploadCompanyToken} />
								)}
							</FormItem> */}
							<Row>
								<Row >
									<Col span={3}></Col>
									<Col span={18} style={{ position: 'absolute', left: fileList.length > 9 ? '13%' : '18.5%', paddingTop: 10 }}>上传合同扫描件或者客户确认合作的邮件截图，单文件大小不超过20M，最多可上传10份</Col>
								</Row>
								<Col span={12}>
									<FormItem label="合同/邮件截图" {...formItemLayout}>
										{getFieldDecorator('contract', {
											initialValue: fileList,
											rules: [{ required: true, message: '请上传合同' }],
										})(

											<Upload
												className='bus-upload'
												fileList={fileList}
												customRequest={this.handleChange}
												beforeUpload={this.beforeUpload}
												onRemove={this.onRemove}
												accept="image/png, image/gif, image/jpeg, image/jpg, image/bmp, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
												disabled={fileList.length > 9}
											>
												{fileList.length > 9 ? null : <Button type="primary">上传</Button>}

											</Upload>

										)}
									</FormItem>
								</Col>
							</Row>

						</div>
						: null}

				</div>
			</Form>
			<div style={{ width: 200, margin: '50px auto' }}>
				<Button type='primary' onClick={this.handleOk}>确定</Button>
				<Button style={{ marginLeft: 70 }} onClick={() => history.goBack()}>取消</Button>
			</div>
		</div >
		return (
			<div>
				<Spin spinning={isLoading}>{contentBusinessEditFrom} </Spin>
			</div>
		)
	}
}
const BusinessEditFrom = Form.create()(BusinessEdit)
const mapStateToProps = (state) => ({
	uploadCompanyToken: state.saleCRMReducers.uploadCompanyToken,
	selectList: state.saleCRMReducers.selectList,
	compayNameList: state.saleCRMReducers.compayNameList,
	boInfo: state.saleCRMReducers.boInfo
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...business
	}, dispatch)
})
export default (connect(
	mapStateToProps,
	mapDispatchToProps
)(BusinessEditFrom))

