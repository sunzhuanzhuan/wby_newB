import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
//import { browserHistory } from 'react-router'
import { withRouter } from "react-router-dom";
import qs from "qs";
import { Form, Input, Button, Radio, Row, Col, Modal, message, AutoComplete, InputNumber } from 'antd';
import * as invoiceApply from '../actions/invoiceApply'
//import axios from 'axios'
import './createdApplyList.less'
//引入配置文件
import { formConfig, formConfigTextarea } from '../constants/form_config'

//引入上传的过程
// import { handleUpload } from '../components/uploadFunction'
import { WBYUploadFile } from 'wbyui'
// import { debounce } from "../constants/invoiceListConfig";
import { moneyToChinese } from "../util/index";
import { calcSum } from "../../util";

// import { CLIENT_RENEG_LIMIT } from 'tls';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const imgType = 'image/jpg,image/jpeg,image/png,image/bmp'


function beforeUpload(file) {
	const reg = /^[.\w\u4E00-\u9FFF\s()（）#—~【】[\]-]+$/;
	const formateName = file.name.replace(/\.\w+$/, '');
	if (!reg.test(formateName)) {
		message.error('你上传的文件名包含不支持的特殊字符');
		return false;
	} else {
		return true;
	}
}
function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

class CreateApplyList extends Component {
	constructor(props) {
		super(props)
		this.state = ({
			dataSource: [],
			contract_num: false,
			amount: false,
			visible: false,
			formData: {},
			invoiced_amount: true,
			upload_amount: false,
			upload_contract: false,
			email_container: [],
			email_approval_screenshots: [],
			contract_container: [],
			fileListEmail: [],
			previewImage: '',
			emailLength: '',
			previewVisible: false,
			fileListContract: [],
			contractLength: '',
			//发票申请单ID
			id: '',
			//PO单是否正确
			flag: false,
			poShow: false,
			ticket: true,
			title: '创建',
			poId: '',
			poCode: '',
			weidu: false,
			disabledSave: false,
			disabledSubmit: false,
			invoiceInfo: ['1', '2', '3', '4'],
			invoiceTitle: [],
			rejectMaxApply: false,
			historyOrderSubmit: false,
			radioType: 1,
			errEmail: true,
			errCon: true,
			statusType: 1,
			contractId: '',
			//充值时数字转换为大写的人民币
			money: '',
			isChinese: false,
			keKaiValue: ''

		})
	}
	async componentDidMount() {
		//获取公司相关信息
		await this.props.actions.getCompanyInfo(this.props.comp_id).then((response) => {

			if (response.code == 1000) {
				this.setState({
					statusType: this.props.data.type
				})
				if ((this.props.data.type == 1 || this.props.data.type == 5) && response.data.is_po_enabled) {
					if (this.props.data.order_associate_type == 2) {
						this.setState({
							poShow: true

						})
					}
					this.setState({
						ticket: true,
						weidu: true

					})

				}
				if (Object.keys(this.props.data).length == 0 && response.data.is_po_enabled) {
					this.setState({
						weidu: true

					})
				}
			}
		})
		//获取meta的信息
		this.props.actions.getMeta();
		if (this.props.data.type) {
			this.props.actions.invoiceState(this.props.comp_id, this.props.data.type);
		} else {
			this.props.actions.invoiceState(this.props.comp_id, 1);
		}
		this.props.actions.getToken();
		if (this.props.applyType == 2) {
			this.setState({ money: moneyToChinese(this.props.data.amount), isChinese: true, keKaiValue: this.props.data.amount })
			this.setState({ title: '修改' })
			if (this.state.weidu && this.props.data.order_associate_type == 2) {
				this.setState({
					poShow: true
				})
			}
		}
		if (this.props.applyType == 3) {
			this.setState({ money: moneyToChinese(this.props.data.amount), isChinese: true, keKaiValue: this.props.data.amount })
		}
		if (Object.keys(this.props.data).length != 0) {
			if (this.props.data.email_approval_screenshots != '') {
				for (let i = 0; i < this.props.data.email_approval_screenshots.length; i++) {
					this.props.data.email_approval_screenshots[i].uid = i
				}
				this.setState({
					fileListEmail: this.props.data.email_approval_screenshots
				})
			}
			if (this.props.data.contract_scanning_copy != '') {
				for (let i = 0; i < this.props.data.contract_scanning_copy.length; i++) {
					this.props.data.contract_scanning_copy[i].uid = i
				}
				this.setState({
					fileListContract: this.props.data.contract_scanning_copy
				})
			}

			switch (this.props.data.type) {
				case 1:
					if (this.props.return != undefined) {
						this.setState({
							poCode: this.props.return
						})
					}
					break;
				case 2:
					this.setState({
						poShow: false,
						ticket: false,
						//充值的时候也要有发票金额
						amount: true,
					})
					break;
				case 3:
					this.setState({
						contract_num: true,
						amount: true,
						invoiced_amount: false,
						upload_contract: true,
						upload_amount: false
					})
					break;
				case 4:
					this.setState({
						contract_num: false,
						amount: true,
						invoiced_amount: false,
						upload_amount: true,
						upload_contract: false
					})
					break;
				default:
					this.setState({
						contract_num: false,
						amount: false,
						invoiced_amount: true
					})
					break;
			}
		}

	}
	handleUploadValidate() {
		if (this.state.statusType == 3) {
			if (this.state.fileListContract.length > 0 || this.state.contractId.length > 0) {
				this.setState({
					errCon: true,
					errEmail: true
				})
				return true
			} else {
				this.setState({
					errCon: false,
					errEmail: true
				})
				return false
			}

		} else if (this.state.statusType == 4) {
			if (this.state.fileListEmail.length > 0) {
				this.setState({
					errEmail: true,
					errCon: true,
				})
				return true
			} else {
				this.setState({
					errEmail: false,
					errCon: true,
				})
				return false
			}
		} else {
			return true
		}


	}
	//保存formData
	handleSubmit(e) {
		e.preventDefault();
		if (this.state.money == '') {
			this.setState({ money: '请输入金额并且为数字,小数保留2位' })
		}
		this.props.form.validateFields(async (err, values) => {
			await this.setState({
				contractId: values.contract_num
			})
			if (!err) {
				if (values.amount == '') {
					this.setState({ money: '请输入金额并且为数字,小数保留2位' })
					return
				}
				if (values.type == 2) {
					if (this.state.isChinese == false) {
						return
					}
				}
				values.id = this.props.id
				values.execution_evidence_id = this.state.poId
				values.company_id = this.props.corpInfo.company_id
				values.company_name = this.props.corpInfo.name
				if (values.type == 4) {
					let ary = values.email_approval_screenshots.map(item => {
						return item.filepath
					})
					values.email_approval_screenshots = ary
					values.email_approval_screenshots_token = this.props.token.mail_screenshot.token
				}
				if (values.type == 3) {
					let ary = values.contract_scanning_copy.map(item => {
						return item.filepath
					})
					values.contract_scanning_copy = ary
					values.contract_scanning_copy_token = this.props.token.contract_scan_file.token
					// this.setState({
					// 	contractId: values.contract_num
					// })
				}
				if (!this.props.corpInfo.is_po_enabled) {
					values.order_associate_type = 1
				}
				window.localStorage.setItem('createApply', '1');
				this.setState({
					formData: values
				}, () => {
					this.handleOk()
				});
			}
		});
	}
	changeEmail(info) {
		if (info.file.status == 'done') {
			getBase64(info.file.originFileObj, imageUrl => this.setState({
				imageUrl
			}));
		} else if (info.file.status == 'removed') {
			this.setState({
				fileListEmail: info.fileList,
				emailLength: info.fileList.length
			})
		}
	}
	handleCancelView() {
		this.setState({ previewVisible: false })
	}
	//保存为草稿
	handleSave(e) {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (this.state.money == '') {
					this.setState({ money: '请输入金额并且为数字,小数保留2位' })
				}
				this.setState({ disabledSave: true })
				values.id = this.props.id
				values.execution_evidence_id = this.state.poId
				values.company_id = this.props.corpInfo.company_id
				values.company_name = this.props.corpInfo.company_name
				if (values.type == 4) {
					let ary = values.email_approval_screenshots.map(item => {
						return item.filepath
					})
					values.email_approval_screenshots = ary
					values.email_approval_screenshots_token = this.props.token.mail_screenshot.token
				}
				if (values.type == 3) {
					let ary = values.contract_scanning_copy.map(item => {
						return item.filepath
					})
					values.contract_scanning_copy = ary
					values.contract_scanning_copy_token = this.props.token.contract_scan_file.token
				}
				if (!this.props.corpInfo.is_po_enabled) {
					values.order_associate_type = 1
				}
				this.setState({
					formData: values
				}, () => {
					if (this.props.applyType == 2) {
						this.props.actions.modifiedSubmit(this.state.formData).then((response) => {
							if (response.code == 1000) {
								//修改了push的方式
								this.props.history.push("/invoice/applyList")
								//browserHistory.push("/invoice/applyList")
							} else if (response.code == 999) {
								message.error(response.msg)
							}
						})
					} else {
						this.props.actions.postForm(this.state.formData).then((response) => {
							if (response.code == 1000) {
								//修改了push的方式
								this.props.history.push("/invoice/applyList")
								//browserHistory.push("/invoice/applyList")
							} else if (response.code == 999) {
								message.error(response.msg)
							}
						})
					}
				});
			}
		});

	}

	handlePreview(file) {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true
		});
	}
	handleRadioValue(e) {
		let radio = e.target.value
		this.setState({
			radioType: radio,
			statusType: radio,
		})
		switch (radio) {
			case 1:
				if (this.props.data.order_associate_type == 2) {
					this.setState({
						poShow: true

					})
				}
				this.setState({
					contract_num: false,
					amount: false,
					invoiced_amount: true,
					upload_contract: false,
					upload_amount: false,
					ticket: true,
					weidu: true,
				})
				this.props.actions.invoiceState(this.props.comp_id, 1)
				break;
			case 2:
				this.setState({
					contract_num: false,
					//充值的时候也要出现发票金额
					amount: true,
					invoiced_amount: true,
					upload_contract: false,
					upload_amount: false,
					ticket: false,
					poShow: false,
					weidu: false,
				})
				this.props.actions.invoiceState(this.props.comp_id, 2);
				let { countInfo, data, applyType } = this.props
				let total = [data.amount, countInfo.available_amount]
				if (applyType == 2 && data.type == 2) {
					if (calcSum(total) >= Number(this.state.keKaiValue)) {
						this.setState({ money: moneyToChinese(this.state.keKaiValue), isChinese: true, })
					} else {
						this.setState({ money: '请确认可开票金额', isChinese: false, })
					}

				} else {
					if (Number(countInfo.available_amount) >= Number(this.state.keKaiValue)) {
						this.setState({ money: moneyToChinese(this.state.keKaiValue), isChinese: true, })
					} else {
						this.setState({ money: '请确认可开票金额', isChinese: false, })
					}
				}
				break;
			case 3:
				this.setState({
					contract_num: true,
					amount: true,
					invoiced_amount: false,
					upload_contract: true,
					upload_amount: false,
					ticket: false,
					poShow: false,
					weidu: false,
				})
				this.setState({ money: moneyToChinese(this.state.keKaiValue), isChinese: true, })
				break;
			case 4:
				this.setState({
					contract_num: false,
					amount: true,
					invoiced_amount: false,
					upload_amount: true,
					upload_contract: false,
					ticket: false,
					poShow: false,
					weidu: false,
				})
				this.setState({ money: moneyToChinese(this.state.keKaiValue), isChinese: true, })
				break;
			case 5:
				if (this.props.corpInfo.max_can_apply === 0) {
					this.setState({
						rejectMaxApply: true,
						historyOrderSubmit: true
					})
				} else {
					this.setState({
						rejectMaxApply: false,
						historyOrderSubmit: false
					})
				}
				if (this.props.data.order_associate_type == 2) {
					this.setState({
						poShow: true

					})
				}
				this.setState({
					contract_num: false,
					amount: false,
					invoiced_amount: false,
					upload_contract: false,
					upload_amount: false,
					ticket: true,
					weidu: true,
				})
				this.props.actions.invoiceState(this.props.comp_id, 1)
				break;
			default:
				this.setState({
					contract_num: false,
					amount: false,
					invoiced_amount: true
				})
				break;
		}

	}

	//上传信息的公共方法
	handlePostData() {
		this.props.actions.postForm(this.state.formData).then((response) => {
			this.setState({
				id: response.data.id
			})
			if (response.code == 1000) {
				this.props.actions.postProof(response.data.id).then(response => {
					let data = [];
					data.push(response.data);
					let arr = [];
					for (let i in data[0]) {
						const element = data[0][i];
						arr.push(element)
					}
					if (arr.indexOf(true) != -1) {
						const Obj = response.data;
						Obj.id = this.state.id;
						Obj.company_id = this.props.comp_id
						Obj.applyType = this.props.applyType
						Obj.poCode = this.state.poCode
						//browserHistory.push({ pathname: "/invoice/upload", state: Obj })
						// console.log(this.props.history, 222);
						//注销debugger
						//debugger
						//修改了push的方式
						this.props.history.push({
							pathname: "/invoice/upload",
							search: '?' + qs.stringify(Obj)
						})

					} else {
						if (this.state.formData.type == 1 || this.state.formData.type == 5) {
							//browserHistory.push("/invoice/completeApply?id=" + this.state.id)
							//修改了push的方式
							this.props.history.push({
								pathname: "/invoice/completeApply",
								search: '?' + qs.stringify({ id: this.state.id })
							})

						} else {
							//修改了push的方式
							this.props.history.push("/invoice/applyList")
							//browserHistory.push("/invoice/applyList")
						}

						// const Obj = response.data;
						// browserHistory.push({ pathname: "/invoice/upload", state: Obj })
					}

				})

			} else if (response.code == 999) {
				message.error(response.msg)
			}

		})
		this.setState({
			visible: false,
		});
	}

	//修改表单，并上传
	handleodifiedForm() {
		this.props.actions.modifiedSubmit(this.state.formData).then((response) => {
			this.setState({
				id: response.data.id
			})
			this.props.actions.postProof(response.data.id).then(response => {
				let data = [];
				data.push(response.data);
				let arr = [];
				for (let i in data[0]) {
					const element = data[0][i];
					arr.push(element)
				}
				if (arr.indexOf(true) != -1) {
					const Obj = response.data;
					Obj.id = this.state.id;
					Obj.company_id = this.props.comp_id
					Obj.applyType = this.props.applyType
					//browserHistory.push({ pathname: "/invoice/upload", state: Obj })
					//修改了push的方式
					this.props.history.push({
						pathname: "/invoice/upload",
						search: '?' + qs.stringify(Obj)
					})

				} else {
					if (this.state.formData.type == 1 || this.state.formData.type == 5) {
						//browserHistory.push("/invoice/completeApply?id=" + this.state.id)
						//修改了push的方式
						this.props.history.push({
							pathname: "/invoice/completeApply",
							search: '?' + qs.stringify({ id: this.state.id })
						})

					} else {
						//browserHistory.push("/invoice/applyList")
						//修改了push的方式
						this.props.history.push("/invoice/applyList")
					}

				}

			})
		})
		this.setState({
			visible: false,
		});
	}
	hasContractId(e) {
		if (e.target.value.length > 0) {
			this.setState({
				errCon: true,
				errEmail: true
			})
		}
		this.setState({
			contractId: e.target.value
		})
	}
	handleOk() {
		//修改
		if (this.props.applyType == 2) {
			this.handleodifiedForm()
		} else (//新建和复制
			this.handlePostData()
		)
	}
	handleCancel() {
		this.setState({
			visible: false,
		});
	}
	//处理po单是否显示
	handlePOshow(e) {
		if (e.target.value == 1) {
			this.setState({ poShow: false })
		} else {
			this.setState({ poShow: true })
		}
	}
	validatePO(rule, value, callback) {
		this.props.actions.searchPo(value).then((response) => {
			if (response.data.length == 0) {
				callback('请输入正确的PO单');
			} else {
				this.setState({
					poId: response.data.id,
					poCode: value
				})
				callback();
			}
		})
	}
	handleInvoiceTitle = async (value) => {
		if (value) {
			await this.props.actions.getInvoiceTitleRelation(value);
			let { invoiceTitleRelation } = this.props.invoiceTitle;
			await this.setState({ invoiceTitle: invoiceTitleRelation })
		} else {
			await this.setState({ invoiceTitle: [] })
		}
	}
	invoiceTitleSelect = async (value) => {
		let { invoiceTitleRelation } = this.props.invoiceTitle;
		let selectedObj = invoiceTitleRelation.find(item => {
			return item.invoice_title === value;
		})
		await this.props.actions.getInvoiceTitleContent(selectedObj.id);
		let { invoiceTitleContent } = this.props.invoiceTitle;
		let { setFieldsValue } = this.props.form;
		setFieldsValue({
			'tax_num': invoiceTitleContent['tax_num'] || '',
			'invoice_title_address': invoiceTitleContent['address'] || '',
			'bank_agency': invoiceTitleContent['bank_agency'] || '',
			'bank_account_number': invoiceTitleContent['bank_account_number'] || '',
			'phone': invoiceTitleContent['phone'] || '',
			'addressee': invoiceTitleContent['addressee'] || '',
			'addressee_address': invoiceTitleContent['addressee_address'] || '',
			'addressee_phone': invoiceTitleContent['addressee_phone'] || '',
			'postcode': invoiceTitleContent['postcode'] || ''
		});


	}
	handleCancelMaxApply = () => {
		this.setState({
			rejectMaxApply: false
		})
	}
	//添加金钱数字转换为大写的人民币
	handleMoneyToChinese(e) {
		let { countInfo, applyType, data, } = this.props
		let total = [data.amount, countInfo.available_amount]
		if (this.state.invoiced_amount) {
			if (applyType == 2 && data.type == 2) {
				if (calcSum(total) >= Number(e.target.value)) {
					this.setState({ money: moneyToChinese(e.target.value), isChinese: true, keKaiValue: e.target.value })
				} else {
					this.setState({ money: '请确认可开票金额', isChinese: false, keKaiValue: e.target.value })
				}

			} else {
				if (Number(countInfo.available_amount) >= Number(e.target.value)) {
					this.setState({ money: moneyToChinese(e.target.value), isChinese: true, keKaiValue: e.target.value })
				} else {
					this.setState({ money: '请确认可开票金额', isChinese: false, keKaiValue: e.target.value })
				}
			}

		} else {
			this.setState({ money: moneyToChinese(e.target.value), isChinese: true, keKaiValue: e.target.value })
		}

	}
	render() {
		// let { invoiceTitleRelation } = this.props.invoiceTitle;
		let { invoiceTitle } = this.state;
		let invoiceData = [];
		invoiceTitle.forEach(item => {
			invoiceData.push(item.invoice_title);
		});
		const formItemLayout = {
			labelCol: {
				xs: { span: 3 },
				sm: { span: 4 },
			},
			wrapperCol: {
				xs: { span: 16 },
				sm: { span: 14 },
			},
		};
		const { meta: { order_associate_type, beneficiary_company, invoice_type, invoice_content_type }, corpInfo = {}, form: { getFieldDecorator }, countInfo = {}, data = {} } = this.props;

		let widthStyle = {
			width: '400px'
		}
		let allStyle = {
			width: '100 %'
		}
		let amountModified = [countInfo.available_amount, data.amount]
		let draftAmount = [countInfo.draft_amount, -data.amount || 0]
		return (
			<fieldset style={{ textAlign: 'left' }} className='apply_box'>
				<legend>{this.state.title}发票申请</legend>

				<Form onSubmit={this.handleSubmit.bind(this)} >
					<FormItem label="公司ID" {...formItemLayout} className="formItem">
						{getFieldDecorator('company_id', {
							initialValue: data.type
						})(
							<span className='InputWidth'>{corpInfo.company_id}</span>
						)}
					</FormItem>
					<FormItem label="公司简称" {...formItemLayout} className="formItem">
						{getFieldDecorator('company_name', {
							initialValue: data.type
						})(
							<span className='InputWidth'>{corpInfo.name}</span>
						)}
					</FormItem>
					<FormItem label="开票依据" {...formItemLayout} className="formItem">
						{getFieldDecorator('type', {
							rules: [{ required: true, message: '请选择开票依据!' }],
							initialValue: Object.keys(data).length == 0 ? 1 : data.type
						})(
							<RadioGroup onChange={this.handleRadioValue.bind(this)}>
								<Radio value={1}><span>消费（<span style={{ color: 'red' }}>2018.5.22之后结案</span>）</span></Radio>
								<Radio value={5}><span>消费（<span style={{ color: 'red' }}>2018.5.22之前结案</span>）</span></Radio>
								<Radio value={2}>充值</Radio>
								<Radio value={3}>合同</Radio>
								<Radio value={4}>邮件审批</Radio>
							</RadioGroup>
						)}
					</FormItem>
					{this.state.contract_num == false ? null : <FormItem label="合同编号" {...formItemLayout} className="formItem">
						{getFieldDecorator('contract_num', {
							initialValue: data.contract_num
						})(
							<div>
								<Input onBlur={this.hasContractId.bind(this)} className='InputWidth' defaultValue={data.contract_num} />
								<div style={{ color: 'red' }}>{this.state.errCon ? '' : '请上传合同扫描件或合同编号'}</div>
							</div>
						)}
					</FormItem>

					}
					{this.state.upload_contract && this.props.token.contract_scan_file ?
						<FormItem label="上传信息" extra={<div style={{ color: 'red' }}>最多可上传5个附件，单附件不能超过10M，支持格式：zip、rar(压缩包)</div>} {...formItemLayout} className="formItem">
							{getFieldDecorator('contract_scanning_copy', {
								rules: [{ required: true, message: '请上传合同扫描件或合同编号' }],
								initialValue: this.props.data.contract_scanning_copy ? this.props.data.contract_scanning_copy.map(item => {
									return { ...item, filepath: item.url.replace(/^http(s)?:\/\/(.*?)\//, '/') }
								}) : []
							})(
								<WBYUploadFile tok={{ token: this.props.token.contract_scan_file.token, upload_url: this.props.token.upload_uri }} listType='text' multiple={true} size={10} len={5} accept={".zip,.rar"} uploadText={'上传合同扫描件'} beforeUpload={beforeUpload}>
								</WBYUploadFile>
							)}
						</FormItem> : null
					}
					{this.state.upload_amount && this.props.token.mail_screenshot ?
						<FormItem label="邮件上传图片" {...formItemLayout} className="formItem special-item">
							{getFieldDecorator('email_approval_screenshots', {
								rules: [{ required: true, message: '请上传图片' }],
								initialValue: this.props.data.email_approval_screenshots ? this.props.data.email_approval_screenshots.map(item => {
									return { ...item, filepath: item.url.replace(/^http(s)?:\/\/(.*?)\//, '/') }
								}) : []
							})(
								<WBYUploadFile tok={{ token: this.props.token.mail_screenshot.token, upload_url: this.props.token.upload_uri }} listType='picture-card' multiple={true} size={5} len={5} accept={imgType} onPreview={this.handlePreview.bind(this)} beforeUpload={beforeUpload}>
								</WBYUploadFile>
							)}
						</FormItem> : null
					}
					{this.state.amount == false ? null : <div> <FormItem label="发票金额" {...formItemLayout} className="formItem special-item">
						{getFieldDecorator('amount', {
							// rules: [
							// 	{ required:, message: '请输入金额并且为数字,小数保留2位' }
							// ],
							initialValue: data.amount
						})(
							<div>
								<InputNumber min={0} className='InputWidth' type="number" defaultValue={data.amount}
									style={this.state.invoiced_amount == false ? allStyle : widthStyle}
									onBlur={this.handleMoneyToChinese.bind(this)} precision={2} step="0.01" />
								{this.state.invoiced_amount == false ? null : <span style={{ marginLeft: '10px' }}>输入金额不能大于
								<span style={{ color: 'red' }}>{this.props.applyType == 2 && this.props.data.type == 2 ? <span>{calcSum(amountModified)}元</span> : <span>{countInfo.available_amount}元 </span>}</span>
								</span>}
								<div style={{ color: 'red' }}>{this.state.money}</div>
							</div>
						)}
					</FormItem>

					</div>
					}
					{(corpInfo.is_po_enabled == true && this.state.weidu == true) ?
						<FormItem label="开票维度" {...formItemLayout} className="formItem">
							{getFieldDecorator('order_associate_type', {
								rules: [{ required: true, message: '请选择开票维度' }],
								initialValue: data.order_associate_type
							})(
								<RadioGroup onChange={this.handlePOshow.bind(this)}>
									{
										order_associate_type == undefined ? null : order_associate_type.map((item, index) => {
											return <Radio key={index} value={item.id}>{item.display}</Radio>
										})
									}
								</RadioGroup>
							)}
						</FormItem>
						: null}
					{this.state.poShow == false ? null :
						<FormItem label="PO单号" {...formItemLayout} className="formItem">
							{getFieldDecorator('execution_evidence_id', {
								rules: [{ required: true, validator: this.validatePO.bind(this) }],
								initialValue: data['execution_evidence_code']
							})(
								<Input className='InputWidth' />
							)}
						</FormItem>
					}
					{
						this.state.invoiced_amount == false ? null : <FormItem label='金额详情' {...formItemLayout}
							className="formItem">
							本次可开金额：{this.props.applyType == 2 && data.type == 2 && this.state.statusType == 2 ? <span>{calcSum(amountModified)}元 |</span> : <span>{countInfo.available_amount}元 |</span>}
							总可开金额：{countInfo.total_available_amount}元 |
							开票中金额：{countInfo.application_amount}元 |
							总已开金额：{countInfo.invoiced_amount}元
							{this.state.statusType == 2 ? this.props.applyType == 2 && data.type == 2 && this.state.statusType == 2 ? <span>| 草稿状态金额：{calcSum(draftAmount)}元</span> : <span>| 草稿状态金额：{countInfo.draft_amount}元 </span> : null}
						</FormItem>
					}
					<FormItem label="发票抬头" {...formItemLayout} className="formItem">
						{getFieldDecorator('invoice_title', {
							rules: [{ required: true, message: '发票抬头项不能为空' }],
							initialValue: data.invoice_title,
						})(
							<AutoComplete dataSource={invoiceData} onSelect={this.invoiceTitleSelect}
								style={{ width: '500' }} onChange={this.handleInvoiceTitle}>
								<Input className='InputWidth' />
							</AutoComplete>
						)}
					</FormItem>
					<FormItem label="发票内容" {...formItemLayout} className="formItem">
						{getFieldDecorator('invoice_content_type', {
							rules: [{ required: true, message: '请输入发票内容!' }],
							initialValue: data.invoice_content_type
						})(
							<RadioGroup>
								{
									invoice_content_type == undefined ? null : invoice_content_type.map((item, index) => {
										return <Radio key={index} value={item.id}>{item.display}</Radio>
									})
								}
							</RadioGroup>
						)}
					</FormItem>
					<FormItem label="开票公司" {...formItemLayout} className="formItem">
						{getFieldDecorator('beneficiary_company', {
							rules: [{ required: true, message: '请选择开票公司!' }],
							initialValue: Object.keys(data).length == 0 ? 4 : data.beneficiary_company
						})(
							<RadioGroup>
								{
									beneficiary_company == undefined ? null : beneficiary_company.map((item, index) => {
										return <Radio disabled={item.id == 1 || item.id == 2 || item.id == 5 ? true : false} key={index} value={item.id}>{item.display}</Radio>
									})
								}
							</RadioGroup>
						)}
					</FormItem>
					<FormItem label="发票类型" {...formItemLayout} className="formItem">
						{getFieldDecorator('invoice_type', {
							rules: [{ required: true, message: '发票类型项不能为空' }],
							initialValue: data.invoice_type
						})(
							<RadioGroup>
								{
									invoice_type == undefined ? null : invoice_type.map((item, index) => {
										return <Radio key={index} value={item.id}>{item.display}</Radio>
									})
								}
							</RadioGroup>
						)}
					</FormItem>
					{
						formConfig.map((item, index) => {
							return <FormItem label={item.label_name} {...formItemLayout} className="formItem" key={index}>
								{getFieldDecorator(`${item.key}`, {
									rules: [{ required: item['require_rules'], message: `${item.rules}` }],
									initialValue: data[item.key]
								})(
									<Input className='InputWidth' key={data[item.key]} />
								)}
							</FormItem>
						})
					}
					{
						formConfigTextarea.map((item, index) => {
							return <FormItem label={item.label_name} {...formItemLayout} className="formItem" key={index}>
								{getFieldDecorator(`${item.key}`, {
									rules: [{ required: item['require_rules'], message: `${item.rules}` }],
									initialValue: data[item.key]
								})(
									<TextArea className='TextaraWidth' placeholder={item.placeholder} key={data[item.key]} />
								)}
							</FormItem>
						})
					}
					<Row style={{ marginTop: '30px', textAlign: 'center' }}>
						<Col span={7} ></Col>
						<Col span={5} style={{ textAlign: 'center' }} className="formItem">
							<Button type="primary" onClick={this.handleSave.bind(this)} disabled={this.state.historyOrderSubmit && this.state.radioType === 5 ? this.state.historyOrderSubmit : this.state.disabledSubmit}>存为草稿</Button>
							<Button type="primary" htmlType="submit" style={{ marginLeft: '30px' }} disabled={this.state.historyOrderSubmit && this.state.radioType === 5 ? this.state.historyOrderSubmit : this.state.disabledSubmit}>下一步</Button>
						</Col>
						<Col span={7} ></Col>
					</Row>
				</Form>
				<Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancelView.bind(this)} wrapClassName='pic-modal'>
					<img src={this.state.previewImage} className='invoice-modal-pic' />
				</Modal>
				<Modal
					title="提示"
					visible={this.state.visible}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<p>请确认<span style={{ fontSize: '20px' }}>发票抬头，税务登记号</span>填写是否正确</p>
					<p style={{ color: 'red' }}>【特别提醒】由于国家三证合一政策的实施，有可能导致客户开票税号变更，请与客户确认是否发生变更</p>
				</Modal>
				<Modal
					visible={this.state.rejectMaxApply}
					footer={[
						<Button key="submit" type="primary" onClick={this.handleCancelMaxApply}>确定</Button>
					]}
					onCancel={this.handleCancelMaxApply}
					width={640}>
					<p style={{ textAlign: 'center' }}>该厂商2018年5月22之前 无可开票金额，请选择其他开票依据</p>
				</Modal>
			</fieldset>
		);
	}

}
const apllylist = Form.create()(CreateApplyList);

const mapStateToProps = (state) => ({
	corpInfo: state.invoice.companyInfo.data,
	meta: state.invoice.getMeta,
	countInfo: state.invoice.getCountInfo,
	token: state.invoice.getToken,
	invoiceTitle: state.invoice.getInvoiceTitle
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...invoiceApply
	}, dispatch)
})
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(apllylist))
