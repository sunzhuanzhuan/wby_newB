import React, { Component } from 'react';
import { Button, Input, Table, Spin, message } from 'antd';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as TagAction from '../action'
import OperationslaberModal from '../components/OperationslabelModal'

const Search = Input.Search;

class Operationslabel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			loading: true,
			editType: "",//操作类型 delete add
			title: "",//弹窗标题
			deleteData: {},
			current: 1,//页面
			searchText: "",//搜索文本
			max: 0,//判断置底,
			lastPage: 1,//记录最有一页
			columns: [
				{
					title: '标签ID',
					dataIndex: 'id',
					key: 'id',
					width: 100,
				}, {
					title: '标签名称',
					dataIndex: 'name',
					key: 'name',
					width: 150,
					render: (text, record) => <Link key={record.id}
						to={"/ol/operationslabel/details/" + record.id}>{text}</Link>
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
					title: '标签展现顺序',
					dataIndex: 'sort_num',
					key: 'sort_num',
					width: 150,
				},
				{
					title: '修改标签顺序',
					dataIndex: 'editorder',
					key: 'editorder',
					width: 200,
					render: (text, record) => <div>
						{record.sort_num === 1 ? "置顶" :
							<a href="javascript:;"
								onClick={this.sortFun.bind(this, record.id, record.sort_num, "stick")}>置顶</a>}/
                        {record.sort_num === 1 ? "上移" :
							<a href="javascript:;"
								onClick={this.sortFun.bind(this, record.id, record.sort_num, "up")}>上移</a>}/
                        {record.sort_num === this.state.max && this.state.current === this.state.lastPage ? "下移" :
							<a href="javascript:;"
								onClick={this.sortFun.bind(this, record.id, record.sort_num, "down")}>下移</a>}/
                        {record.sort_num === this.state.max && this.state.current === this.state.lastPage ? "置底" :
							<a href="javascript:;"
								onClick={this.sortFun.bind(this, record.id, record.sort_num, "low")}>置底</a>}
					</div>
				},
				{
					title: 'A端发布',
					dataIndex: 'show_A',
					key: 'show_A',
					width: 100,
					render: text => {
						return parseInt(text) === 1 ? "是" : "否"
					}
				}, {
					title: 'B端发布',
					dataIndex: 'show_B',
					key: 'show_B',
					width: 100,
					render: text => {
						return parseInt(text) === 1 ? "是" : "否"
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
					render: (text, record) => <img src={text} key={record.id} width="25" alt="" />
				}, {
					title: '标识',
					dataIndex: 'marked_graph',
					key: 'marked_graph',
					width: 100,
					render: (text, record) => <img src={text} key={record.id} width="25" alt="" />
				},
				{
					title: '操作',
					dataIndex: 'operating',
					key: 'operating',
					width: 100,
					render: (text, record) => {
						return parseInt(record.show_A) === 2 && parseInt(record.show_B) === 2 ?
							<Button key={record.id} type="danger" size="small" ghost
								onClick={this.showModal.bind(this, "delete", "提示", {
									tag_id: record.id,
									operation_type: 2
								})}>删除</Button> : "";
					}
				}
			]
		}

	}

	//调用初始化列表数据
	componentWillMount() {
		this.initTagList();
	}

	//显示弹窗
	showModal = (types, title, data) => {
		this.setState({ editType: types, title: title, deleteData: data, visible: true })
	}
	//弹框确认
	handleOk = () => {
		this.setState({ visible: false })
	}
	//取消弹框
	handleCancel = () => {
		this.setState({ visible: false })
	}

	//初始化获取列表数据
	initTagList() {
		this.props.actions.requestTaglist("requestTaglist", { list_type: 1, page: 1 }).then(() => {
			this.setState({ loading: false });
			this.sortLabel(this.props.taglist);
		});
	}

	//分页
	changePage(page) {
		let data = this.state.searchText ? { list_type: 1, page: page, search: this.state.searchText } : {
			list_type: 1,
			page: page
		};
		this.setState({ loading: true, current: page }, () => {
			this.props.actions.requestTaglist("requestTaglist", data).then(() => {
				this.sortLabel(this.props.taglist);
				this.setState({ loading: false });
			});
		});

	}

	//搜索输入框
	search(value) {
		if (!value) return message.error("搜索条件不能为空");
		this.setState({ loading: true, searchText: value }, () => {
			this.props.actions.requestTaglist("requestTaglist", { list_type: 1, page: 1, search: value }).then(() => {
				this.setState({ loading: false, current: 1 });
			});
		});
	}

	//删除loading设置
	deleteLoading(data) {
		this.setState({ loading: data });
	}

	//添加标签后跳转到第一页面清空搜索条件
	addEdit() {
		this.setState({ loading: true, current: 1, searchText: "" }, () => {
			this.initTagList();
		});
	}

	//排序计算指定和置底
	sortLabel(data) {
		let lastPage = Math.ceil(data.count / 30);
		this.setState({ lastPage: lastPage }, () => {
			data.data.map(val => {
				if (this.state.current === lastPage) {
					this.setState({ max: val.sort_num }, () => {
						if (val.sort_num > this.state.max) {
							this.setState({ max: val.sort_num })
						}
					})
				}
			})
		});
	}

	//排序操作
	sortFun(Tagid, sort, mode) {
		this.props.actions.tagSort("tagSort", { Tagid: Tagid, sort: sort, mode: mode }, message)
			.then(() => {
				this.changePage(this.state.current);
			})
	}

	render() {
		return (
			<div className="operationslabel-box">
				<h3>运营标签管理-标签列表</h3>
				<div className="operationslabel-box-btnAndLink">
					<Button type="primary" icon="plus"
						onClick={this.showModal.bind(this, "add", "新建标签", {})}>新建标签</Button>
					<Link to="/ol/OperationslabelRecycle"><Button type="primary" icon="delete">标签回收站</Button></Link>
					{/*<Link to="/ol/blacklist">标签黑名单账号</Link>*/}
				</div>
				<div className="operationslabel-box-search">
					<Search placeholder="请输入标签名称、标签ID" style={{ "width": "550px" }} enterButton="搜索" size="large"
						onSearch={this.search.bind(this)} />
				</div>
				<div className="operationslabel-box-table">
					<Spin spinning={this.state.loading}>
						<Table columns={this.state.columns}
							dataSource={this.props.taglist.data}
							rowKey={record => record.id}
							scroll={{ x: 1650 }}
							pagination={{
								pageSize: 30,
								current: this.state.current,
								total: this.props.taglist.count,
								onChange: this.changePage.bind(this)
							}} />
					</Spin>
				</div>

				{/*弹窗区域*/}
				<OperationslaberModal
					title={this.state.title}
					deleteData={this.state.deleteData}
					editType={this.state.editType}
					current={this.state.current}
					searchText={this.state.searchText}
					addEdit={this.addEdit.bind(this)}
					deleteLoading={this.deleteLoading.bind(this)}
					visible={this.state.visible}
					handleOk={this.handleOk}
					lists={this.props.taglist}
					handleCancel={this.handleCancel}
					sortLabel={this.sortLabel.bind(this)} />
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
)(Operationslabel)



