import React, { Component } from "react";
import {
	Select, Form, Input, Button, Modal, Table, Divider, DatePicker,
	message, Spin
} from "antd";
//import { browserHistory } from 'react-router'
import moment from 'moment'
import {
	accountStatusMap,
	areaMap, requirementPlanMap, sourceMap
} from "../../constants/config";
import { connect } from "react-redux";
import numeral from 'numeral';

import * as actions from '../../actions'
import HeaderStep from '../../components/HeaderStep'
import FilterContainer from "../../components/FilterContainer";
import StausView from '../../base/StatusView'
import './selectNumber.less';
import PlatformSelect from "../../base/PlatformSelect";
import debounce from 'lodash/debounce';

const { RangePicker } = DatePicker;
const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input;

// 区间选择时间
/*function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}*/

// 禁用日期当前
function disabledDate(current) {
	return current && current <= moment().startOf('day');
}

// 禁用日期24小时后
function disabledDate24H(current) {
	return current && current <= moment().endOf('day');
}

// 禁用准确时间
/*function disabledDateTime() {
    return {
        disabledHours: () => [],
        disabledMinutes: () => range(0, 60).filter(n => n % 5),
        disabledSeconds: () => range(1, 60),
    };
}*/

// 处理需求数据同步
function handleDemandSync(demand) {
	let _obj = {}
	for (let key in demand) {
		if (!demand.hasOwnProperty(key)) continue
		if (!demand[key]) {
			_obj[key] = undefined
		} else {
			_obj[key] = demand[key].toString()
		}
	}
	_obj['promotion_time'] = [moment(_obj['promotion_start_at']), moment(_obj['promotion_end_at'])]
	_obj['launched_before'] = moment(_obj['launched_before'])
	_obj['requirement_name'] = undefined
	return _obj
}

numeral.locale('chs')

@connect(state => state.extensionNumber, actions)
class SelectNumber extends Component {
	state = {
		filter: {},
		currentPage: 1,
		selectedRowKeys: [],
		step: 1,
		createModalShow: false,
		tableLoading: false
	}
	// 处理创建需求
	handleCreateModal = () => {
		// 其他处理
		this.setState({ createModalShow: true, step: 2 })
	}

	// 处理步骤
	handleStep = step => {
		this.setState({ step })
	}

	// 获取列表方法
	getList = async (query = {}) => {
		let { getImportAccountList } = this.props
		let { filter } = this.state
		this.setState({ tableLoading: true })
		await getImportAccountList({ ...filter, page: 1, ...query })
		this.setState({
			selectedRowKeys: [],
			filter: { ...filter, ...query },
			tableLoading: false,
			currentPage: query.page || 1
		})
	}

	componentWillMount() {
		// 获取已导入账号列表
		this.getList()
	}

	render() {
		let {
			importAccountList, queryRequirement, validateRequirementName,
			postCreateDemand
		} = this.props
		let { count = 0, page = 1, pageNum = 100, map, list } = importAccountList || {}
		let rowSelection = {
			getCheckboxProps: (record) => ({
				disabled: record.status == '4' || record.status == '2'
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
		let columns = [
			{
				title: 'ID',
				dataIndex: 'weibo_id',
				align: 'center',
				render: (id) => {
					return id;
				}
			}, {
				title: '平台',
				dataIndex: 'weibo_type_name',
				align: 'center',
				render: (type) => {
					return type
				}
			}, {
				title: '账号名',
				dataIndex: 'account_name',
				align: 'center',
				render: (text) => {
					return text
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
				title: '粉丝数',
				dataIndex: 'followers_count',
				align: 'center',
				render: (num) => num ? numeral(num).format('0,0') : '0'
			}, {
				title: '导入时间',
				dataIndex: 'created_at',
				align: 'center',
				render: (text) => text || '-'
			}, /*{
                title: '最后更新(发文)时间',
                dataIndex: 'last_online_at',
                align: 'center',
                render: (time) => time || '-'
            },*/ {
				title: '账号状态',
				dataIndex: 'status_name',
				align: 'center',
				render: (status) => <StausView status={status} />
			}, /*{
                title: '报价',
                dataIndex: 'price',
                align: 'center',
                render: (price) => price || '-'
            }*/
		]
		let primary_key = 'ext_account_id'
		let dataSoure = list.map(item => map[item])
		return (
			<div className='extension-number select-number-page'>
				<HeaderStep step={this.state.step} />
				<Divider />
				<header className='page-content'>
					<FilterContainer>
						<FilterForm tableLoading={this.state.tableLoading} getList={this.getList} />
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
					<Button type='primary' disabled={this.state.selectedRowKeys.length <= 0} className='next-button' onClick={this.handleCreateModal}>填写拓号需求</Button>
				</footer>
				{this.state.createModalShow ?
					<Modal visible={true}
						maskClosable={false}
						title='微播易提醒您：请创建拓号需求'
						wrapClassName='extension-number-modal modal-select-number-page'
						width={800}
						footer={null}
						onCancel={() => {
							this.setState({
								createModalShow: false,
								step: 1
							})
						}}
					>
						<CreateForm selected={this.state.selectedRowKeys}
							queryRequirement={queryRequirement}
							validateName={validateRequirementName}
							postCreateDemand={postCreateDemand}
							dataMap={map}
						/>
					</Modal> : null}
			</div>
		);
	}
}

@Form.create({})
class FilterForm extends Component {
	// 查询提交
	submitQuery = (e) => {
		let { getList } = this.props
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (values.created_at) values.created_at = values.created_at.map(moment => {
					return moment.format('YYYY-MM-DD HH:mm:ss')
				})
				// 查询请求
				getList(values)
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form
		let accountStatusKeys = [1, 2, 3, 4, 5]
		let accountStatusAry = accountStatusKeys.map(i => accountStatusMap[i])

		return (<Form layout="inline" onSubmit={this.submitQuery}>
			<FormItem label="平台">
				{
					getFieldDecorator('weibo_type', {})(
						<PlatformSelect getPopupContainer={() => document.querySelector('.select-number-page')} />)
				}
			</FormItem>
			<FormItem label="账号名称">
				{
					getFieldDecorator('account_name', {})(
						<Input placeholder='账号名称' />)
				}
			</FormItem>
			<FormItem label="链接">
				{
					getFieldDecorator('url', {
						rules: [{ type: 'url', message: '请填写正确的链接' }]
					})(<Input placeholder='链接' />)
				}
			</FormItem>
			<FormItem label="id">
				{
					getFieldDecorator('weibo_id', {
						rules: [{ pattern: /\d/, message: '请输入正确的id号' }]
					})(<Input placeholder='id' />)
				}
			</FormItem>
			<FormItem label="账号状态">
				{
					getFieldDecorator('status', {})(
						<Select allowClear
							getPopupContainer={() => document.querySelector('.select-number-page')}
							placeholder='选择状态' style={{ width: 120 }}>
							{accountStatusAry.map(({ id, text }) =>
								<Option key={id}>{text}</Option>)}
						</Select>)
				}
			</FormItem>
			<FormItem label="账号导入时间">
				{
					getFieldDecorator('created_at', {})(
						<RangePicker format='YYYY-MM-DD HH:mm:ss' showTime={{
							defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
						}} />)
				}
			</FormItem>
			<FormItem>
				<Button ghost type='primary' style={{ width: '100px' }}
					htmlType="submit"
					loading={this.props.tableLoading}
					className='filter-button'>查询</Button>
			</FormItem>
		</Form>)
	}
}

@Form.create({})
class CreateForm extends Component {
	state = {
		demandNameType: 0,
		createLoading: false,
		requermentList: [],
		value: [],
		searchLoading: false,
	}

	constructor() {
		super()
		this.lastFetchId = 0;
		this.searchRequerment = debounce(this.searchRequerment, 800);
	}

	// 模糊查询需求列表
	searchRequerment = (value) => {
		let { queryRequirement } = this.props
		this.lastFetchId += 1;
		const fetchId = this.lastFetchId;
		this.setState({ requermentList: [], searchLoading: true });
		queryRequirement({ requirement_name: value })
			.then(res => res.data)
			.then((data) => {
				if (fetchId !== this.lastFetchId) {
					return;
				}
				this.setState({ requermentList: data || [], searchLoading: false });
			});
	}

	// 提交创建需求表单
	submitCreate = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ createLoading: true })
				// 处理表单参数
				let body = Object.entries(values).reduce((pre, [key, value]) => {
					if (key === 'promotion_time') {
						pre['promotion_start_at'] = value[0].format()
						pre['promotion_end_at'] = value[1].format()
					} else if (key === 'launched_before') {
						pre['launched_before'] = value.format()
					} else {
						pre[key] = value
					}
					return pre
				}, {})
				// 处理选择项
				let { dataMap } = this.props,
					account_name = [];
				this.props.selected.forEach(item => {
					account_name.push(dataMap[item].account_name);
					// id.push(dataMap[item].account_id);
				});
				// 提交表单
				this.props.postCreateDemand({
					...body,
					account_name,
					account_id: this.props.selected,
				}).then(({ msg }) => {
					message.success(msg, 1.2, () => {
						//修改了push的方式
						this.props.history.push('/extensionNumber/seller/demandHistory')
						//browserHistory.push('/extensionNumber/seller/demandHistory')
					});
				}).catch(({ msg }) => {
					message.error(msg || '提交失败', 1.2);
					this.setState({ createLoading: false, })
				})
			}
		});
	}
	// 处理选择已有需求,需求描述跟随修改
	handleDemandName = (value) => {
		if (!value) return this.setState({ value })
		let demand = this.state.requermentList.find(item => item.requirement_id == value.key) || {};
		this.props.form.setFieldsValue(handleDemandSync(demand))
		this.setState({
			value,
			requermentList: [],
			searchLoading: false,
		});
	}
	// 检验新建需求名称是否重复
	checkDemandName = (rule, value, callback) => {
		// let { validateName } = this.props;
		// console.log(validateName);
        /*if (Object.values(this.existingDemandMap).find(({ requirement_name }) => requirement_name === value)) {
            callback('需求名称不能重复')
        }*/
		callback()
	}
	// 检查预计推广时间
	checkPromotionTime = (rule, value, callback) => {
		if (value) {
			let [start, end] = value;
			if (start >= end) {
				callback('结束日期必须晚于开始日期')
			}
			if (start < moment()) {
				callback('开始时间必须大于当前时间')
			} else if (end < (moment() + 24 * 60 * 60 * 1000)) {
				callback('结束时间必须晚于当前时间的24小时')
			}
			callback()
		}
	}
	// 检查最晚上架时间
	checkdDeadline = (rule, value, callback) => {
		if (value < (moment() + 48 * 60 * 60 * 1000)) {
			callback('请选择距离当前时间48小时以后的上架时间')
		}
		callback()
	}

	render() {
		const { getFieldDecorator } = this.props.form
		let areaKeys = [1, 2, 3, 4],
			requirementPlanKeys = [1, 2],
			sourceKeys = [1, 2],
			areaAry = areaKeys.map(key => areaMap[key]),
			requirementPlanAry = requirementPlanKeys.map(key => requirementPlanMap[key]),
			sourceAry = sourceKeys.map(key => sourceMap[key])
		const { searchLoading, requermentList, value } = this.state;

		return (<Form layout="inline" onSubmit={this.submitCreate}>
			<div>
				<FormItem label="需求名称">
					{
						getFieldDecorator('requirement_name', {
							validateFirst: true,
							validateTrigger: 'onBlur',
							rules: [{
								required: true,
								message: '填写需求名称',
							}, {
								validator: this.checkDemandName,
							}]
						})(
							<Input placeholder='填写需求名称' />)
					}
				</FormItem>
				<FormItem label="选择需求模板">
					<Select className='w170 mr10'
						showSearch
						allowClear
						labelInValue
						filterOption={false}
						value={value}
						notFoundContent={searchLoading ?
							<Spin size="small" /> : null}
						onSearch={this.searchRequerment}
						style={{ width: '200px' }}
						placeholder='(选填)选择填充需求内容'
						optionFilterProp="children"
						onChange={this.handleDemandName}
					>
						{requermentList.map(d =>
							<Option key={d.requirement_id}>{d.requirement_name}</Option>)}
					</Select>
					{/*<span className='g9'>同步已有需求信息</span>*/}
				</FormItem>
			</div>
			<FormItem label="创建人区域">
				{
					getFieldDecorator('creator_area', {
						initialValue: '1',
						rules: [
							{
								required: true,
								message: '请选择创建人区域'
							}
						]
					})(
						<Select className='w120' showSearch
						>
							{areaAry.map(({ id, text }) =>
								<Option key={id}>{text}</Option>)}
						</Select>)
				}
			</FormItem>
			<FormItem label="项目组名称">
				{
					getFieldDecorator('project_team_name', {})(
						<Input style={{ width: '200px' }} placeholder='(选填)项目组名称' />)
				}
			</FormItem>
			<FormItem label="需求计划" className='mr0'>
				{
					getFieldDecorator('requirement_plan', {
						initialValue: '1',
						rules: [
							{
								required: true,
								message: '请选择需求计划'
							}
						]
					})(<Select className='w130' showSearch
					>
						{requirementPlanAry.map(({ id, text }) =>
							<Option key={id}>{text}</Option>)}
					</Select>)
				}
			</FormItem>
			<FormItem label="创建人联系方式">
				{
					getFieldDecorator('creator_mobile', {
						rules: [
							{
								required: true,
								pattern: /\d/,
								message: '请输入正确的联系方式'
							}
						]
					})(
						<Input placeholder='手机号/座机' />)
				}
			</FormItem>
			<FormItem label="需求来源">
				{
					getFieldDecorator('source_code', {
						initialValue: '1',
						rules: [
							{
								required: true,
								message: '请选择需求来源'
							}
						]
					})(
						<Select style={{ width: '84px' }} showSearch
						>
							{sourceAry.map(({ id, text }) =>
								<Option key={id}>{text}</Option>)}
						</Select>)
				}
			</FormItem>
			<FormItem label="推广产品" className='mr0'>
				{
					getFieldDecorator('promoted_product', {
						rules: [
							{
								required: true,
								message: '请输入推广产品'
							}
						]
					})(
						<Input placeholder='请输入推广产品' />)
				}
			</FormItem>
			<FormItem label="预计推广时间">
				{
					getFieldDecorator('promotion_time', {
						validateFirst: true,
						rules: [
							{
								required: true,
								message: '请选择预计推广时间'
							}, {
								validator: this.checkPromotionTime,
							}
						]
					})(
						<RangePicker style={{ width: '450px' }}
							disabledDate={disabledDate}
							// disabledTime={disabledDateTime}
							showTime={{
								hideDisabledOptions: true,
								defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
							}}
							format="YYYY-MM-DD HH:mm:ss"
						/>)
				}
			</FormItem>
			<FormItem label="最晚上架时间">
				{
					getFieldDecorator('launched_before', {
						rules: [
							{
								required: true,
								message: '请选择最晚上架时间'
							}, {
								validator: this.checkdDeadline
							}
						]
					})(
						<DatePicker style={{ width: '200px' }}
							showTime={{
								disabled: true,
								hideDisabledOptions: true,
								defaultValue: moment('23:59:59', 'HH:mm:ss')
							}}
							format="YYYY-MM-DD HH:mm:ss"
							disabledDate={disabledDate24H}
						// disabledTime={disabledDateTime}
						/>)
				}
			</FormItem>
			<div className='d-fl'>
				<FormItem label="需求描述">
					<div className='textarea-box'>
						{
							getFieldDecorator('desc', {
								rules: [{ max: 1000, message: '最多可输入1000字' }]
							})(
								<TextArea placeholder="需求描述" autosize={{
									minRows: 2,
									maxRows: 4
								}} />
							)
						}
						<p>需求描述越详细，越有助于拓号成功和拓号效率哦</p>
					</div>
				</FormItem>
				<FormItem label="备注">
					<div className='textarea-box'>
						{
							getFieldDecorator('comment', {
								rules: [{ max: 1000, message: '最多可输入1000字' }]
							})(
								<TextArea placeholder="备注" autosize={{
									minRows: 2,
									maxRows: 4
								}} />
							)
						}
					</div>
				</FormItem>
			</div>
			<footer className='tac'>
				<FormItem>
					<Button type='primary' style={{ padding: '0 26px' }}
						htmlType="submit"
						className='filter-button'
						loading={this.state.createLoading}
					>提交</Button>
				</FormItem>
			</footer>
		</Form>)
	}
}

export default SelectNumber;

