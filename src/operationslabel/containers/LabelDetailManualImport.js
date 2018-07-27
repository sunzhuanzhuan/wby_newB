import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Button, Checkbox, Input, Radio, Form, Spin, message, Upload, Icon, notification } from "antd";
import * as TagAction from "../action";
import api from "../../api";
import axios from "axios";

import BulkImportAccountModal from '../components/BulkImportAccountModal'
import AccountList from '../components/AccountList'

class LabelDetailManualImport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			importAccountVisible: false,
			releaseEdit: true, //发布编辑状态切换
			InformationEdit: true,//基本信息编辑状态切换
			icon_pathloading: false,//图标上传loading
			marked_graphloading: false,//表示上传loading
			icon_pathrules: true,//图标验证
			marked_graphrules: true,//标示验证
			imgUploadsuccess: true,//判断图片是否上传成功
			textName: true,//标签名称验证
			textdescription: true,//简介验证
		}
	}

	componentWillMount() {
		this.props.actions.tagDetailSearchType("tagDetailSearchType", {});
		this.initTagdetails();
		this.getTagDetailSearchList("9", 1, "", 3, this.props.match.params.id);
	}

	getTagDetailSearchList = (platform, page, value, isbatch, tagid) => {
		return this.props.actions.tagDetailSearchList("tagDetailSearchList", {
			platform: platform,
			page: page,
			search: value,
			isbatch: isbatch,
			tagid: tagid
		});

	}

	//批量导入
	showImportAccountModal = () => {
		this.setState({ importAccountVisible: true })
	}
	handleImportAccountCancel = () => {
		this.setState({ importAccountVisible: false })
	}

	//发布信息编辑
	showEdit(show, edit) {
		if (show === "releaseedit") {
			if (edit === "show") this.setState({ releaseEdit: false });
			if (edit === "cancel") this.setState({ releaseEdit: true }, () => {
				this.initTagdetails();
			});
			if (edit === "confirm") {
				this.props.actions.tagUpdate("tagUpdate", {
					TagId: this.props.match.params.id,
					show_A: this.state.show_A,
					show_B: this.state.show_B
				}, message).then(() => {
					this.setState({ releaseEdit: true });
				})
			}
		}
		if (show === "InformationEdit") {
			if (edit === "show") this.setState({ InformationEdit: false });
			if (edit === "cancel") this.setState({ InformationEdit: true, textdescription: true, textName: true }, () => {
				this.initTagdetails();
			});
			if (edit === "confirm") {
				let regName = /^.{1,15}$/;
				let regdescription = /^.{0,30}$/;
				if (!this.state.imgUploadsuccess) {
					notification.error({
						message: '图片未上传完毕！请稍后在保存'
					});
				}
				this.setState({
					textName: regName.test(this.state.name),
					textdescription: regdescription.test(this.state.description)
				}, () => {
					if (this.state.imgUploadsuccess && this.state.textName && this.state.textdescription) {
						this.props.actions.tagUpdate("tagUpdate", {
							TagId: this.props.match.params.id,
							name: this.state.name,
							description: this.state.description,
							icon_path: this.pachImg(this.state.icon_path),
							marked_graph: this.pachImg(this.state.marked_graph)
						}, message).then(() => {
							this.setState({ InformationEdit: true, textdescription: true, textName: true });
						});
					}
				});

			}
		}

	}

	//图片路径处理
	pachImg(url) {
		if (url) {
			let str = url.split("vol")[1];
			return "/vol" + str;
		} else {
			return "";
		}
	}

	//发布状态A B 展示控制
	onChangeA(e) {
		let name = e.target.name;
		let checked = e.target.checked;
		if (name === "show_A") this.setState({ show_A: checked ? 1 : 2 });
		if (name === "show_B") this.setState({ show_B: checked ? 1 : 2 });
	}

	//图片上传
	handleChange = (fileList) => {
		let name = fileList.filename;
		let isJPG = fileList.file.type === 'image/jpeg' || fileList.file.type === 'image/jpg' || fileList.file.type === 'image/png' || fileList.file.type === 'image/gif';
		let isLt3M = fileList.file.size / 1024 / 1024 < 3;
		if (!isJPG || !isLt3M) {
			if (name === "icon_path") this.setState({ icon_pathrules: false, icon_path: "" });
			if (name === "marked_graph") this.setState({ marked_graphrules: false, marked_graph: "" });
		} else {
			this.setState({ imgUploadsuccess: false });
			if (name === "icon_path") this.setState({ icon_pathloading: true, icon_pathrules: true });
			if (name === "marked_graph") this.setState({ marked_graphloading: true, marked_graphrules: true });
			let formData = new window.FormData();
			api.get("/upload/upload/uploadInfo", { params: { upload_type: "img" } }).then(response => {
				if (response.code === 200) {
					formData.append("qqfile", fileList.file);
					formData.append("token", response.data.token);
					axios.post(response.data.upload_uri, formData).then(response => {
						if (response.data.code === 1000) {
							if (name === "icon_path") this.setState({
								icon_path: response.data.data.url,
								icon_pathloading: false
							}, () => {
								this.setState({ imgUploadsuccess: true });
							});
							if (name === "marked_graph") this.setState({
								marked_graph: response.data.data.url,
								marked_graphloading: false
							}, () => {
								this.setState({ imgUploadsuccess: true });
							});
						} else {
							notification['error']({
								message: response.data.msg
							});
							this.setState({
								icon_pathloading: false,
								marked_graphloading: false,
							})
						}
					})
				}
			});
		}
	};

	//删除图标和标示
	deleteImgUrl(type) {
		if (type === "icon_path") this.setState({ icon_path: "" });
		if (type === "marked_graph") this.setState({ marked_graph: "" });
	}

	//初始化数据
	initTagdetails() {
		this.props.actions.tagDetails("tagDetails", { tagId: this.props.match.params.id }).then(() => {
			this.setState({
				...this.props.tagdetails
			});
		});
	}

	//修改名称和简介
	textChange(e) {
		let value = e.target.value;
		if (e.target.name === "name") this.setState({ name: value });
		if (e.target.name === "description") this.setState({ description: value });
	}

	render() {
		const {
			releaseEdit,
			InformationEdit,
			id,
			name,
			description,
			accountnumber,
			show_A,
			show_B,
			add_account_mode,
			icon_path,
			marked_graph,
			icon_pathrules,
			marked_graphrules,
			icon_pathloading,
			marked_graphloading,
			textName,
			textdescription
		} = this.state;

		return (
			<div>
				{id && this.props.tagDetailSearchType && this.props.tagDetailSearchList ?
					<div className="operationslabel-detail">
						<Form>
							<h3>运营标签管理-标签详情页</h3>
							<h4 className="title">
								<span className="sub-title">发布状态</span>
								{/* 有账号数展示 */}
								{(accountnumber.bespeak + accountnumber.dispatch) !== 0 ? <span>
									{releaseEdit ?
										<Button type="primary" size="small" className="btn-detail-edit"
											onClick={this.showEdit.bind(this, "releaseedit", "show")}>
											编辑
    </Button>
										:
										<span>
											<Button type="primary" size="small" style={{ marginRight: "10px" }}
												onClick={this.showEdit.bind(this, "releaseedit", "confirm")}>保存</Button>
											<Button size="small"
												onClick={this.showEdit.bind(this, "releaseedit", "cancel")}>取消</Button>
										</span>
									}
								</span> : ""
								}
								{/* 有账号数展示 */}
							</h4>
							{releaseEdit ?
								<Row className="post-status">
									<Col className='text-right' span={3}>A端发布：</Col>
									<Col span={5}>{show_A === 1 ? "是" : "否"}</Col>
									<Col className='text-right' span={3}>B端发布：</Col>
									<Col span={5}>{show_B === 1 ? "是" : "否"}</Col>
									<Col span={8}></Col>
								</Row> :
								<Row className="post-status">
									<Col className='text-right' span={3}>标签发布终端：</Col>
									<Col span={21}>
										<Checkbox name="show_A" defaultChecked={show_A === 1 ? true : false}
											onChange={this.onChangeA.bind(this)}>A端</Checkbox>
										<Checkbox name="show_B" defaultChecked={show_B === 1 ? true : false}
											onChange={this.onChangeA.bind(this)}>B端</Checkbox>
									</Col>
								</Row>
							}
							{/* 编辑状态展示 */}

							{/* 有账号数展示 */}
							{/*<Row className="post-status">*/}
							{/*<Col className='text-right' span={3}>终端账号排序：</Col>*/}
							{/*<Col span={21}>*/}
							{/*/!* 编辑状态展示 *!/*/}


							{/*/!* 编辑状态展示 *!/*/}

							{/*<Button type="primary" size="small">粉丝数升序</Button>*/}
							{/*</Col>*/}
							{/*</Row>*/}
							{/* 有账号数展示 */}

							<h4 className="title">
								<span className="sub-title">基本信息</span>
								{InformationEdit ?
									<Button type="primary" size="small" className="btn-detail-edit"
										onClick={this.showEdit.bind(this, "InformationEdit", "show")}>
										编辑
                                    </Button> : <span>
										<Button type="primary" size="small" style={{ marginRight: "10px" }}
											onClick={this.showEdit.bind(this, "InformationEdit", "confirm")}>保存</Button>
										<Button size="small"
											onClick={this.showEdit.bind(this, "InformationEdit", "cancel")}>取消</Button>
									</span>}
							</h4>

							<Row className="basic-info">
								<Col className='text-right' span={3}><i
									style={{ color: "red", paddingRight: "5px" }}>*</i>标签名称：</Col>
								<Col span={5}>
									{InformationEdit ? name : < Input name="name" value={name} placeholder="标签名称编辑状态"
										onChange={this.textChange.bind(this)} />}
									<div style={{
										"color": "red",
										"display": textName ? "none" : "block"
									}}>标签名不能为空,不得超过15个字!
                                    </div>
								</Col>
								<Col className='text-right' span={3}>图标：</Col>
								<Col span={13}>
									{InformationEdit ? <img src={icon_path} alt="" width="25" /> :
										<div>
											{icon_path ? <span>
												<img src={icon_path} alt="" width="25" />
												< a href="javascript:;"
													style={{
														"display": icon_path ? "inline-block" : "none",
														marginLeft: "10px"
													}}
													onClick={this.deleteImgUrl.bind(this, "icon_path")}>删除</a>
											</span> : <div>
													<Upload name="icon_path"
														listType="text"
														showUploadList={false}
														customRequest={this.handleChange.bind(this, )}>
														<Button size="small" type="primary">
															<Icon type={icon_pathloading ? 'loading' : 'upload'} />上传
                                                    </Button>
													</Upload>
													<p className="tips-upload"
														style={{ "color": icon_pathrules ? "" : "red" }}>注：仅jpg、jpeg、png、gif格式，不大于3M，建议高度40像素</p>
												</div>}
										</div>}
								</Col>
								<Col span={8}></Col>
							</Row>
							<Row className="basic-info">
								<Col className='text-right' span={3}>标签简介：</Col>
								<Col span={5}>
									{InformationEdit ? description :
										<Input name="description" value={description} placeholder="标签简介编辑状态"
											onChange={this.textChange.bind(this)} />}
									<div style={{
										"color": "red",
										"display": textdescription ? "none" : "block"
									}}>标签简介不得超过30个字!
                                    </div>
								</Col>
								<Col className='text-right' span={3}>标识：</Col>
								<Col span={13}>
									{InformationEdit ? <img src={marked_graph} alt="" width="25" /> :
										<div>
											{marked_graph ? <span>
												<img src={marked_graph} alt="" width="25" />
												< a href="javascript:;"
													style={{
														"display": marked_graph ? "inline-block" : "none",
														marginLeft: "10px"
													}}
													onClick={this.deleteImgUrl.bind(this, "marked_graph")}>删除</a>
											</span> :
												<div><Upload name="marked_graph"
													listType="text"
													showUploadList={false}
													customRequest={this.handleChange.bind(this, )}>
													<Button size="small" type="primary">
														<Icon type={marked_graphloading ? 'loading' : 'upload'} />上传
                                                    </Button>
												</Upload>
													<p className="tips-upload"
														style={{ "color": marked_graphrules ? "" : "red" }}>注：仅jpg、jpeg、png、gif格式，不大于3M，建议高度40像素</p>
												</div>}
										</div>}
								</Col>
							</Row>
							<Row className="basic-info">
								<Col className='text-right' span={3}>添加账号方式：</Col>
								<Col span={5}>
									{InformationEdit ? <span>{add_account_mode === 1 ? "手工导入" : "执行脚本"}</span> :
										<Radio defaultChecked={true}>{add_account_mode === 1 ? "手工导入" : "执行脚本"}</Radio>}
								</Col>
								<Col span={3}></Col><Col span={5}></Col>
								<Col span={8}></Col>
							</Row>
						</Form>
						<h4 className="title">
							<span className="sub-title">账号信息</span>
							<em>账号数：{accountnumber ? accountnumber.bespeak + accountnumber.dispatch === 0 ?
								0 : accountnumber.bespeak + accountnumber.dispatch + " (预约类:" + accountnumber.bespeak +
								"," + "派单类:" + accountnumber.dispatch + ")" : ""}
							</em>
							{/*只 手工导入 状态下出现*/}
							{add_account_mode === 1 ? <Button
								type="primary"
								size="small"
								className="btn-detail-edit"
								onClick={this.showImportAccountModal.bind(this)}
							>{accountnumber.bespeak + accountnumber.dispatch === 0 ? "批量导入账号" : "继续导入账号"} </Button> : null}
							{/*只 手工导入 状态下出现*/}

						</h4>
						{/*批量导出弹出框*/}
						<BulkImportAccountModal
							visible={this.state.importAccountVisible}
							handleOk={this.handleImportAccountOk}
							handleCancel={this.handleImportAccountCancel}
							tagid={this.props.match.params.id}
							initTagdetails={this.initTagdetails.bind(this)}
							getTagDetailSearchList={this.getTagDetailSearchList.bind(this)}
							name={name} />

						{/*查找结果list*/}
						{(accountnumber.bespeak + accountnumber.dispatch) !== 0 ? <AccountList
							tagDetailSearchType={this.props.tagDetailSearchType}
							tagDetailSearchList={this.props.tagDetailSearchList}
							getTagDetailSearchList={this.getTagDetailSearchList.bind(this)}
							tagid={this.props.match.params.id}
							deleteAccount={this.props.actions.deleteAccount}
							add_account_mode={add_account_mode}
							initTagdetails={this.initTagdetails.bind(this)}
						/> : null}

					</div> : <Spin tip="加载中..." style={{ width: "100%", marginTop: "22%" }}></Spin>}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		tagDetailSearchType: state.operationslabelReducers.tagDetailSearchType || {},
		tagDetailSearchList: state.operationslabelReducers.tagDetailSearchList || {},
		tagdetails: state.operationslabelReducers.tagDetails.Tagdetails || {}
	}
};
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...TagAction
	}, dispatch)
});


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LabelDetailManualImport);
