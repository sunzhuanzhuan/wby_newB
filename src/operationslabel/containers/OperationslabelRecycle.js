import React, { Component } from 'react';
import { Button, Input, Table, Spin, Modal, message } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import * as TagAction from '../action'
import qs from "qs";
const Search = Input.Search;

class OperationslabelRecycle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			loading: true,
			current: 1,
			searchText: "",
			recycle: {},
			columns: [
				{
					title: '标签ID',
					dataIndex: 'id',
					key: 'id',
					width: 100,
					fixed: 'left',
				}, {
					title: '标签名称',
					dataIndex: 'name',
					key: 'name',
					width: 150,
					fixed: 'left',
					render: (text, record) => < Link key={record.id}
						to={{
							pathname: "/ol/OperationslabelRecycle/details/" + record.id,
							state: { time: record.modified_at }
						}} > {text}</Link>
				}, {
					title: '添加账号方式',
					dataIndex: 'add_account_mode',
					key: 'add_account_mode',
					width: 150,
					render: text => {
						return parseInt(text) === 1 ? "手动导入" : "脚本导入"
					}
				}, {
					title: '账号数',
					dataIndex: 'accountnumber',
					key: 'accountnumber',
					width: 200,
					render: text => {
						return (text.bespeak + text.dispatch) === 0 ?
							0 : text.bespeak + text.dispatch + "(预约类:" + text.bespeak + "," + "派单类:" + text.dispatch + ")"
					}
				}, {
					title: '标签简介',
					dataIndex: 'description',
					key: 'description',
					width: 200,
				}, {
					title: '图标',
					dataIndex: 'icon_path',
					key: 'icon_path',
					width: 100,
					render: (text, record) => <img src={text} key={record.id} alt="" width="25" />
				}, {
					title: '标识',
					dataIndex: 'marked_graph',
					key: 'marked_graph',
					width: 100,
					render: (text, record) => <img src={text} key={record.id} alt="" width="25" />
				}, {
					title: '进入回收站时间',
					dataIndex: 'modified_at',
					key: 'modified_at',
					width: 200
				}, {
					title: '操作',
					dataIndex: 'operating',
					key: 'operating',
					width: 100,
					fixed: 'right',
					render: (text, record) => <Button key={record.id} type="primary" size="small" ghost
						onClick={this.showModal.bind(this, {
							tag_id: record.id,
							operation_type: 1
						})}>恢复</Button>
				}
			]
		}

	}

	//调用初始化列表数据
	componentWillMount() {
		this.props.actions.requestTaglist("requestTaglist", { list_type: 2, page: 1 }).then(() => {
			this.setState({ loading: false });
		})
	}

	//显示弹窗
	showModal(data) {
		this.setState({ visible: true, recycle: data })
	}

	//弹框确认
	handleOk() {
		this.setState({ loading: true, visible: false }, () => {
			this.props.actions.operationTag("operationTag", this.state.recycle, message)
				.then(() => {
					this.props.actions.requestTaglist("requestTaglist", this.reqData())
				})
				.then(() => {
					this.setState({ loading: false })
				})
		})

	}

	//取消弹框
	handleCancel() {
		this.setState({ visible: false })
	}

	//分页
	changePage(page) {
		this.setState({ loading: true, current: page }, () => {
			this.props.actions.requestTaglist("requestTaglist", this.reqData()).then(() => {
				this.setState({ loading: false });
			});
		});
	}

	//搜索输入框
	search(value) {
		if (!value) return message.error("搜索条件不能为空");
		this.setState({ loading: true, searchText: value }, () => {
			this.props.actions.requestTaglist("requestTaglist", { list_type: 2, page: 1, search: value }).then(() => {
				this.setState({ loading: false, current: 1 });
			});
		});
	}

	//设置请求数据
	reqData() {

		let current = this.props.taglist.data.length === 1 && this.state.current !== 1 ? this.state.current - 1 : this.state.current
		return this.state.searchText ? { list_type: 2, page: current, search: this.state.searchText } : {
			list_type: 2,
			page: current
		};
	}

	//跳转详情页
	routePush(id, time) {
		// this.props.router.push({
		// 	pathname: "/ol/OperationslabelRecycle/details/" + id,
		// 	state: { time: time }
		// });
		//修改了push的方式
		// console.log(this.props.history)
		this.props.history.push({
			pathname: '/ol/OperationslabelRecycle/details',
			search: '?' + qs.stringify({ time: time })
		})

	}

	render() {
		return (
			<div className="operationslabel-box">
				<h3>运营标签管理-标签回收站</h3>
				<div className="operationslabel-box-search">
					<Search placeholder="请输入标签名称、标签ID" style={{ "width": "550px" }} enterButton="搜索" size="large"
						onSearch={this.search.bind(this)} />
				</div>
				<div className="operationslabel-box-table">
					<Spin spinning={this.state.loading}>
						<Table columns={this.state.columns}
							rowKey={record => record.id}
							dataSource={this.props.taglist.data}
							scroll={{ x: 1300 }}
							pagination={{
								pageSize: 30,
								current: this.state.current,
								total: this.props.taglist.count,
								onChange: this.changePage.bind(this)
							}} />
					</Spin>
				</div>

				<Modal
					title="提示"
					visible={this.state.visible}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<p>确定恢复该标签吗？</p>
				</Modal>
			</div>

		)
	}
}


const mapStateToProps = (state) => {
	return { taglist: state.operationslabelReducers.requestTaglist.TagList || {} }
};

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...TagAction
	}, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(OperationslabelRecycle)



