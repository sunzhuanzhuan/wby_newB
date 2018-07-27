import React, { Component } from "react";
import { connect } from "react-redux";
import * as action from '../actions/index'
import {
	Input, Table, Button, Modal, Form, message, Select,
	Popover, TreeSelect
} from "antd";
import './job.less'

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@connect(
	state => state.manage, action
)
class Job extends Component {
	state = {
		loading: false,
		currentPage: 1,
		visible: false,
		jobTitle: '添加岗位',
		ownershipId: '',
		zhName: '',
		jobZhName: '',
		jobName: '',
		jobPartentId: '',
		editId: '',
		editBranchId: '',
		branchName: '',
		type: '',
		jobTypeName: '',
		jobType: '',
		description: ''
	}

	// 获取列表方法
	getList = async (query = { page: 1, page_size: 20 }) => {
		let { getJobList } = this.props
		this.setState({ loading: true })
		getJobList({ ...query }).then(() => {
			this.setState({
				currentPage: 1,
				loading: false
			})
		})
	}
	getAll = () => {
		let { getBranchListAll, getRoleJobList, getJobTree, getBranchTree, getJobListAll, getJobTypeListAll } = this.props
		getBranchListAll()
		getRoleJobList()
		getJobTree()
		getBranchTree()
		getJobListAll()
		getJobTypeListAll()
	}
	componentDidMount() {
		this.getList()
		this.getAll()

	}
	showModal = () => {
		this.setState({
			visible: true,
			jobTitle: '添加岗位',
			type: 'add'
		});
	}
	handleEditJob(record) {
		this.setState({ jobTitle: '修改岗位', visible: true, type: 'edit' }, () => {
			let { queryJob } = this.props
			queryJob({ id: record.id, is_show_department: 0 }).then(({ data: { zh_name: x, parent_id, id, ownership_id,
				department_zh_name, job_type_id, description
			} }) => {
				this.setState({
					jobZhName: x, jobPartentId: parent_id + '',
					editId: id, editBranchId: ownership_id,
					branchName: department_zh_name, jobTypeName: job_type_id,
					description: description
				}, () => {
					if (record.parent_id != 0) {
						queryJob({ id: record.parent_id, is_show_department: 1 }).then(({ data: { zh_name } }) => {
							// console.log(zh_name)
							this.setState({ jobName: zh_name })
						})
					} else {
						//this.setState({ jobZhName: '', job_partent_id: '' })
						this.setState({ jobPartentId: '', jobName: '' })
					}
				})
			})



		})
	}
	handleDeleteJob(id) {
		let { deleteJob } = this.props
		deleteJob({ id }).then(() => {
			message.success('删除成功')
			this.getList()
		})
	}
	handlesearch() {
		let query = { page: 1, page_size: 20, zh_name: this.state.zhName, ownership_id: this.state.ownershipId, job_type_id: this.state.jobType }
		let { getJobList } = this.props
		this.setState({ loading: true })
		getJobList({ ...query }).then(() => {
			this.setState({
				currentPage: 1,
				loading: false
			})
		}).catch(() => {

		})
	}
	handleJobQuery(value) {
		this.setState({ jobType: value })
	}
	handleChangeJob = (e) => {
		this.setState({ zhName: e.target.value })
	}
	onBranch = (value) => {
		this.setState({ ownershipId: value })
	}
	changeBranch = (value) => {
		if (value) {
			this.setState({ ownershipId: value })
		} else {
			this.setState({ ownershipId: '' })
		}

	}
	render() {
		let { jobList, branchListAll, addJob, queryJobSucc, editJob, getRoleJobList, jobRoleListAll, jobTree, branchTree,
			getJobTree, getBranchTree, jobTypeListAll } = this.props;
		let { currentPage = 1, perPage = 20, totalCount = 0, map, list } = jobList || {}
		let arr = Object.values(jobTree);
		let arrBranch = Object.values(branchTree);
		let treeData = []
		let dataBranch = []
		let formatData = function () { }
		if (arrBranch.length > 0) {
			formatData = function (params) {
				for (let j = 0; j < params.length; j++) {
					params[j].label = params[j].zh_name;
					params[j].value = params[j].id + ''
					params[j].key = params[j].id + ''
					if (params[j].subs) {
						params[j].children = params[j].subs
						formatData(params[j].children)
					} else {
						params[j].children = []
					}
				}
				return params

			}

			for (let i = 0; i < arr.length; i++) {

				treeData = formatData(arr[i])
				dataBranch = formatData(arrBranch[i])
			}
		}


		let columns = [
			{
				title: '岗位ID',
				dataIndex: 'id',
				align: 'center',
			}, {
				title: '岗位名称',
				dataIndex: 'zh_name',
				align: 'center',
			}, {
				title: '岗位所属部门名称',
				dataIndex: 'department_zh_name',
				align: 'center',
				// render: (text, { department }) => {
				// 	if (department) {
				// 		if (department.zh_name) {
				// 			return <h4>{department.zh_name}</h4>
				// 		} else {
				// 			return ''
				// 		}
				// 	} else {
				// 		return ''
				// 	}
				// }
			}, {
				title: '岗位类型',
				align: 'center',
				dataIndex: 'jobType_zh_name',
				// render: (text, { role_name }) => {
				// 	if (role_name) {
				// 		const content = (
				// 			<div style={{ width: '200px' }}>
				// 				{role_name}

				// 			</div>
				// 		);
				// 		return (<div>
				// 			<Popover content={content} title="查看角色" style={{ width: '200px' }}>
				// 				<h4 className='more-width'>{role_name}</h4>
				// 			</Popover>
				// 		</div>)
				// 	} else {
				// 		return ''
				// 	}
				// }
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
					if (description) {
						const content = (
							<div style={{ width: '200px' }}>
								{description}

							</div>
						);
						return (<div>
							<Popover content={content} title="描述">
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
				render: (text, record) => {
					return <div>
						<Button onClick={this.handleEditJob.bind(this, record)} type="primary" style={{ margin: '0 10px' }}>修改</Button>
						<Button onClick={this.handleDeleteJob.bind(this, record.id)} type="primary">删除</Button>
					</div>
				}
			}
		]

		let dataSoure = list.map(item => map[item])
		// let primary_key = 'id'
		let pagination = {
			onChange: (current) => {
				let { getJobList } = this.props
				this.setState({ loading: true })
				getJobList({ page: current, page_size: 20, zh_name: this.state.zhName, ownership_id: this.state.ownershipId }).then(() => {
					this.setState({ currentPage: current, loading: false })
				}).catch(() => {

				})
			},
			total: totalCount,
			pageSize: perPage,
			current: currentPage
		}
		return (
			<div className='jobBox'>
				<div style={{ marginBottom: '20px' }}>部门名称：
					<TreeSelect
						style={{ width: 300 }}
						placeholder="搜索部门"
						dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
						treeData={dataBranch}
						treeDefaultExpandAll
						onSelect={this.onBranch}
						onChange={this.changeBranch}
						allowClear={true}
					/>
					<Input onChange={this.handleChangeJob} placeholder='请查询岗位名称' style={{ width: '200px', marginLeft: '20px', marginRight: '10px' }} />
					岗位类型：<Select
						onChange={this.handleJobQuery.bind(this)}
						style={{ width: '200px', marginLeft: '10px', marginRight: '20px' }}
						allowClear={true}
						placeholder="搜索岗位类型">
						{jobTypeListAll.length > 0 ? jobTypeListAll.map(d => <Option key={d.id} value={d.id}>{d.zh_name}</Option>) : null}
					</Select>
					<Button onClick={this.handlesearch.bind(this)} type="primary">查询</Button>
					<Button onClick={this.showModal} style={{ float: 'right' }} type="primary">添加岗位</Button>
				</div>
				<Modal
					title={this.state.jobTitle}
					visible={this.state.visible}
					footer={null}
					closable={false}
				>
					{treeData ? <JobForm
						wrappedComponentRef={node => this.formRef = node}
						branchListAll={branchListAll}
						getList={this.getList}
						addJob={addJob}
						editJob={editJob}
						queryJobSucc={queryJobSucc}
						getRoleJobList={getRoleJobList}
						title={this.state.jobTitle}
						jobRoleListAll={jobRoleListAll}
						data={treeData}
						dataBranch={dataBranch}
						jobZhNameSon={this.state.jobZhName}
						jobName={this.state.jobName}
						jobPartentId={this.state.jobPartentId}
						editId={this.state.editId}
						branchName={this.state.branchName}
						getJobTree={getJobTree}
						getBranchTree={getBranchTree}
						editBranchId={this.state.editBranchId}
						type={this.state.type}
						jobTypeListAll={jobTypeListAll}
						jobTypeName={this.state.jobTypeName}
						description={this.state.description}
						close={() => {
							this.setState({
								visible: false
							})
						}}
					/> : null}
				</Modal>
				<Table
					loading={this.state.loading}
					columns={columns}
					rowKey={record => record['id']}
					dataSource={dataSoure}
					bordered={true}
					pagination={pagination} />
			</div >)

	}
}
export default Job

@Form.create({})
class JobForm extends Component {
	state = {

	}
	constructor(props) {
		super(props);
		this.state = ({
			value: undefined,
			selectValueBranch: '',
			selectValueJob: '',
			flagJob: true,
			disableBtn: false,
			selectBranchId: '',
			flag: true
		})


	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ disableBtn: true })
				values.creator = 1
				let { addJob, getList, close, editJob, editId,
					type
				} = this.props;
				if (type == 'add') {
					if (values.parent_id == '' || !values.parent_id) {
						values.parent_id = 0
					} else {
						values.parent_id = values.parent_id.value
					}
					values.ownership_id = values.ownership_id.value
					addJob(values).then(({ code }) => {
						if (code == 200) {
							this.props.form.resetFields()
							message.success('操作成功', 1.2)
							getList()
							close()
							this.setState({ disableBtn: false })
						} else {
							this.setState({ disableBtn: false })
						}

					}).catch(() => {
						this.setState({ disableBtn: false })
					})
				} else {
					values.id = editId
					if (values.parent_id || values.parent_id == '') {
						values.parent_id = values.parent_id.value
					} else {
						values.parent_id = 0
					}
					values.ownership_id = values.ownership_id.value

					editJob(values).then(({ code }) => {
						if (code == 200) {
							this.props.form.resetFields()
							message.success('操作成功', 1.2)
							getList()
							close()
							this.setState({ disableBtn: false })
						} else {
							this.setState({ disableBtn: false })
						}

					}).catch(() => {
						this.setState({ disableBtn: false })
					})
				}
			}
		});

	}
	handleClose = () => {
		let { close } = this.props;
		close()
		this.props.form.resetFields()
		this.setState({ disableBtn: false })
	}
	onChangeJob = () => {
		let { getJobTree, editId, type, editBranchId } = this.props;
		if (type == 'edit') {
			if (this.state.flag) {
				getJobTree({
					job_id: editId, ownership_id: editBranchId, is_show_department: 1, is_show_superior_department: 1
				})
			} else {
				getJobTree({
					job_id: editId, ownership_id: this.state.selectBranchId, is_show_department: 1, is_show_superior_department: 1
				})
				this.setState({ flag: true })
			}

		} else {
			getJobTree({
				job_id: '', ownership_id: this.state.selectBranchId, is_show_department: 1, is_show_superior_department: 1
			})
		}


	}
	onChangeBranchFromJob = (value) => {
		let { getJobTree, editId, type, editBranchId } = this.props;
		this.props.form.setFieldsValue({ 'parent_id': '' });
		// let { type } = this.props;
		if (type == 'edit') {

			this.setState({ selectBranchId: value.value, flag: false })
			if (this.state.flag) {
				getJobTree({
					job_id: editId, ownership_id: editBranchId, is_show_department: 1, is_show_superior_department: 1
				})
			} else {
				getJobTree({
					job_id: editId, ownership_id: this.state.selectBranchId, is_show_department: 1, is_show_superior_department: 1
				})
				this.setState({ flag: true })
			}
		} else {
			this.setState({ selectBranchId: value.value })
			getJobTree({
				job_id: '', ownership_id: this.state.selectBranchId, is_show_department: 1, is_show_superior_department: 1
			})
		}
	}
	// // onChangeBranch = () => {
	// // 	let { editBranchId } = this.props;
	// // 	this.props.form.setFieldsValue({ 'ownership_id': editBranchId + '' });

	// // }
	// onSelectBranch = (value) => {
	// 	console.log(value);

	// 	this.setState({ selectValueBranch: value })
	// }
	// onSelectJob = (value) => {
	// 	// this.setState({ selectValueJob: value })
	// }
	render() {
		const { getFieldDecorator } = this.props.form;
		let {
			jobName,
			// queryJobSucc,
			editBranchId,
			jobTypeListAll,
			jobPartentId,
			dataBranch,
			data,
			jobZhNameSon,
			branchName,
			type,
			jobTypeName,
			description
		} = this.props;
		//this.setState({ selectBranchId: this.props.editBranchId })
		// console.log(this.props.editBranchId)
		//console.log(jobTypeName)
		return (
			<Form onSubmit={this.handleSubmit}>
				{type == 'edit' ? <FormItem label="岗位名称">
					{getFieldDecorator('zh_name', {
						rules: [{ required: true, message: '请填写部门名称!' }],
						initialValue: type == 'edit' ? jobZhNameSon : ''
					})(
						<Input />
					)}
				</FormItem> : null}
				<FormItem label="岗位类型">
					{getFieldDecorator('job_type_id', {
						rules: [{ required: true, message: '请选择岗位类型!' }],
						initialValue: type == 'edit' ? jobTypeName : ''
					})(
						<Select>
							{jobTypeListAll ? jobTypeListAll.map(d => <Option key={d.id} value={d.id}>{d.zh_name}</Option>) : null}
						</Select>
					)}
				</FormItem>

				{
					dataBranch ? <FormItem label="部门">
						{getFieldDecorator('ownership_id', {
							rules: [{ required: true, message: '请选择部门!' }],
							initialValue: type == 'edit' ? { value: editBranchId + '', label: branchName == '' ? '顶级部门' : branchName } : {
								value: '', label: ''
							},

						})(
							<TreeSelect
								labelInValue={true}
								dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
								placeholder="部门"
								treeData={dataBranch}
								// treeDefaultExpandAll
								onSelect={this.onChangeBranchFromJob}
							/>
						)}
					</FormItem> : null
				}
				{
					data ? <FormItem label="上级岗位">
						{getFieldDecorator('parent_id', {
							initialValue: type == 'edit' ? { value: jobPartentId + '', label: jobName == '' ? '顶级岗位' : jobName } : {
								value: '', label: ''
							}
						})(
							<TreeSelect
								labelInValue={true}
								dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
								treeData={data}
								placeholder="选择上级岗位"
								// treeDefaultExpandAll
								allowClear={true}
								onFocus={this.onChangeJob}
							/>
						)}
					</FormItem> : null
				}

				<FormItem label="描述">
					{getFieldDecorator('description', {
						rules: [{ required: true, message: '请填写描述!' }],
						initialValue: type == 'edit' ? description : ''
					})(
						<TextArea rows={6} />
					)}
				</FormItem>
				<FormItem style={{ textAlign: 'right' }}>
					<Button type="primary" onClick={this.handleClose} style={{ margin: '0 20px' }}>取消</Button>
					<Button type="primary" htmlType="submit" disabled={this.state.disableBtn}>确定</Button>
				</FormItem>
			</Form >
		)

	}
}
