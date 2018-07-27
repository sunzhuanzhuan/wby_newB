import React, {Component} from 'react';
import {Button, message, Spin, Row, Col, Form, Select, Input, Icon, Upload} from 'antd';
import api from "../../api";
import axios from 'axios'

const FormItem = Form.Item;
const Option = Select.Option;


class VideoMark extends Component {
	constructor(props) {
		super(props);
		this.state = {
			upload: false,
			filename: "",
			download: "",
			loading: false
		}
	}

	componentWillMount(){
		this.getEexcelTemplate();
	}
	//获取下载模版文件地址
	getEexcelTemplate(){
		api.get("/reservation_osrder/excel/down")
			.then(response=>{
				if(response.code===200){
					this.setState({download:response.data});
				}
			})
	}

	//表单提交
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({loading: true}, () => {
					api.post("/reservation_osrder/update/video/type", values)
						.then(response => {
							if (response.code === 200) {
								this.setState({loading: false}, () => {
									message.success(response.msg, 1);
									this.handleReset();
								});
							}
						})
				})

			}
		});

	}
	//清空表单
	handleReset = () => {
		this.props.form.resetFields();
		this.setState({filename: ""});
	}
	//文件上传
	handleChange = (fileList) => {
		let formData = new window.FormData();
		this.setState({upload: true}, () => {
			api.get("/upload/upload/uploadInfo").then(response => {
				if (response.code === 200) {
					formData.append("qqfile", fileList.file);
					formData.append("token", response.data.token);
					axios.post(response.data.upload_uri, formData).then(response => {
						if (response.data.code === 1000) {
							this.setState({upload: false, filename: response.data.data.file_original_name});
							this.props.form.setFieldsValue({
								url: response.data.data.filepath
							})
						}
					})
				}
			});
		})
	}

	render() {
		const {getFieldDecorator} = this.props.form;
		return (
			<div>
				{this.state.download ? <Row style={{textAlign: "center", paddingTop: "100px"}}>
					<Col span={8}></Col>
					<Col span={8}>
						<Form onSubmit={this.handleSubmit}>
							<FormItem wrapperCol={{span: 12, offset: 5}}>
								<Button type="primary" onClick={() => {
									window.open(this.state.download)
								}}>
									<Icon type="cloud-download-o"/>下载Excel模版
								</Button>
							</FormItem>
							<FormItem
								label="上传Excel"
								labelCol={{span: 5}}
								wrapperCol={{span: 12}}
								style={{marginTop: "20px"}}>
								{getFieldDecorator('url', {
									rules: [{required: true, message: '请选择上传文件!'}]
								})(<Input style={{"display": "none"}}/>)}
								{this.state.filename ?
									<div style={{paddingTop: "16px"}}>
										<span>{this.state.filename}</span>
									</div> :
									<Upload name="excel"
											listType="text"
											showUploadList={false}
											customRequest={this.handleChange.bind(this)}>
										<Button>
											<span><Icon type={this.state.upload ? 'loading' : 'upload'}/> 点击上传</span>
										</Button>
									</Upload>}
							</FormItem>
							<FormItem
								label="订单类型"
								labelCol={{span: 5}}
								wrapperCol={{span: 12}}
								style={{marginTop: "20px"}}>
								{getFieldDecorator('type', {
									rules: [{required: true, message: '请选择订单类型!'}],
								})(
									<Select placeholder="请选择订单类型">
										<Option value={1}>预约订单</Option>
										<Option value={2}>派单</Option>
									</Select>
								)}
							</FormItem>
							<FormItem wrapperCol={{span: 12, offset: 5}} style={{marginTop: "20px"}}>
								<Button type="primary" htmlType="submit">
									<Icon type={this.state.loading ? 'loading' : 'folder-add'}/>
									提交
								</Button>
								<Button style={{marginLeft: "10px"}} onClick={this.handleReset}>清除</Button>
							</FormItem>
						</Form>
					</Col>
					<Col span={8}></Col>
				</Row> : <Spin style={{width: "100%", marginTop: "22%"}}/>}
			</div>
		)
	}
}

export default Form.create()(VideoMark)
