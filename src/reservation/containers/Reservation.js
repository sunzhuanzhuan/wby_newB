import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Scolltable from "../../components/Scolltable";
import { Table, Button, Tooltip, Icon, Popover, Spin, Form, message } from 'antd';
import * as reservationAction from '../actions/reservation'
import * as readyonlyaction from '../actions/readyonlyaction'
//全选按钮组件
import { WBYTableFooter } from 'wbyui'
// 弹框模板
import ReservationReadOnlyModal from '../components/ReservationReadOnlyModal'
import ReservationModal from '../components/ReservationModal'
//只读
import StatisticsForm from '../components/StatisticsForm'
import FilterForm from '../components/filterComponents/SearchForm'
import ThirdChargePaid from '../components/readOnlyContent/ThirdChargePaid'
//码表
import modalChildrenConfig from '../components/modalChildrenConfig'
import RejectComplaint from './modalChildren/RejectComplaint'
import ManagerInspectionPause from './modalChildren/ManagerInspectionPause'
import BatchInspectionQualify from './modalChildren/BatchInspectionQualify'
import api from '../../api/index'
import './qc.less'

class Reservation extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			modalType: '',
			type: "ExecuteContent",
			readOnlyContent: {},
			records: {},
			selectedRowKeys: [],
			content: "",
			loading: true,
			reservationModaRecord: {},
			title: "",
			rejectVisible: false,
			status: 1,
			pauseVisible: false,
			batchQualifyVisible: false
		}
	}
	componentWillMount() {
		this.props.actions.getRole();
		this.props.actions.getMediaUsers();//action的方法
		this.props.actions.getPlatformList();
		this.props.actions.getVolUsers();
		this.props.actions.getQcStatusList().then(() => {
			this.props.actions.getList(this.dealSearchValue()).then(() => {
				this.setState({
					loading: false
				})
			})
		})
	}
	//处理筛选条件
	dealSearchValue = () => {
		let values = this.props.form.getFieldsValue()
		let item = {};
		for (item in values) {
			if (values[item] == undefined || values[item] == 0) {
				values[item] = ''
			}
		}
		const timeList = ["execution_started_at", "execution_ended_at", "create_started_at", "create_ended_at",
			"execution_completed_started_at", "execution_completed_ended_at", "qc_started_at",
			"qc_ended_at", "qc_complete_started_at", "qc_complete_ended_at"]
		timeList.forEach(item => {
			if (values[item]) {
				values[item] = values[item].format("YYYY-MM-DD")
			}
		})
		delete values.qc_stage_status
		if (values.order_id !== "" && values.order_id !== undefined) {
			values.order_id = values.order_id.replace(/\s/g, '');
		}
		values.page = 1;
		values.page_size = 20;
		return values;
	}
	//只读弹框出现 执行内容 结果，数据截图
	showExecute(record, type) {
		this.props.actions.getExecuteData({ url: type, id: record.order_id }).then(() => {
			this.setState({
				records: record || {},
				type: type,
				readOnlyContent: this.props.executedata || {}
			});
			this.setState({ modalType: "ReservationReadOnlyModal" });
		});
	}
	showModal(modalType) {
		document.body.style.overflow = "hidden";
		this.setState({ modalType });
	}
	closeModal = () => {
		this.setState({ modalType: '' })
		this.props.actions.resetData()
	}
	//关闭弹窗更新数据
	closeModalUpdate = () => {
		this.setState({
			loading: true,
			selectedRowKeys: [],
			modalType: ''
		})
		this.props.actions.resetData();
		let values = this.dealSearchValue();
		values.page = this.props.reservationList.pagination.page;
		this.props.actions.getList(values).then(() => {
			this.setState({
				loading: false
			})
		}).catch(() => {
			message.errpr("数据更新失败", () => {
				this.setState({
					loading: false
				})
			})
		})
	}
	handleCancel() {
		this.closeModal();
	}
	//获取媒介的电话号码
	getContent(id) {
		this.setState({ content: "" })
		api.get('/user/getUserInfo?user_id=' + id).then((response) => {
			this.setState({ content: response.data.cell_phone })
		})
	}
	//点击分页
	changePage(page) {
		this.setState({
			loading: true,
			selectedRowKeys: []
		})
		let values = this.dealSearchValue();
		values.page = page;
		this.props.actions.getList(values).then(() => {
			this.setState({
				loading: false
			})
		}).catch(() => {
			message.errpr("数据更新失败", () => {
				this.setState({
					loading: false
				})
			})
		})
	}
	//展示ReservationModal
	showReservationModal(record, status) {
		this.setState({
			modalType: "ReservationModal",
			reservationModaRecord: { ...record },
			title: `预约订单质检 
			【订单号：${record.order_id}  
			账号名称：${record.account_name}  
			平台：${record.platform_name
				}】 详细质检状态：${record.qc.status_display}`,
			status: status
		});
	}
	//取消按钮
	handleCancels = (type) => {
		if (type == "reject") {
			this.setState({
				rejectVisible: false
			})
		} else if (type == "pause") {
			this.setState({
				pauseVisible: false
			})
		} else if (type == "batch") {
			this.setState({
				batchQualifyVisible: false
			})
		}
	}
	//弹框出现
	showModals = (type) => {
		this.closeModal()
		if (type == "reject") {
			this.setState({
				rejectVisible: true
			})
		} else if (type == "pause") {
			this.setState({
				pauseVisible: true
			})
		} else if (type == "batch") {
			if (this.state.selectedRowKeys.length == 0) {
				message.error("请选择订单")
			} else {
				this.setState({
					batchQualifyVisible: true
				})
			}
		}
	}
	//关闭弹框更新数据
	closeModalUpdates = (type) => {
		this.handleCancels(type)
		this.setState({
			loading: true,
			selectedRowKeys: []
		})
		let values = this.dealSearchValue();
		values.page = this.props.reservationList.pagination.page;
		this.props.actions.getList(values).then(() => {
			this.setState({
				loading: false
			})
		}).catch(() => {
			message.errpr("数据更新失败", () => {
				this.setState({
					loading: false
				})
			})
		})
	}
	getPlainOptions = (item = []) => {
		return item.filter(record => record.qc.status === '1');
	}

	onCheckAllChange = e => {
		const item = this.props.reservationList.item;
		const plainOptions = this.getPlainOptions(item).map(item => item.order_id);
		this.setState({
			selectedRowKeys: e.target.checked ? plainOptions : []
		});
	};
	render() {
		const { reservationList, role_id } = this.props;
		const item = reservationList.item;
		const plainOptions = this.getPlainOptions(item);
		const formItemLayout = {
			labelCol: { span: 2 },
			wrapperCol: { span: 22 },
		};
		if (JSON.stringify(reservationList) === "{}") {
			reservationList.pagination = {
				page: 1,
				page_size: 20,
				total: 1
			}
		}
		//订单ID跳转地址
		var orderIdHref = "";
		if (reservationList.babysitter_host) {
			if (role_id) {
				if (role_id === "Administrator" || role_id === "AccountManager" || role_id === "AccountDirector" || role_id === "AccountManagerLeader" || role_id === "OperationManager" || role_id === "AccountInspector" || role_id === "AccountInspectorManager") {
					orderIdHref = `${reservationList.babysitter_host} / pack / order / infoformanager / order_id / `;
				} else if (role_id === "VOLExecutive") {
					orderIdHref = `${reservationList.babysitter_host} / pack / order / infoforvol / order_id / `;
				} else if (role_id === "SaleTopManager" || role_id === "SaleTopDirector" || role_id === "SaleOperation" || role_id === "SaleSupport" || role_id === "SaleSeniorManager" || role_id === "SaleForManager" || role_id === "SaleSupervisor" || role_id === "Sale_Saler" || role_id === "SaleAssistant" || role_id === "SaleSmallAccountDirector") {
					orderIdHref = `${reservationList.babysitter_host} / pack / order / info / order_id / `;
				}
			}
		}
		const columns = [
			{
				title: '质检状态', dataIndex: 'qc_stage_display',
				key: 'qc_stage_display', render: (text, record) =>
					<div>{record.qc.stage_display}</div>
			},
			{
				title: '详细质检状态', dataIndex: 'qc_status_display',
				key: 'qc_status_display', render: (text, record) => {
					return record.qc.status === "1" ?
						<div className="executeResultBtns">{record.qc.status_display}</div>
						: <a className="executeResultBtn"
							onClick={this.showExecute.bind(this, record, "GetQcHistory")}>
							{record.qc.status_display}</a>
				}
			},
			{
				title: '操作截止时间', dataIndex: 'allow_operated_before',
				key: 'allow_operated_before', width: 170, render: (text, record) =>
					<span className="executeEndTimeBtn">{record.qc.expired_at}</span>
			},
			{
				title: '订单ID', dataIndex: 'order_id', width: 80,
				key: 'order_id', render: (text, record) => {
					return <div>
						<a target="_blank" href={`${orderIdHref}${text}`}
							className="executeResultBtn">{text}</a>
						{
							parseInt(record.third_party_paid_status) === 1
								? <ThirdChargePaid
									price={record.price}
									thirdChargePrice={record.third_charge_price}
									remainPrice={record.remain_price}
									showThirdChargePay={this.props.showThirdChargePay}
								/>
								: ""
						}
					</div>
				}
			},
			{
				title: '需求名称', dataIndex: 'requirement_name',
				key: 'requirement_name',
				render: (text, record) =>
					<a className="executeResultBtn"
						onClick={this.showExecute.bind(this, record, "ExecuteContent")}>{text}</a>
			},
			{
				title: '执行结果', dataIndex: 'executeResult',
				key: 'executeResult', render: (text, record) => {
					return <div>
						<a className="executeResultBtn" onClick={this.showExecute.bind(this, record, "ExecuteResult")}>查看执行结果</a>
						{
							record.platform_name === "新浪微博" && record.wei_execution_img !== "" ?
								<a className="executeResultBtn" target="_blank" href={record.wei_execution_img}>查看微任务截图</a> : ""
						}
					</div>
				}
			},
			{
				title: '数据截图', dataIndex: 'executeImg',
				key: 'executeImg', render: (text, record) => {
					return record.support_operates.show_data_screenshot && record.support_operates.show_data_screenshot === true ?
						<a className="executeResultBtn" onClick={this.showExecute.bind(this, record, "DataScreenshot")}>查看数据截图</a> : ""
				}
			},
			{ title: '账号名称', dataIndex: 'account_name', key: 'account_name' },
			{ title: '平台', dataIndex: 'platform_name', key: 'platform_name' },
			{ title: '主账号名称', dataIndex: 'user_name', key: 'user_name' },
			{
				title: '媒介经理', dataIndex: 'media',
				key: 'media', width: 150, render: (text, record) => {
					return record.vol_admin.name !== '' ?
						<div>
							资源媒介:<Popover content={this.state.content} title="联系方式" trigger="click" onClick={this.getContent.bind(this, record.media_admin.id)}>
								<a className="executeResultBtn">{record.media_admin.name}</a>
							</Popover>
							项目媒介:<Popover content={this.state.content} title="联系方式" trigger="click" onClick={this.getContent.bind(this, record.vol_admin.id)}>
								<a className="executeResultBtn">{record.vol_admin.name}</a>
							</Popover>
						</div> :
						<div>
							资源媒介:<Popover content={this.state.content} title="联系方式" trigger="click" onClick={this.getContent.bind(this, record.media_admin.id)}>
								<a className="executeResultBtn">{record.media_admin.name}</a>
							</Popover>
						</div>
				}
			},
			{
				title: '公司简称', dataIndex: 'company_name', key: 'company_name'
			},
			{
				title: '扣款比例', dataIndex: 'charge_ratio', width: 80,
				key: 'charge_ratio', render: (text, record) => {
					if (record.qc.status == 13 || record.qc.status == 21 || record.qc.status == 24) {
						return <span>{`${record.qc.charge_ratio} % `}</span>
					} else {
						return <span>-</span>
					}
				}
			},
			{
				title: '操作',
				key: 'operation',
				fixed: 'right',
				width: 60,
				render: (text, record) => {
					let content = ""
					if (record.qc_available_events.length == 0) {
						content = ""
					} else if (record.qc_available_events.indexOf("appeal") !== -1) {
						content = "申诉"
					} else if (record.qc_available_events.indexOf("media_modify") !== -1) {
						content = "修改"
					} else {
						content = "处理"
					}
					{
						return content == "" ?
							null :
							<Button type="primary"
								onClick={this.showReservationModal.bind(this, record, record.qc.status)}
							>{content}</Button>
					}
				}
			}
		];
		const rowSelection = {
			getCheckboxProps: record => ({
				disabled: record.qc.status !== '1',
				order_id: record.order_id
			}),
			onChange: (selectedRows) => {
				this.setState({
					selectedRowKeys: [...selectedRows]
				})
			},
			selectedRowKeys: this.state.selectedRowKeys
		};
		const { handleSubmit, PlatformList, MediaUsers, VolUsers, QcStatusList = {} } = this.props;
		const QcStatusListData = { qc_stages: QcStatusList.qc_stages, qc_states: QcStatusList.qc_states };
		//底部批量合格按钮
		const footerBatchQulify = role_id === "AccountInspector" || role_id === "Administrator"
			|| role_id === "AccountInspectorManager" ? {
				rowSelection: rowSelection,
				rowKey: 'order_id',
				footer: () => {
					return <div>
						<WBYTableFooter
							plainOptions={plainOptions}
							selectedRowKeys={this.state.selectedRowKeys}
							onChange={this.onCheckAllChange}
							title={'全选'}
							pagination={false}
						>
							<Tooltip placement="bottomLeft"
								title="该操作只针对质检状态为未检的订单生效" arrowPointAtCenter>
								<Icon type="question-circle" />
							</Tooltip>
							<Button type="default" className="batchTips"
								onClick={() => this.showModals("batch")}>批量质检合格</Button>
						</WBYTableFooter>
					</div>
				}
			} : {}
		let Children = modalChildrenConfig[this.state.status]
		return (
			<div>
				<Spin spinning={this.state.loading}>
					<StatisticsForm handleSubmit={handleSubmit} statistics={reservationList.statistics} />
					<Form layout="inline">
						<FilterForm
							PlatformList={PlatformList.data}
							MediaUsers={MediaUsers.data}
							VolUsers={VolUsers.data}
							QcStatusList={QcStatusListData}
							form={this.props.form}
						/>
					</Form>
					<div className="reservationTable">
						<Scolltable scrollClassName='.ant-table-body' width="1700">
							<Table columns={columns} dataSource={reservationList.item}
								scroll={{ x: 1700 }} rowKey='order_id'
								pagination={{
									current: parseInt(reservationList.pagination.page),
									pageSize: 20,
									total: parseInt(reservationList.pagination.total),
									onChange: this.changePage.bind(this)
								}}
								className="reservationTable"
								{...footerBatchQulify}
							/>
						</Scolltable>
					</div>
				</Spin>
				<ReservationReadOnlyModal
					visible={this.state.modalType === "ReservationReadOnlyModal"}
					records={this.state.records}
					type={this.state.type}
					readOnlyContent={this.state.readOnlyContent}
					onCancel={this.handleCancel.bind(this)}
				/>
				<ReservationModal
					visible={this.state.modalType === "ReservationModal"}
					onCancel={this.handleCancel.bind(this)}
					title={this.state.title}
				>
					<Children
						record={this.state.reservationModaRecord}
						closeModal={this.closeModal}
						showReservationModal={this.showReservationModal.bind(this)}
						closeModalUpdate={this.closeModalUpdate}
						showRejectComplaint={() => this.showModals("reject")}
						showPauseModal={() => this.showModals("pause")}
						formItemLayout={formItemLayout}
					/>
				</ReservationModal>
				{/* 驳回投诉组件挂载 */}
				<RejectComplaint
					record={this.state.reservationModaRecord}
					visible={this.state.rejectVisible}
					handleCancel={() => this.handleCancels("reject")}
					closeModalUpdate={() => this.closeModalUpdates("reject")}
					formItemLayout={formItemLayout}
				/>
				{/* 质检主管暂停质检 */}
				<ManagerInspectionPause
					record={this.state.reservationModaRecord}
					visible={this.state.pauseVisible}
					handleCancel={() => this.handleCancels("pause")}
					closeModalUpdate={() => this.closeModalUpdates("pause")}
					formItemLayout={formItemLayout}
				/>
				{/* 批量质检合格 */}
				<BatchInspectionQualify
					orderIds={this.state.selectedRowKeys}
					visible={this.state.batchQualifyVisible}
					handleCancel={() => this.handleCancels("batch")}
					closeModalUpdate={() => this.closeModalUpdates("batch")}
					formItemLayout={formItemLayout}
				/>
			</div >
		)
	}
}

Reservation.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = (state) => {
	return {
		QcStatusList: state.reservationReducers.QcStatusList || {},
		reservationList: state.reservationReducers.reservationList || {},
		PlatformList: state.reservationReducers.PlatformList || {},//reducer数据
		MediaUsers: state.reservationReducers.MediaUsers || {},
		VolUsers: state.reservationReducers.VolUsers || {},
		executedata: state.reservationReducers.readyonlyaction.getexecutedata || {},
		role_id: state.reservationReducers.role_id || {},
		showThirdChargePay: state.authorizationsReducers.authVisibleList['reservationOrderQc.thirdChargePay']
	}
}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...reservationAction,
		...readyonlyaction,
	}, dispatch)
})

export default connect(
	mapStateToProps,//redux和react连接起来
	mapDispatchToProps
)(Form.create()(Reservation))

