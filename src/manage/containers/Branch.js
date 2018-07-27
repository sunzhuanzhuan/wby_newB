import React, { Component } from "react";
import { connect } from "react-redux";
import * as action from '../actions/index'
import {
	Input, Table, Button, Modal, Form, message, TreeSelect, Popover
} from "antd";
import './branch.less'



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
		branchTitle: '添加部门',
		zhName: '',
		branchZhName: '',
		parentCode: '',
		type: ''
	}

	// 获取列表方法
	getList = async (query = { page: 1, page_size: 20 }) => {
		let { getBranchList } = this.props
		this.setState({ loading: true })
		getBranchList({ ...query }).then(() => {
			this.setState({
				currentPage: 1,
				loading: false
			})
		})
	}
	getAll = () => {
		let { getBranchListAll, getBranchTree } = this.props
		getBranchListAll()
		getBranchTree()
	}
	componentDidMount() {
		this.getList()
		this.getAll()

	}
	showModal = () => {
		this.setState({
			visible: true,
			branchTitle: '添加部门',
			type: 'add'
		});
	}
	handleEditBranch(record) {
		this.setState({ branchTitle: '修改部门', visible: true, type: 'edit' }, () => {
			let { queryBranch, branchListAll } = this.props

			queryBranch({ id: record.id }).then(({ data: { parent_code } }) => {
				if (record.code.length == 3) {
					this.setState({ branchZhName: '', parentCode: parent_code })

				} else {
					for (let i = 0; i < branchListAll.length; i++) {
						if (branchListAll[i].code == parent_code) {
							this.setState({ branchZhName: branchListAll[i].zh_name })

						}

					}

				}

			})


		})
	}
	handleDeleteBranch(id) {
		let { deleteBranch, getBranchTree } = this.props
		deleteBranch({ id }).then(() => {
			message.success('删除成功')
			this.getList()
			getBranchTree()
		})
	}
	handlesearch(value) {
		let query = { page: 1, page_size: 20, zh_name: value }
		let { getBranchList } = this.props
		this.setState({ loading: true, zhName: value })
		getBranchList({ ...query }).then(() => {
			this.setState({
				currentPage: 1,
				loading: false
			})
		}).catch(() => {

		})
	}
	render() {

		let { branchList, branchListAll, addBranch, queryBranchSucc, editBranch, branchTree, getBranchTree } = this.props;
		let { currentPage = 1, perPage = 20, totalCount = 0, map, list } = branchList || {}
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
					params[j].children = []
				}
			}
			return params


		}

		for (let i = 0; i < arr.length; i++) {

			treeData = formatData(arr[i])
		}
		let columns = [
			{
				title: '部门ID',
				dataIndex: 'id',
				align: 'center',
			}, {
				title: '部门名称',
				dataIndex: 'zh_name',
				align: 'center',
			}, {
				title: '部门编码',
				dataIndex: 'code',
				align: 'center',
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
				width: '200',
				render: (text, record) => {
					return <div>
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
				let { getBranchList } = this.props
				this.setState({ loading: true })
				getBranchList({ page: current, page_size: 20, zh_name: this.state.zhName }).then(() => {
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
						placeholder="搜索部门名称"
						onSearch={this.handlesearch.bind(this)}
						enterButton
					/>
					<Button onClick={this.showModal} style={{ float: 'right' }} type="primary">添加部门</Button>
				</div>
				<Modal
					title={this.state.branchTitle}
					visible={this.state.visible}
					footer={null}
					closable={false}
				>
					<BranchForm
						wrappedComponentRef={node => this.formRef = node}
						branchListAll={branchListAll}
						getList={this.getList}
						addBranch={addBranch}
						editBranch={editBranch}
						type={this.state.type}
						data={treeData}
						queryBranchSucc={queryBranchSucc}
						branchZhNameSon={this.state.branchZhName}
						title={this.state.branchTitle}
						parentCodeSon={this.state.parentCode}
						getBranchTree={getBranchTree}
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
				let { addBranch, getList, close, queryBranchSucc, editBranch, getBranchTree, type } = this.props;
				if (type == 'add') {
					if (values.parent_code.value == '' || !values.parent_code) {
						delete values.parent_code
					} else {
						values.parent_code = values.parent_code.value
					}
					addBranch(values).then(({ code }) => {
						if (code == 200) {
							message.success('操作成功', 1.2)
							getList()
							close()
							getBranchTree()
							this.setState({ disabledBtn: false })
							this.props.form.resetFields()
						} else {
							this.setState({ disabledBtn: false })
						}

					}).catch(() => {
						this.setState({ disabledBtn: false })
					})
				} else {
					if (!values.parent_code || values.parent_code.value == 0 || values.parent_code.value == '') {
						delete values.parent_code
					} else {
						values.parent_code = values.parent_code.value
					}
					values.id = queryBranchSucc.id
					editBranch(values).then(({ code }) => {
						console.log(code)
						if (code == 200) {
							message.success('操作成功', 1.2)
							getList()
							getBranchTree()
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
	render() {
		const { getFieldDecorator } = this.props.form;
		let { queryBranchSucc, data, branchZhNameSon, type } = this.props;
		return (
			<Form onSubmit={this.handleSubmit}>
				<FormItem label="部门名称">
					{getFieldDecorator('zh_name', {
						rules: [{ required: true, message: '请填写部门名称!' }],
						initialValue: type == 'edit' ? queryBranchSucc.zh_name : ''
					})(
						<Input />
					)}
				</FormItem>
				{data ? <FormItem label="父级部门">
					{getFieldDecorator('parent_code', {
						initialValue: type == 'edit' ? { value: queryBranchSucc.parent_code + '', label: branchZhNameSon == '' ? '顶级部门' : branchZhNameSon } : {
							value: '', label: ''
						}
					})(
						<TreeSelect
							labelInValue={true}
							dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
							treeData={data}
							// treeDefaultExpandAll
							onFocus={this.onChangeBranch}
							// onSelect={this.onChangeDataBranch}
							allowClear={true}
						/>
					)}
				</FormItem> : null}
				<FormItem label="描述">
					{getFieldDecorator('description', {
						rules: [{ required: true, message: '请填写描述内容!' }],
						initialValue: type == 'edit' ? queryBranchSucc.description : ''
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
