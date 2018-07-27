import React, { Component } from "react";
import {
	Select, Form, Input, Button, Modal, Table, message
} from "antd";

// import { allSelect, platformTypesMap } from "../../constants/config";
import { connect } from "react-redux";
import * as actions from '../../actions'

import FilterContainer from "../../components/FilterContainer";
import MediaManagerSelect from "../../base/MediaManagerSelect";
import './allocateTask.less';


const FormItem = Form.Item
const Option = Select.Option


@connect(state => state.extensionNumber, actions)
class AllocateTask extends Component {
	state = {
		filter: {
			// user_group_ids: [17]
		},
		currentPage: 1,
		selectedRowKeys: [],
		createModalShow: false
	}
	// 获取列表方法
	getList = async (query = {}) => {
		let { getMainAllotList } = this.props
		// let { filter } = this.state
		this.setState({ tableLoading: true })
		// await getMainAllotList({ ...filter, page: 1, ...query })
		await getMainAllotList({  page: 1, ...query })
		this.setState({
			filter: {  ...query },
			tableLoading: false,
			currentPage: query.page || 1,
			selectedRowKeys: [],
			createModalShow: false
		})
	}

	componentWillMount() {
		// 获取拓号任务分配列表
		this.getList()
	}

	showModal = () => {
		this.setState({ createModalShow: true });
	}

	render() {
		let { mainAllotList, postMainAccount, getMediaManagerList, mediaManagerList } = this.props
		let { count = 0, page = 1, pageNum = 100, map, list } = mainAllotList || {}
		let columns = [
			{
				title: '主账号',
				dataIndex: 'identity_name',
				align: 'center',
				render: (identity_name) => {
					return identity_name;
				}
			}, {
				title: '拓展媒介经理',
				dataIndex: 'real_name',
				align: 'center',
			}
		]
		let rowSelection = {
			getCheckboxProps: (/* record */) => ({
				disabled: false
			}),
			selectedRowKeys: this.state.selectedRowKeys,
			onChange: (selectedRowKeys) => {
				this.setState({ selectedRowKeys })
			},
		};
		let pagination = {
			position: 'top',
			showTotal: total => `共 ${Math.ceil(total / pageNum)} 页，${total} 条`,
			size: 'small',
			hideOnSinglePage: true,
			onChange: (current) => {
				this.getList({ page: current })
			},
			total: count,
			pageSize: pageNum,
			current: Number(page)
		}
		let primary_key = 'user_id'

		let dataSoure = list.map(item => map[item])
		return (
			<div className='extension-number main-allocate-page'>
				<header className='page-content'>
					<FilterContainer>
						<FilterForm getList={this.getList} />
					</FilterContainer>
				</header>
				<main>
					<Table rowSelection={rowSelection} pagination={pagination}
						bordered columns={columns}
						rowKey={record => record[primary_key]}
						loading={this.state.tableLoading}
						dataSource={dataSoure}
					/>
				</main>
				<footer className='page-footer'>
					<Button type='primary' style={{ width: '120px' }}
						className='next-button' disabled={this.state.selectedRowKeys.length <= 0} onClick={this.showModal}>转移媒介经理</Button>
				</footer>
				{this.state.createModalShow ?
					< Modal visible={true}
						className='extension-number-modal'
						title='微播易提醒您：请选择转移主账号媒介'
						width={800}
						footer={null}
						onCancel={() => {
							this.setState({
								createModalShow: false
							})
						}}
					>
						<MediaForm
							selected={this.state.selectedRowKeys}
							wrappedComponentRef={node => this.formRef = node}
							getMediaManagerList={getMediaManagerList}
							mainAllotList={mainAllotList}
							mediaManagerList={mediaManagerList}
							postMainAccount={postMainAccount}
							getList={this.getList}
						/>
					</Modal>
					: null
				}
			</div>
		);
	}
}

@Form.create({})
class FilterForm extends Component {
	constructor(props) {
		super(props)
	}

	submitQuery = (e) => {
		let { getList } = this.props
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				getList(values)
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (<div><Form layout="inline" onSubmit={this.submitQuery}>
			<FormItem label="拓展媒介经理">
				{
					getFieldDecorator('admin_user_id', {})(
						<MediaManagerSelect getPopupContainer={() => document.querySelector('.main-allocate-page')}
							group={[39,40,56]} style={{ width: 120 }} />)
				}
			</FormItem>
			<FormItem label="主账号">
				{
					getFieldDecorator('identity_name', {})(
						<Input placeholder='主账号' />
					)
				}
			</FormItem>
			<FormItem>
				<Button ghost type='primary' style={{ width: '80px' }}
					htmlType="submit"
					className='filter-button'>查询</Button>
			</FormItem>
		</Form>
		</div>)
	}
}

@Form.create({})
class MediaForm extends Component {
	state = {
		current: 1,
		order: '',
		userIdFilter: null,
		tableLoading: false
	}
	// 分配媒介
	handleAllocate = (data) => {
		let { postMainAccount, getList, selected, mainAllotList } = this.props;
		let { map } = mainAllotList || {}
		let body = {
			owner_admin_id: data.user_id,
			user_ids: selected.map(key => map[key]['user_id'])
		};
		this.setState({ tableLoading: true })
		// 发送请求
		postMainAccount(body).then(({ msg }) => {
			this.setState({ tableLoading: true })
			message.success(msg, 1.2)
			// 重新拉取数据 + 复位
			getList()
		})
	}
	submitQuery = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				// 查询
				// console.log(values);
				this.setState(values)
			}
		});
	}

	render() {
		const { order, userIdFilter } = this.state
		const { mediaManagerList } = this.props
		const { getFieldDecorator } = this.props.form
		// 查询
		let dataSource = [...mediaManagerList]
		dataSource = dataSource.filter(item => [32,33,34,38].some(d => item.user_group_id.some(i => d == i)))
		if (userIdFilter) {
			dataSource = dataSource.filter(item => item.user_id == userIdFilter)
		}
		if (order) {
			dataSource.sort((a, b) => a[order] - b[order])
		}
		const columns = [{
			title: '资源经理',
			dataIndex: 'real_name'
		}, {
			title: '主账号总量',
			dataIndex: 'user_count',
		}, {
			title: '子账号总量',
			dataIndex: 'account_count',
		}, {
			title: '操作',
			dataIndex: '1',
			render: (n, item) => {
				return <Button size='small' onClick={this.handleAllocate.bind(this, item)}>分配</Button>
			}
		}];
		let pagination = {
			position: 'top',
			showTotal: () => `共 ${Math.ceil(dataSource.length / 20)} 页`,
			size: 'small',
			hideOnSinglePage: true,
			onChange: (current) => {
				this.setState({ current: current })
			},
			total: dataSource.length,
			pageSize: 20,
			current: this.state.current
		}
		return (
			<div>
				<Form layout="inline" onSubmit={this.submitQuery}>
					<FormItem label="资源媒介经理">
						{
							getFieldDecorator('userIdFilter', {})(
								<MediaManagerSelect group={[32,33,34,38]} style={{ width: 120 }} />)
						}
					</FormItem>
					<FormItem label="排序">
						{
							getFieldDecorator('order', {})(
								<Select
									allowClear
									placeholder='选择排序方式'
									style={{ width: 180 }}
								>
									<Option value="user_count">主账号总量从低到高</Option>
									<Option value="account_count">子账号总量从低到高</Option>
								</Select>
							)
						}
					</FormItem>
					<FormItem>
						<Button ghost type='primary' style={{ width: '80px' }}
							htmlType="submit"
							className='filter-button'>查询</Button>
					</FormItem>
				</Form>
				<Table columns={columns}
					loading={this.state.tableLoading}
					rowKey={record => record['user_id']}
					dataSource={dataSource} bordered={true} pagination={pagination} />
			</div>
		)
	}
}


export default AllocateTask;
