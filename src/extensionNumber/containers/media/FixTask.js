import React, { Component } from "react";
import {
	Select, Form, Input, Button, Modal, Table, DatePicker, Radio, message,
	Row, Col, Popover, Spin, Divider, Tooltip, Icon
} from "antd";
import { connect } from "react-redux";
import * as actions from '../../actions'

import FilterContainer from "../../components/FilterContainer";
import './allocateTask.less';
import PlatformSelect from "../../base/PlatformSelect";
import {
	accountStatusMap,
	finishStatusMap,
	requirementPlanMap, sourceMap,
	progressMap, dashboardAccountMap
} from "../../constants/config";
import StausView from "../../base/StatusView";
import debounce from 'lodash/debounce';
// import SearchSelect from "../../base/SearchSelect";
import ViewMoreText from "../../base/ViewMoreText";
import moment from 'moment'
import numeral from "numeral";
import NumberInfo from "../../base/NumberInfo";


const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input;

const radioStyle = {
	display: 'block',
	height: '30px',
	lineHeight: '30px',
};


@connect(state => state.extensionNumber, actions)
class AllocateTask extends Component {
	state = {
		filter: {},
		currentPage: 1,
		selectedRowKeys: [],
		tableLoading: false,
		requirementModalShow: false,
		requirementDetail: null,
		changeProgressModalShow: false,
		changeProgressForm: null,
		storeModalShow: false,
		storeForm: null,
		changeProgressLoading: false,
		accountIDmodal: false,
		accountIDnameId: "",
		accountIDTextArea: ""
	}

	// 更新进度
	changeProgress = () => {
		let { postProgressStatusUpdate } = this.props
		this.tipProgress.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({
					changeProgressLoading: true
				});
				postProgressStatusUpdate(values).then(({ msg }) => {
					message.success(msg, 1.2)
					// 重新拉取数据 + 复位
					this.getList({ page: this.state.currentPage })
					this.setState({
						changeProgressModalShow: false,
						changeProgressForm: false
					});
				})
					.catch(() => {
						message.error('分配失败', 1.2)
						this.setState({
							submitAllocateLoading: false
						})
					})
			}
		});
	}

	// 获取列表方法
	getList = async (query = {}) => {
		let { getOrientationList } = this.props
		let { filter } = this.state
		this.setState({ tableLoading: true })
		await getOrientationList({ ...filter, page: 1, ...query })
		this.setState({
			selectedRowKeys: [],
			filter: { ...filter, ...query },
			tableLoading: false,
			currentPage: query.page || 1
		})
	}

	// 创建需求详情弹窗内容
	createRequirementDetail = info => {
		let C = null;
		if (info) {
			C = <div className='requirement-detail'>
				<Row>
					<Col span={7}>需求名称:</Col>
					<Col span={15} offset={1}>{info.requirement_name}</Col>
				</Row>
				<Row>
					<Col span={7}>创建人区域:</Col>
					<Col span={15} offset={1}>{info.creator_area}</Col>
				</Row>
				<Row>
					<Col span={7}>项目组名称:</Col>
					<Col span={15} offset={1}>{info.project_team_name}</Col>
				</Row>
				<Row>
					<Col span={7}>需求计划:</Col>
					<Col span={15} offset={1}>{info.requirement_plan}</Col>
				</Row>
				<Row>
					<Col span={7}>创建人联系方式:</Col>
					<Col span={15} offset={1}>{info.creator_mobile}</Col>
				</Row>
				<Row>
					<Col span={7}>需求来源:</Col>
					<Col span={15} offset={1}>{sourceMap[info.source_code].text}</Col>
				</Row>
				<Row>
					<Col span={7}>预计推广时间:</Col>
					<Col span={15} offset={1}>{info.promotion_start_at + ' 到 ' + info.promotion_end_at}</Col>
				</Row>
				<Row>
					<Col span={7}>推广产品:</Col>
					<Col span={15} offset={1}>{info.promoted_product}</Col>
				</Row>
				<Row>
					<Col span={7}>最晚上架时间:</Col>
					<Col span={15} offset={1}>{info.launched_before}</Col>
				</Row>
				<Row>
					<Col span={7}>需求描述:</Col>
					<Col span={15} offset={1}>{info.desc}</Col>
				</Row>
				<Row>
					<Col span={7}>备注:</Col>
					<Col span={15} offset={1}>{info.comment}</Col>
				</Row>
			</div>
			this.setState({
				requirementModalShow: true,
				requirementDetail: C
			})
		}
	}

	// 创建进度修改弹窗
	createChangeProgressForm = data => {
		let C = null;
		if (data) {
			C = <ProgressTips
				wrappedComponentRef={node => this.tipProgress = node}
				{...data} />
			this.setState({
				changeProgressModalShow: true,
				changeProgressForm: C
			})
		}
	}

	// 创建入库弹窗
	createStoreForm = data => {
		let C = null;
		if (data) {
			C = <SearchInput {...data} getUserList={this.props.getUserList} />
			this.setState({
				storeModalShow: true,
				storeForm: C
			})
		}
	}

	componentWillMount() {
		let { getMediaManagerList, mediaManagerList } = this.props;
		if (mediaManagerList <= 0) {
			getMediaManagerList()
		}


		// 获取列表
		this.getList();
	}

	//关联accountID弹窗
	showaccountIDmodal(id) {
		this.setState({ accountIDmodal: true, accountIDnameId: id })
	}

	closeaccountIDmodal() {
		this.setState({
			accountIDmodal: false,
			accountIDnameId: "",
			accountIDTextArea: ""
		})
	}

	accountIDTextArea(e) {
		this.setState({
			accountIDTextArea: e.target.value
		})
	}

	accountIDsubmit() {
		if (this.state.accountIDTextArea) {
			this.props.postrelateAccountId({
				id: this.state.accountIDnameId,
				account_id: this.state.accountIDTextArea
			}).then(() => {
				message.success("关联成功")
				this.getList({ page: this.state.currentPage })
				this.closeaccountIDmodal();
			})
		} else {
			message.error("accountid不能为空!");
		}
	}

	render() {
		let { orientationList } = this.props
		let { count = 0, page = 1, pageNum = 100, map, list, stat, search_flag, } = orientationList || {}
		let columns = [
			{
				title: '需求名称',
				dataIndex: 'requirement_name',
				align: 'center',
				width: 160,
				render: (name, info) => {
					return <a onClick={() => {
						this.createRequirementDetail(info)
					}}>{name}</a>;
				}
			}, {
				title: '平台',
				dataIndex: 'weibo_type_name',
				align: 'center',
				render: (text) => {
					return <span>{text || '-'}</span>
				}
			}, {
				title: 'id',
				dataIndex: 'weibo_id',
				align: 'center',
				render: (text) => {
					return <span>{text || '-'}</span>
				}
			}, {
				title: '链接',
				dataIndex: 'url',
				align: 'center',
				width: 48,
				render: (url) => {
					return url ? <a target={'_blank'} href={url}>url</a> : '-'
				}
			}, {
				title: '账号名称',
				dataIndex: 'account_name',
				align: 'center',
				render: (name) => {
					return name;
				}
			}, {
				title: 'accountID',
				dataIndex: 'account_id',
				align: 'center',
				render: (text) => {
					let ad = JSON.parse(text);
					return ad.code ? <a target={'_blank'} href={ad.url}>{ad.code}</a> : '-'
				}
			}, {
				title: '最晚上架时间',
				width: 102,
				dataIndex: 'launched_before',
				align: 'center',
				render: (text) => text || '-'
			}, {
				title: '需求计划',
				dataIndex: 'requirement_plan',
				align: 'center',
				render: (time) => time || '-'
			}, {
				title: '账号状态',
				dataIndex: 'status_name',
				width: 102,
				align: 'center',
				render: (status) => <StausView status={status} /> || '-'
			}, {
				title: '销售/AE',
				dataIndex: 'creator',
				align: 'center',
				render: (name, { cell_phone }) =>
					<Popover placement="top" title='联系方式:' content={cell_phone} trigger="hover"><a>{name}</a></Popover>
			}, {
				title: '拓号状态',
				width: 102,
				dataIndex: 'finish_status',
				align: 'center',
				render: (status, { termination_resaon, finish_status_code }) => {
					if (finish_status_code == '1') {
						return <Popover placement="top" title='终止理由:' content={termination_resaon || '无'}
							trigger="hover">
							<span><StausView status={status} /></span>
						</Popover>
					} else {
						return <StausView status={status} /> || '-'
					}

				}
			}, {
				title: '资源媒介',
				dataIndex: 'user_owner_admin',
				align: 'center',
				render: (time) => time || '-'
			}, {
				title: '拓展媒介',
				dataIndex: 'owner_admin',
				align: 'center',
				render: (time) => time || '-'
			}, {
				title: '备注',
				dataIndex: 'owner_admin_comment',
				align: 'center',
				width: 160,
				render: (text) =>
					<ViewMoreText content={text || ''} title='备注' />
			}, {
				title: '操作',
				dataIndex: '-',
				align: 'center',
				width: 260,
				fixed: 'right',
				render: (n, item) => {
					return <div>
						{
							(item.status == 1) ?
								<Button className='mr5' type="primary" size='small' onClick={() => {
									this.createStoreForm(item)
								}}>入库</Button> :
								item.status == 3 ?
									<Button className='mr5' type="primary" size='small' onClick={() => {
										window.open(item.operationUrl);
									}}>上架</Button> :
									null
						}
						{item.finish_status_code != '1' ?
							<a type='primary' style={{ width: '80px' }}
								onClick={() => {
									this.createChangeProgressForm(item)
								}}
								className='filter-button'>更新进度</a> : null}
						{item.status == 5 ?
							<a type='primary' style={{ width: '80px', marginLeft: "3px" }} className='filter-button'
								onClick={this.showaccountIDmodal.bind(this, item.ext_account_id)}>
								关联accountID
                            </a> : null}
					</div>
				}
			}
		]
        /*let rowSelection = {
        getCheckboxProps: (/!* record *!/) => ({
        disabled: false
        }),
        fixed: 'left',
        selectedRowKeys: this.state.selectedRowKeys,
        onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
        },
        };*/
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
		let primary_key = 'id'
		let dataSoure = list.map(item => map[item])
		let dashboardData = Object.entries(dashboardAccountMap).reduce((pre, [key, value]) => {
			pre[key] = { ...value, count: stat[key] }
			return pre
		}, {})
		return (
			<div className='extension-number fix-task-page'>
				<section className='dashboard'>
					{
						Object.values(dashboardData).map(({ name, count, filter }) => (
							<NumberInfo
								key={name}
								onClick={() => {
									this.getList({
										...filter,
										updated_start_at: (name === '今日完成拓号数' ? moment('00:00:00', 'HH:mm:ss').format() : undefined),
										updated_end_at: (name === '今日完成拓号数' ? moment('23:59:59', 'HH:mm:ss').format() : undefined)
									})
									this.filterFormRef.props.form.resetFields()
								}}
								subTitle={<span>{name}</span>}
								total={numeral(count).format('0,0')}
								subTotal={
									<Tooltip title="点击查看列表"><Icon type="info-circle-o" /></Tooltip>}
							/>
						))
					}
				</section>
				<Divider />
				<header className='page-content'>
					<FilterContainer>
						<FilterForm tableLoading={this.state.tableLoading}
							getList={this.getList}
							mediaManagerList={this.props.mediaManagerList}
							queryRequirement={this.props.queryRequirement}
							search_flag={search_flag}
							list={list}
							group1={[56,40,39]}
							group2={[32,33,34,38]}
							wrappedComponentRef={node => this.filterFormRef = node}
						/>
					</FilterContainer>
				</header>
				<main>
					<Table /* rowSelection={rowSelection}*/ pagination={pagination}
						scroll={{ x: 1800 }}
						bordered columns={columns}
						loading={this.state.tableLoading}
						rowKey={record => record[primary_key]}
						dataSource={dataSoure}
					/>
				</main>
				<Modal className='extension-number-modal'
					maskClosable={false}
					visible={this.state.storeModalShow}
					title="微播易提醒您：请选择主账号"
					onCancel={() => {
						this.setState({
							storeModalShow: false,
							storeForm: null
						})
					}}
					footer={null}
				>
					{this.state.storeForm}
				</Modal>
				<Modal visible={this.state.requirementModalShow}
					onCancel={() => this.setState({
						requirementModalShow: false,
						requirementDetail: null
					})}
					footer={null}
					className='extension-number-modal'
					title='需求详情'
				>
					{this.state.requirementDetail}
				</Modal>
				<Modal visible={this.state.changeProgressModalShow}
					maskClosable={false}
					confirmLoading={this.changeProgressLoading}
					onOk={this.changeProgress}
					onCancel={() => {
						this.setState({
							changeProgressModalShow: false,
							changeProgressForm: null
						})
						this.tipProgress.props.form.resetFields()
					}}
				>
					{this.state.changeProgressForm}
				</Modal>
				<Modal visible={this.state.accountIDmodal}
					title="请输入账号的accountID"
					onCancel={this.closeaccountIDmodal.bind(this)}
					onOk={this.accountIDsubmit.bind(this)}
					destroyOnClose={true}>
					<TextArea rows={3}
						ref={account => this.account = account}
						onChange={this.accountIDTextArea.bind(this)}
						className="account-relate-text" />
				</Modal>
			</div>
		);
	}
}

// 修改拓号进度
@Form.create({})
class ProgressTips extends Component {
	state = { show: this.props.progress_status == '3' }
	onChange = e => this.setState({ show: e.target.value === '3' })

	render() {
		const { getFieldDecorator } = this.props.form;
		return <div>
			<h4>确定更新拓号进度吗?</h4>
			<Form>
				<FormItem style={{ display: "none" }}>
					{getFieldDecorator('id', {
						initialValue: this.props.id
					})(
						<Input />
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('progress_status', {
						initialValue: this.props.progress_status.toString()
					})(
						<RadioGroup onChange={this.onChange}>
							{
								[1, 2, 3, 4, 5].map((key) => {
									let { id, text } = progressMap[key];
									return <Radio style={radioStyle} value={id.toString()} key={id}>{text}</Radio>
								})
							}
						</RadioGroup>
					)}
				</FormItem>
				{
					this.state.show ?
						<FormItem>
							{
								getFieldDecorator('progress_status_reason', {
									initialValue: this.props.progress_status_reason,
									rules: [{
										required: true,
										max: 500,
										message: '最多可输入500字'
									}]
								})(
									<TextArea placeholder="请填写不合作原因" autosize={{
										minRows: 4,
										maxRows: 4
									}} />
								)
							}
						</FormItem> : null
				}
			</Form>
		</div>
	}
}

// 查询筛选
@Form.create({})
class FilterForm extends Component {
	submitQuery = (e) => {
		let { getList } = this.props
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (values.launched_before_at && values.launched_before_at.length) {
					values['launched_before_start_at'] = values.launched_before_at[0].format();
					values['launched_before_end_at'] = values.launched_before_at[1].format();
				} else {
					values['launched_before_start_at'] = undefined;
					values['launched_before_end_at'] = undefined;
				}
				delete values.launched_before_at
				values['updated_start_at'] = undefined
				values['updated_end_at'] = undefined
				// values['requirement_id'] = values['requirement_id'] && values['requirement_id'].label
				// 查询请求
				getList(values)
			}
		});
	}
    filterGroup1 = val => {
        const {group1} = this.props
        if(!isNaN(group1)){
            return parseInt(val) === parseInt(group1)
        }else if (Array.isArray(group1)){
            return group1.some(item => val.some(i => parseInt(item) ===  parseInt(i)))
        }else {
            return true
        }
    }
    filterGroup2 = val => {
        const {group2} = this.props
        if(!isNaN(group2)){
            return parseInt(val) === parseInt(group2)
        }else if (Array.isArray(group2)){
            return group2.some(item => val.some(i => parseInt(item) ===  parseInt(i)))
        }else {
            return true
        }
    }

	render() {
		const { mediaManagerList, search_flag } = this.props;
		const { getFieldDecorator } = this.props.form;
		let accountStatusKeys = [1, 2, 3, 5],
			finishStatusKeys = [0, 1, 2],
			requirementPlanKeys = [1, 2],
			accountStatusAry = accountStatusKeys.map(key => accountStatusMap[key]),
			finishStatusAry = finishStatusKeys.map(key => finishStatusMap[key]),
			requirementPlanAry = requirementPlanKeys.map(key => requirementPlanMap[key])
		return (
			<Form layout="inline" onSubmit={this.submitQuery}>
				<FormItem label="平台">
					{
						getFieldDecorator('weibo_type', )(
							<PlatformSelect getPopupContainer={() => document.querySelector('.fix-task-page')} />
						)
					}
				</FormItem>
				<FormItem label="账号名称">
					{
						getFieldDecorator('account_name', {})(
							<Input placeholder='账号名称' />)
					}
				</FormItem>
				<FormItem label="最晚上架时间">
					{
						getFieldDecorator('launched_before_at', {})(
							<RangePicker format='YYYY-MM-DD HH:mm:ss' showTime={{
								hideDisabledOptions: true,
								defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
							}} />)
					}
				</FormItem>
				{search_flag ? <FormItem label="资源媒介">
					{
						getFieldDecorator('user_owner_admin_id', {})(
							<Select allowClear
								getPopupContainer={() => document.querySelector('.fix-task-page')}
								style={{ width: 130 }} placeholder='选择资源媒介'>
								{
									mediaManagerList.filter(({ user_group_id }) => this.filterGroup2(user_group_id)).map(({ user_id, real_name }) => {
										return <Option key={user_id}>{real_name}</Option>
									})
								}
							</Select>)
					}
				</FormItem> : null}
				<FormItem label="账号状态">
					{
						getFieldDecorator('status', {})(
							<Select allowClear
								getPopupContainer={() => document.querySelector('.fix-task-page')}
								style={{ width: 110 }} placeholder='选择状态'>
								{accountStatusAry.map(({ id, text }) =>
									<Option key={id}>{text}</Option>)}
							</Select>)
					}
				</FormItem>
				<FormItem label="拓号状态">
					{
						getFieldDecorator('finish_status', {})(
							<Select allowClear
								getPopupContainer={() => document.querySelector('.fix-task-page')}
								style={{ width: 130 }} placeholder='选择状态'>
								{finishStatusAry.map(({ id, text }) =>
									<Option key={id}>{text}</Option>)}
							</Select>)
					}
				</FormItem>
				<FormItem label="需求名称">
					{
						getFieldDecorator('requirement_name', {})(
							<Input placeholder='请输入需求名称' />
							/*<SearchSelect
							style={{ width: '150px' }}
							getPopupContainer={() => document.querySelector('.fix-task-page')}
							searchDataList={queryRequirement} keyWord='requirement_name' dataToList={res => {
							return res.data
							}} item={['requirement_id', 'requirement_name']} desc='请选择需求名称'/>*/
						)
					}
				</FormItem>
				<FormItem label="需求计划">
					{
						getFieldDecorator('requirement_plan', {})(
							<Select allowClear
								getPopupContainer={() => document.querySelector('.fix-task-page')}
								style={{ width: 130 }} placeholder='选择计划'>
								{requirementPlanAry.map(({ id, text }) =>
									<Option key={id}>{text}</Option>)}
							</Select>)
					}
				</FormItem>
				{search_flag ? <FormItem label="拓展媒介">
					{
						getFieldDecorator('owner_admin_id', {})(
							<Select allowClear
								getPopupContainer={() => document.querySelector('.fix-task-page')}
								style={{ width: 130 }} placeholder='选择拓展媒介'>
								{
									mediaManagerList.filter(({ user_group_id }) => this.filterGroup1(user_group_id)).map(({ user_id, real_name }) => {
										return <Option key={user_id}>{real_name}</Option>
									})
								}
							</Select>)
					}
				</FormItem> : null}
				<FormItem label="销售/AE">
					{
						getFieldDecorator('creator', {})(
							<Input placeholder='销售/AE' />)
					}
				</FormItem>
				<FormItem>
					<Button ghost type='primary' style={{ width: '80px' }}
						htmlType="submit"
						loading={this.props.tableLoading}
						className='filter-button'>查询</Button>
				</FormItem>
			</Form>)
	}
}

// 主账号选择
class SearchInput extends React.Component {
	constructor(props) {
		super(props);
		this.lastFetchId = 0;
		this.fetchUser = debounce(this.fetchUser, 800);
	}

	state = {
		data: [],
		value: [],
		fetching: false,
	}
	fetchUser = (value) => {
		let { getUserList } = this.props
		this.lastFetchId += 1;
		const fetchId = this.lastFetchId;
		this.setState({ data: [], fetching: true });
		getUserList({ search_type: 1, identity_name: value })
			.then(res => res.data)
			.then((_data) => {
				if (fetchId !== this.lastFetchId) {
					return;
				}
				const data = _data.list.rows.map(account => ({
					text: account.identity_name,
					value: account.user_id,
				}));
				this.setState({ data, fetching: false });
			});
	}
	handleChange = (value) => {
		this.setState({
			value,
			data: [],
			fetching: false,
		});
	}

	render() {
		const { fetching, data, value } = this.state;
		const { operationUrl, babysitter_host } = this.props;
		return (<div>
			选择主账号：
            <Select
				className='mr10'
				showSearch
				allowClear
				labelInValue
				showArrow={false}
				filterOption={false}
				value={value}
				placeholder="搜索并选择主账号"
				notFoundContent={fetching ? <Spin size="small" /> : null}
				onSearch={this.fetchUser}
				onChange={this.handleChange}
				style={{ width: '180px' }}
			>
				{data.map(d => <Option key={d.value}>{d.text}</Option>)}
			</Select>
			<Button type='primary'
				disabled={!value || !value.key}
				onClick={() => {
					window.open(operationUrl.replace('%ID%', value.key));
				}}>去入库</Button>
			<p style={{ marginTop: '10px', textDecoration: 'underline' }}>
				<a target={'_blank'} href={babysitter_host + '/user/register'}>没有找到合适的主账号，去创建主账号</a>
			</p>
		</div>)
	}
}


export default AllocateTask;
