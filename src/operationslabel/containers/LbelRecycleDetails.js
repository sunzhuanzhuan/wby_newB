import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Button, Modal, message, Spin } from "antd";
import * as TagAction from "../action";
import AccountList from '../components/AccountList'
class LbelRecycleDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		}
	}

	componentWillMount() {
		this.props.actions.tagDetailSearchType("tagDetailSearchType", {});
		this.props.actions.tagDetails("tagDetails", { tagId: this.props.match.params.id });
		//this.getTagDetailSearchList(9, 1, "", 2, this.props.params.id);
		this.getTagDetailSearchList(9, 1, "", 2, this.props.match.params.id);
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
	//显示弹窗
	showModal = () => {
		this.setState({ visible: true })
	}
	//弹框确认
	handleOk = () => {
		this.setState({ visible: false }, () => {
			this.props.actions.operationTag("operationTag", { tag_id: this.props.match.params.id, operation_type: 1 }, message)
				.then(() => {
					this.props.history.push("/ol/operationslabel");
				})
		})
	}
	//取消弹框
	handleCancel = () => {
		this.setState({ visible: false })
	}

	render() {
		const { id, name, icon_path, description, accountnumber, marked_graph, add_account_mode } = this.props.tagdetails;
		const search = this.props.location.state
		return (
			<div>
				{id ? <div className="operationslabel-detail">
					<h3>
						<span>运营标签管理-标签详情页（回收站标签）</span>
						<Button type="primary" size="small" className="btn-detail-edit"
							onClick={this.showModal.bind(this)}>恢复</Button>
					</h3>
					<h4 className="title">
						<span className="sub-title">基本信息</span>
					</h4>

					<Row className="basic-info">
						<Col className='text-right' span={3}>标签名称：</Col>
						<Col span={5}>{name}</Col>
						<Col className='text-right' span={3}>图标：</Col>
						<Col span={5}><img src={icon_path} alt="" width="25" /></Col>
						<Col span={8}></Col>
					</Row>
					<Row className="basic-info">
						<Col className='text-right' span={3}>标签简介：</Col>
						<Col span={5}>{description}</Col>
						<Col className='text-right' span={3}>标识：</Col>
						<Col span={5}><img src={marked_graph} alt="" width="25" /></Col>
						<Col span={8}></Col>
					</Row>
					<Row className="basic-info">
						<Col className='text-right' span={3}>添加账号方式：</Col>
						<Col span={5}>{add_account_mode === 1 ? "手工导入" : "执行脚本"}</Col>
						<Col className='text-right' span={3}>进入回收站时间：</Col>
						<Col span={5}>{search.time}</Col>
						<Col span={8}></Col>
					</Row>
					<h4 className="title">
						<span className="sub-title">账号信息</span>
						<em>账号数：{accountnumber ? accountnumber.bespeak + accountnumber.dispatch === 0 ?
							0 : accountnumber.bespeak + accountnumber.dispatch + " (预约类:" + accountnumber.bespeak +
							"," + "派单类:" + accountnumber.dispatch + ")" : ""}
						</em>
					</h4>

					{/*弹窗*/}
					<Modal
						title="提示"
						visible={this.state.visible}
						onOk={this.handleOk}
						onCancel={this.handleCancel}>
						<p>确定恢复该标签吗？</p>
					</Modal>

					{/*查找结果list*/}
					{(accountnumber.bespeak + accountnumber.dispatch) !== 0 ? <AccountList
						tagDetailSearchType={this.props.tagDetailSearchType}
						tagDetailSearchList={this.props.tagDetailSearchList}
						getTagDetailSearchList={this.getTagDetailSearchList.bind(this)}
						tagid={this.props.match.params.id}
						deleteAccount={this.props.actions.deleteAccount}
						add_account_mode={add_account_mode}
					/> : null}
				</div> : <Spin tip="加载中..." style={{ width: "100%", marginTop: "22%" }}></Spin>}
			</div>
		)

	}
}

const mapStateToProps = (state) => {
	return {
		tagdetails: state.operationslabelReducers.tagDetails.Tagdetails || {},
		tagDetailSearchType: state.operationslabelReducers.tagDetailSearchType || {},
		tagDetailSearchList: state.operationslabelReducers.tagDetailSearchList || {},
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
)(LbelRecycleDetails)


