import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { accountUploadAction } from "../actions/index";
import * as action from "../actions/index";
import axios from "axios";

import "./index.less";
import { Button, Upload, message, Steps } from "antd";
const Step = Steps.Step;

const steps = [
	{
		title: "选择平台",
		description: "Choose the platform."
	},
	{
		title: "填写信息并上传",
		description: "Fill in and upload information."
	},
	{
		title: "完成",
		description: "Finished."
	}
];

message.config({
	top: 200
});

class ListFrom extends React.Component {
	constructor(props) {
		super(props);
		this.state = { current: 0, pid: 0 };
	}
	componentWillMount() {
		this.props.actions.getIcon();
		this.props.actions.getUploadInfo();
	}

	render() {
		let { tempInfo, typeInfo } = this.props;
		let { current } = this.state;
		const uploadProps = {
			// name: "qqfile",
			// action: "/upload/upload/",
			// defaultFileList: [],
			// data: { token: this.props.uploadInfo.token },

			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			accept: ".xlsx,.xls",
			showUploadList: false,

			customRequest: obj => {
				message.loading("loading...", 0);
				let content = new window.FormData();
				content.append("token", this.props.uploadInfo.token);
				content.append("qqfile", obj.file);
				axios
					.post(this.props.uploadInfo.upload_uri, content)
					.then(res => {
						if (res.data.code === 1000) {
							message.destroy();
							this.props.actions.postUpload(res.data.data);
							this.props.actions.excelImport({
								url: this.props.postLoadInfo.url,
								weibo_type: this.state.pid,
								token: this.props.postLoadInfo.token
							});
							this.props.actions.getUploadInfo();
							this.next();
						} else if (res.data.code === 304) {
							message.destroy();
							window.alert("上传失败，请上传填写好的入库模板！");
						} else {
							message.destroy();
							window.alert("上传文件失败！");
						}
					});
			}
		};

		return (
			<div className="account-upload-container">
				<Steps current={current}>
					{steps.map(item => (
						<Step
							key={item.title}
							title={item.title}
							description={item.description}
						/>
					))}
				</Steps>
				<div className="steps-content">
					{current === 0 ? (
						<ul className="type-list clearfix">
							{typeInfo.map((item, index) => {
								if (
									item.platform_name === "抖音" ||
									item.platform_name === "淘宝达人" ||
									item.platform_name === '新浪微博' ||
									item.platform_name === '微信公众号'
								) {
									return (
										<li
											key={index}
											onClick={() => {
												this.setState({
													pid: item.pid
												});
												this.props.actions.getInfo(
													item.pid
												);
												this.next();
											}}
										>
											<div className="img-content">
												<img
													src={item.platform_icon}
													alt={item.platform_name}
												/>
											</div>
											<p>{item.platform_name}</p>
										</li>
									);
								}
							})}
						</ul>
					) : null}
					{current === 1 ? (
						<div className="info-box">
							<dl className="title">
								<dd>
									<title>入库平台：</title>
									{tempInfo.weibo_type_name}
								</dd>
								<dd>
									<title>批量入库：</title>
									<Button
										onClick={() => {
											window.open(tempInfo.template_url);
										}}
										type="primary"
									>
										下载模板
									</Button>
									&nbsp;&nbsp;
									<Upload {...uploadProps}>
										<Button type="primary">
											上传账号信息
										</Button>
									</Upload>
								</dd>
								<dd>
									<title>操作方法：</title>
									<ol>
										<li>点击【下载模板】按钮，下载模板</li>
										<li>将入库账号的信息填写在模板中</li>
										<li>
											点击【上传账号信息】按钮，上传填写好的模板
										</li>
									</ol>
								</dd>
							</dl>
							<p style={{ marginTop: -20 }}>
								<title>
									<b>提示：</b>
								</title>
								<span className="color_highlight">
									一次最多批量入库500个账号！
								</span>
							</p>
							<title>&nbsp;</title>
							<Button
								size="default"
								onClick={() => {
									this.prev();
								}}
								style={{ marginTop: "10px" }}
							>
								返回上一步
							</Button>
						</div>
					) : null}
					{current === 2 ? (
						<div className="message-back">
							<h6>上传账号信息成功！</h6>
							<p>
								系统处理成功后，会将入库结果发送至您和对应媒介经理的邮箱。
							</p>
							<Button
								type="primary"
								onClick={() => {
									this.goon();
								}}
							>
								继续批量入库
							</Button>
						</div>
					) : null}
				</div>
			</div>
		);
	}
	prev() {
		let step = this.state.current - 1;
		this.setState({ current: step });
	}
	next() {
		let step = this.state.current + 1;
		this.setState({ current: step });
	}
	goon() {
		this.setState({ current: 0 });
	}
}

ListFrom.PropTypes = {
	actions: PropTypes.shape({
		getInfo: PropTypes.func.isRequired,
		getUploadInfo: PropTypes.func.isRequired
	})
};
const mapStateToProps = state => {
	return { ...state.accountUploadReducers };
};

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...action }, dispatch)
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ListFrom);
