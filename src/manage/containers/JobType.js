import React, { Component } from "react";
import { connect } from "react-redux";
import * as action from '../actions/index'
import {
	Input, Table, Button, Modal, Form, message, Popover, Checkbox
} from "antd";
import './branch.less'
import qs from "qs";


const Search = Input.Search;
const FormItem = Form.Item;
// const Option = Select.Option;
const { TextArea } = Input;

@connect(
	state => state.manage, action
)
class Branch extends Component {
	state = {
		loading: false,
		currentPage: 1,
		visible: false,
		jobTypeTitle: '添加岗位类型',
		zhName: '',
		branchZhName: '',
		parentCode: '',
		type: '',
		roleId: [],
	}

	// 获取列表方法
	getList = async (query = { page: 1, page_size: 20 }) => {
		let { getJobTypeList, getRoleJobList } = this.props
		this.setState({ loading: true })
		getRoleJobList()
		getJobTypeList({ ...query }).then(() => {
			this.setState({
				currentPage: 1,
				loading: false
			})
		})
	}
	componentDidMount() {
		this.getList()

	}
	showModal = () => {
		this.setState({
			visible: true,
			jobTypeTitle: '添加岗位类型',
			type: 'add'
		});
	}
	handleEditBranch(record) {
		this.setState({ jobTypeTitle: '修改岗位类型', visible: true, type: 'edit' }, () => {
			let { queryJobType } = this.props
			queryJobType({ id: record.id })

		})
	}
	handleDeleteBranch(id) {
		let { deleteJobType } = this.props
		deleteJobType({ id }).then(() => {
			message.success('删除成功')
			this.getList()
		})
	}
	handlesearch(value) {
		let query = { page: 1, page_size: 20, zh_name: value }
		let { getJobTypeList } = this.props
		this.setState({ loading: true, zhName: value })
		getJobTypeList({ ...query }).then(() => {
			this.setState({
				currentPage: 1,
				loading: false
			})
		}).catch(() => {

		})
	}
	jump(href, record) {
		const params = {
			id: record.id
		};
		//修改了push的方式
		this.props.history.push({
			pathname: href,
			search: '?' + qs.stringify(params)
		})
	}
	render() {

		let { jobTypeList, branchListAll, addJobType, queryJobTypeSucc, editJobType, branchTree, getBranchTree, jobRoleListAll } = this.props;
		let { currentPage = 1, perPage = 20, totalCount = 0, map, list } = jobTypeList || {}
		let arr = Object.values(branchTree);
		let treeData = []
		function formatData(params) {
			for (let j = 0; j < params.length; j++) {
				params[j].label = params[j].zh_name;
				params[j].value = params[j].code
				params[j].key = params[j].code
				if (params[j].subs) {
					params[j].children = params[j].subs
					formatData(params[j].children)
				} else {
					params[j
					].children = []
				}
			}
			return params


		}

		for (let i = 0; i < arr.length; i++) {

			treeData = formatData(arr[i])
		}
		let columns = [
			{
				title: '岗位类型ID',
				dataIndex: 'id',
				align: 'center',
			}, {
				title: '岗位类型名称',
				dataIndex: 'zh_name',
				align: 'center',
			}, {
				title: '英文名称',
				dataIndex: 'en_name',
				align: 'center',
			}, {
				title: '角色',
				dataIndex: 'role_name',
				width: 200,
				align: 'center',
				render: (text, { role_name }) => {
					const content = (
						<div style={{ width: '200px', textAlign: 'center' }}>
							{role_name}

						</div>
					);
					if (role_name) {
						return (<div >
							<Popover content={content} title="查看角色" >
								<h4 className='more-width'>{role_name}</h4>
							</Popover>
						</div>)
					} else {
						return ''
					}
				}
			}, {
				title: '创建时间',
				dataIndex: 'created_at',
				align: 'center'
			}, {
				title: '修改时间',
				dataIndex: 'updated_at',
				align: 'center'
			}, {
				title: '描述',
				align: 'center',
				render: (text, { description }) => {
					const content = (
						<div style={{ width: '200px' }}>
							{description}

						</div>
					);
					if (description) {
						return (<div >
							<Popover content={content} title="描述" >
								<h4 className='more-width'>{description}</h4>
							</Popover>
						</div>)
					} else {
						return ''
					}
				}
			}, {
				title: '操作',
				dataIndex: 'contact',
				align: 'center',
				width: '300',
				render: (text, record) => {
					return <div>
						<Button type="primary" style={{ margin: '0 10px' }} onClick={this.jump.bind(this, '/manage/authority', record)}> 查看权限</Button>
						<Button type="primary" style={{ margin: '0 10px' }} onClick={this.handleEditBranch.bind(this, record)}>修改</Button>
						<Button type="primary" onClick={this.handleDeleteBranch.bind(this, record.id)}>删除</Button>
					</div>
				}
			}
		]

		let dataSoure = list.map(item => map[item])
		// let primary_key = 'id'
		let pagination = {
			onChange: (current) => {
				let { getJobTypeList } = this.props
				this.setState({ loading: true })
				getJobTypeList({ page: current, page_size: 20, zh_name: this.state.zhName }).then(() => {
					this.setState({ currentPage: current, loading: false })
				}).catch(() => {

				})
			},
			total: totalCount,
			pageSize: perPage,
			current: currentPage
		}
		return (
			<div className='branch'>
				<div style={{ marginBottom: '20px' }}>
					<Search
						style={{ width: '200px' }}
						className='search'
						placeholder="搜索岗位类型"
						onSearch={this.handlesearch.bind(this)}
						enterButton
					/>
					<Button onClick={this.showModal} style={{ float: 'right' }} type="primary">添加岗位类型</Button>
				</div>
				<Modal
					title={this.state.jobTypeTitle}
					visible={this.state.visible}
					footer={null}
					closable={false}
				>
					<BranchForm
						wrappedComponentRef={node => this.formRef = node}
						branchListAll={branchListAll}
						getList={this.getList}
						addJobType={addJobType}
						editJobType={editJobType}
						type={this.state.type}
						data={treeData}
						roleId={this.state.roleId}
						queryJobTypeSucc={queryJobTypeSucc}
						branchZhNameSon={this.state.branchZhName}
						title={this.state.jobTypeTitle}
						parentCodeSon={this.state.parentCode}
						getBranchTree={getBranchTree}
						jobRoleListAll={jobRoleListAll}
						close={() => {
							this.setState({
								visible: false
							})
						}}
					/>
				</Modal>
				<Table
					loading={this.state.loading}
					columns={columns}
					rowKey={record => record['id']}
					dataSource={dataSoure}
					bordered={true}
					pagination={pagination} />
			</div>)

	}
}
export default Branch

@Form.create({})
class BranchForm extends Component {
	state = {
		selectBranch: '',
		disabledBtn: false
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ disabledBtn: true })
				let { addJobType, getList, close, queryJobTypeSucc, editJobType, type } = this.props;
				if (type == 'add') {
					addJobType(values).then(({ code }) => {
						if (code == 200) {
							message.success('操作成功', 1.2)
							getList()
							close()
							this.setState({ disabledBtn: false })
							this.props.form.resetFields()
						} else {
							this.setState({ disabledBtn: false })
						}

					}).catch(() => {
						this.setState({ disabledBtn: false })
					})
				} else {
					values.id = queryJobTypeSucc.id
					editJobType(values).then(({ code }) => {
						if (code == 200) {
							message.success('操作成功', 1.2)
							getList()
							close()
							this.setState({ disabledBtn: false })
							this.props.form.resetFields()
						} else {
							this.setState({ disabledBtn: false })
						}

					}).catch(() => {
						this.setState({ disabledBtn: false })
					})
				}
			}
		});
	}

	onChangeBranch = () => {
		let { getBranchTree, queryBranchSucc, type } = this.props;

		if (type == 'edit') {
			getBranchTree({ department_code: queryBranchSucc.code })
		} else {
			getBranchTree({ department_code: '' })
		}


	}
	// onChangeDataBranch = (value) => {
	//     this.setState({ selectBranch: value })
	// }
	handleClose = () => {
		let { close } = this.props;
		close()
		this.props.form.resetFields()
		this.setState({ disabledBtn: false })
	}
	handleEnlish(rule, value, callback) {
		if (/^[a-zA-Z]*$/.test(value)) {
			callback()
		} else {
			callback("只能输入英文字母")
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		let { queryJobTypeSucc, type } = this.props;
		return (
			<Form onSubmit={this.handleSubmit}>
				<FormItem label="岗位类型">
					{getFieldDecorator('zh_name', {
						rules: [{ required: true, message: '请填写岗位类型!' }],
						initialValue: type == 'edit' ? queryJobTypeSucc.zh_name : ''
					})(
						<Input />
					)}
				</FormItem>
				<FormItem label="英文名称">
					{getFieldDecorator('en_name', {
						rules: [{ required: true, validator: this.handleEnlish.bind(this) }],
						initialValue: type == 'edit' ? queryJobTypeSucc.en_name : ''
					})(
						<Input disabled={type == 'edit' ? true : false} />
					)}
				</FormItem>
				<FormItem label="角色">
					{getFieldDecorator('role_id', {
						rules: [{ required: true, message: '请选择角色!' }],
						initialValue: type == 'edit' ? queryJobTypeSucc.role_id : null
					})(
						<Checkbox.Group style={{ width: '100%' }}>
							{
								this.props.jobRoleListAll ? this.props.jobRoleListAll.map((item) => {
									return <Checkbox value={item.id} key={item.id}>{item.zh_name}</Checkbox>
								}) : null}
						</Checkbox.Group>
					)}
				</FormItem>
				<FormItem label="描述">
					{getFieldDecorator('description', {
						rules: [{ required: true, message: '请填写描述内容!' }],
						initialValue: type == 'edit' ? queryJobTypeSucc.description : ''
					})(
						<TextArea rows={6} />
					)}
				</FormItem>
				<FormItem style={{ textAlign: 'right' }}>
					<Button type="primary" onClick={this.handleClose} style={{ margin: '0 20px' }} >取消</Button>
					<Button type="primary" htmlType="submit" disabled={this.state.disabledBtn}>确定</Button>
				</FormItem>
			</Form>
		)

	}
}
