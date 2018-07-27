import React, { Component } from "react";
import {
	Select, Form, Input, Button, Table, Modal, Spin
} from "antd";

import { connect } from "react-redux";
import * as actions from '../../actions'
import FilterContainer from "../../components/FilterContainer";
import './allocateTask.less';
import StausView from "../../base/StatusView";
import {
	accountStatusMap,
} from "../../constants/config";
import debounce from 'lodash/debounce';
// import numeral from 'numeral';
import SearchSelect from "../../base/SearchSelect";
import moment from 'moment'
import PlatformSelect from "../../base/PlatformSelect";

const FormItem = Form.Item
const Option = Select.Option


@connect(state => state.extensionNumber, actions)
class AllocateTask extends Component {
	state = {
		filter: {},
		currentPage: 1,
		selectedRowKeys: [],
		createModalShow: false,
		submitAllocateLoading: false,
		storeModalShow: false,
		storeForm: null,
	}
	// 获取列表方法
	getList = async (query = {}) => {
		let { getUsualAllotList } = this.props
		let { filter } = this.state
		this.setState({ tableLoading: true })
		await getUsualAllotList({ ...filter, page: 1, ...query })
		this.setState({
			selectedRowKeys: [],
			filter: { ...filter, ...query },
			tableLoading: false,
			currentPage: query.page || 1
		})
	}

	componentWillMount() {
		let { getAllPlatformList, allPlatformList } = this.props
		if (Object.keys(allPlatformList).length <= 0) {
			getAllPlatformList()
		}
		// 获取拓号任务分配列表
		this.getList()
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

	render() {
		let { usualAllotList } = this.props
		let { count = 0, page = 1, pageNum = 100, map, list } = usualAllotList || {}
		let columns = [
			{
				title: 'ID',
				dataIndex: 'weibo_id',
				align: 'center',
				width: 108,
				render: (id) => {
					return id || '-'
				}
			}, {
				title: '链接',
				dataIndex: 'homepage_url',
				align: 'center',
				width: 48,
				render: (homepage_url) => {
					return <div>{
						homepage_url ? <a target={'_blank'} href={homepage_url}>url</a> : '-'
					}
					</div>
				}
			}, {
				title: '平台',
				dataIndex: 'weibo_type_name',
				align: 'center',
				width: 108,
				render: (text) => {
					return text || '-'
				}
			}, {
				title: '标签/分类',
				dataIndex: 'category',
				align: 'center',
				width: 108,
				render: (text) => {
					return <div>
						<span>{text && text[0] && text[0].name || '-'}</span>
						{/*<span>{record.category_name}</span>*/}
					</div>
				}
			}, {
				title: '账号名称',
				dataIndex: 'weibo_name',
				align: 'center',
				width: 174,
			}, {
				title: '粉丝量',
				dataIndex: 'followers_count',
				align: 'center',
				width: 108,
				render: num => num,
			}, {
				title: '入库/上架时间',
				dataIndex: 'created_time',
				align: 'center',
				width: 168,
				render: (created_time, { first_online_time }) => {
					return <div style={{ textAlign: 'left' }}>
						<span>入库：{created_time ? moment(created_time).format('YYYY-MM-DD') : '-'}</span><br />
						<span>上架：{first_online_time && first_online_time !== '0000-00-00 00:00:00' ? moment(first_online_time).format('YYYY-MM-DD') : '-'}</span>
					</div>
				}
			}, {
				title: '最后更新(发文)时间',
				dataIndex: 'latest_update_time',
				align: 'center',
				width: 128,
				render: (text) => {
					return <span>{text ? moment(parseInt(text)).format('YYYY-MM-DD') : '-'}</span>
				}
			}, {
				title: '播放量/阅读量',
				dataIndex: '3',
				align: 'center',
				width: 160,
				render: (text, record) => {
					return <div style={{ textAlign: 'left' }}>
						<span>播放量：{record.total_play_num || '-'}</span><br />
						<span>阅读量：{record.read_num || '-'}</span></div>
				}
			}, {
				title: '账号状态',
				dataIndex: 'status_name',
				align: 'center',
				width: 102,
				render: (online_status) =>
					<StausView status={online_status} /> || '-'
			}, {
				title: '操作',
				dataIndex: '-',
				align: 'center',
				width: 68,
				render: (n, item) => {
					return <div>
						{
							item.status == 1 ?
								<Button type="primary" size='small' onClick={() => {
									this.createStoreForm(item)
								}}>入库</Button> :
								item.status == 2 ?
									<Button type="primary" size='small' onClick={() => {
										window.open(item.operationUrl);
									}}>下架</Button> :
									item.status == 3 ?
										<Button type="primary" size='small' onClick={() => {
											window.open(item.operationUrl);
										}}>上架</Button> :
										'-'
						}
					</div>
				}
			}
		]
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
			current: Number(page) || 1
		}
		let primary_key = 'key'
		let dataSoure = list.map(item => map[item])
		return (
			<div className='extension-number usual-extend-page'>
				<header className='page-content'>
					<FilterContainer>
						<FilterForm getList={this.getList}
							getCategoryList={this.props.getCategoryList}
							getTagList={this.props.getTagList}
							allPlatformList={this.props.allPlatformList}
							tableLoading={this.state.tableLoading}
						/>
					</FilterContainer>
				</header>
				<main>
					<Table pagination={pagination}
						bordered columns={columns}
						rowKey={record => record[primary_key]}
						loading={this.state.tableLoading}
						dataSource={dataSoure}
						scroll={{ x: 1134 }}
					/>
				</main>
				<Modal className='extension-number-modal'
					visible={this.state.storeModalShow}
					maskClosable={false}
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
		e.preventDefault();
		let { getList } = this.props
		this.props.form.validateFields((err, values) => {
			if (!err) {
				// 查询请求
				values['category_name'] = values['category_name'] && values['category_name'].label
				values['tag_name'] = values['tag_name'] && values['tag_name'].label
				getList(values)
			}
		});
	}

	render() {
		const { getTagList, getCategoryList } = this.props;
		const { getFieldDecorator } = this.props.form;
		let accountStatusKeys = [1, 2, 3],
			// platformList = this.props.allPlatformList || {},
			// finishStatusKeys = [1],
			// requirementPlanKeys = [1, 2],
			accountStatusAry = accountStatusKeys.map(key => accountStatusMap[key])
		// finishStatusAry = finishStatusKeys.map(key => finishStatusMap[key])
		return (<div><Form layout="inline" onSubmit={this.submitQuery}>
			<FormItem label="平台">
				{
					getFieldDecorator('weibo_type', )(
                        /*<Select allowClear
                                getPopupContainer={() => document.querySelector('.usual-extend-page')}
                                showSearch
                                optionFilterProp="children"
                                placeholder='选择平台' className='w130' {...this.props}>
                            {
                                Object.entries(platformList).map(([key, name]) => {
                                    return <Option key={key}>{name}</Option>
                                })
                            }
                        </Select>*/
						<PlatformSelect getPopupContainer={() => document.querySelector('.usual-extend-page')}
							className='w130' />
					)
				}
			</FormItem>
			<FormItem label="账号名称">
				{
					getFieldDecorator('weibo_name', {})(
						<Input placeholder='账号名称' />)
				}
			</FormItem>
			<FormItem label="粉丝数">
				{
					getFieldDecorator('followers_count_start', {
						rules: [{ pattern: /\d/, message: '请输入数字' }]
					})(
						<div><Input placeholder='最低数' style={{ width: 110 }} />
						</div>)
				}
			</FormItem>
			<FormItem label="-" colon={false}>
				{
					getFieldDecorator('followers_count_end', {
						rules: [{ pattern: /\d/, message: '请输入数字' }]
					})(
						<div><Input placeholder='最高数' style={{ width: 110 }} />
						</div>)
				}
			</FormItem>
			<FormItem label="标签">
				{
					getFieldDecorator('tag_name', {})(
						<SearchSelect
							getPopupContainer={() => document.querySelector('.usual-extend-page')}
							searchDataList={getTagList} keyWord='name' dataToList={res => {
								return res.data.items
							}} item={['id', 'name']} desc='请选择标签' />)
				}
			</FormItem>
			<FormItem label="分类">
				{
					getFieldDecorator('category_name', {})(
						<SearchSelect
							getPopupContainer={() => document.querySelector('.usual-extend-page')}
							searchDataList={getCategoryList} keyWord='name' dataToList={res => {
								return res.data.items
							}} item={['key', 'name']} desc='请选择分类' />)
				}
			</FormItem>
			<FormItem label="账号状态">
				{
					getFieldDecorator('status', {})(
						<Select
							getPopupContainer={() => document.querySelector('.usual-extend-page')}
							allowClear style={{ width: 110 }} placeholder='选择状态'>
							{accountStatusAry.map(({ id, text }) =>
								<Option key={id}>{text}</Option>)}
						</Select>)
				}
			</FormItem>
			<FormItem label="从高到低排序">
				{
					getFieldDecorator('sort_type', {})(
						<Select style={{ width: 160 }}
							allowClear
							getPopupContainer={() => document.querySelector('.usual-extend-page')}
							placeholder='选择排序方式'>
							<Option value="1">粉丝数</Option>
							<Option value="2">入库时间</Option>
							<Option value="3">最后上架时间</Option>
						</Select>)
				}
			</FormItem>
			<FormItem>
				<Button ghost type='primary' style={{ width: '80px' }}
					htmlType="submit"
					loading={this.props.tableLoading}
					className='filter-button'>查询</Button>
			</FormItem>
		</Form>
		</div>)
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
