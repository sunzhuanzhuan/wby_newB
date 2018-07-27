import React from 'react';
import { calcSum } from "../../util";

export const typeConfigMap = {
	'reservation': {
		title: "预约订单", name: 'reservation', line: '3', key: 'order_id', columns: [
			{
				title: '订单ID',
				dataIndex: 'order_id',
				align: 'center',
				render: (id, { order_link, execution_evidence }) => {
					return (<div>
						订单ID <a target="_blank" href={order_link}>{id}</a>
						{execution_evidence && execution_evidence.length > 0 ?
							execution_evidence.map(({ execution_evidence_code, execution_evidence_link }, index) => (
								<p className='table-small-p' key={index}>PO <a target="_blank" href={execution_evidence_link}>{execution_evidence_code}</a></p>
							))
							: null
						}
					</div>);
				}
			}, {
				title: '需求名称',
				dataIndex: 'requirement_name',
				align: 'center',
				render: (name, row) => {
					return <a target="_blank" href={row['requirement_link']}>{name}</a>;
				}
			}, {
				title: '所属项目/品牌',
				dataIndex: 'project_name',
				align: 'center',
				render: (text, row) => {
					return <span>{row['project_name'] || '-'}/{row['brand_name'] || '-'}</span>
				}
			}, {
				title: '应约价',
				dataIndex: 'accept_reservation_price',
				align: 'center',
				render: (num) => {
					return <span>{num ? num.toFixed(2) : '-'}</span>
				}
			}, {
				title: '执行价',
				dataIndex: 'execution_price',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : '-'
			}, {
				title: '质检金额',
				dataIndex: 'qc_amount',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : '-'
			}, {
				title: '结算金额',
				dataIndex: 'settle_amount',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : '-'
			}, {
				title: '赔偿金额',
				dataIndex: 'reparation_amount',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : '-'
			}, {
				title: '消费明细',
				dataIndex: 'spend_detail',
				align: 'center',
				render: ({ cash, gift, credit, product_line }, { reparation_amount }) => {
					let sumArr, sum
					if (!isNaN(gift) && !isNaN(reparation_amount)) {
						sumArr = [Math.abs(gift), reparation_amount]
						sum = calcSum(sumArr)
					}
					return (<div style={{ textAlign: 'left' }} className='table-item-container'>
						<span>现金账户：{cash ? cash.toFixed(2).replace('-', '') : '-'}</span><br />
						{product_line == 3 ?
							<span>赠送/赔偿账户：{gift || reparation_amount ? sum.toFixed(2).replace('-', '') : '-'}</span> :
							<span>赠送/赔偿账户：{gift ? gift.toFixed(2).replace('-', '') : '-'}</span>
						}<br />
						<span>信用账户：{credit ? credit.toFixed(2).replace('-', '') : '-'}</span>
					</div>)
				}
			}, {
				title: '可开票金额',
				dataIndex: 'remain_invoice_amount',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : 0
			}
		]
	},
	'activity': {
		title: "派单活动", name: 'activity', line: '2', key: 'campaign_id', columns: [
			{
				title: '活动ID',
				dataIndex: 'campaign_id',
				align: 'center',
				render: (id, { campaign_link, execution_evidence }) => {
					return (<div>
						活动ID <a target="_blank" href={campaign_link}>{id}</a>
						{execution_evidence && execution_evidence.length > 0 ?
							execution_evidence.map(({ execution_evidence_code, execution_evidence_link }, index) => (
								<p className='table-small-p' key={index}>PO <a target="_blank" href={execution_evidence_link}>{execution_evidence_code}</a></p>
							))
							: null
						}
					</div>);
				}
			}, {
				title: '活动名称',
				dataIndex: 'campaign_name',
				align: 'center',
				render: (name, row) => {
					return <a target="_blank" href={row['campaign_link']}>{name}</a>;
				}
			}, {
				title: '所属项目/品牌',
				dataIndex: 'project_name',
				align: 'center',
				render: (text, row) => {
					return <span>{row['project_name'] || '-'}/{row['brand_name'] || '-'}</span>
				}
			}, {
				title: '质检金额',
				dataIndex: 'qc_amount',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : '-'
			}, {
				title: '结算金额',
				dataIndex: 'settle_amount',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : '-'
			}, {
				title: '消费明细',
				dataIndex: 'spend_detail',
				align: 'center',
				render: ({ cash, gift, credit }) => {
					return (<div style={{ textAlign: 'left' }} className='table-item-container'>
						<span>现金账户：{cash ? cash.toFixed(2).replace('-', '') : '-'}</span><br />
						<span>赠送/赔偿账户：{gift ? gift.toFixed(2).replace('-', '') : '-'}</span><br />
						<span>信用账户：{credit ? credit.toFixed(2).replace('-', '') : '-'}</span>
					</div>)
				}
			}, {
				title: '可开票金额',
				dataIndex: 'remain_invoice_amount',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : 0
			}
		]
	},
	'business': {
		title: "公司拓展业务", name: 'business', line: '7', key: 'business_id', columns: [
			{
				title: '活动ID',
				dataIndex: 'business_id',
				align: 'center',
				render: (id, { business_link, execution_evidence }) => {
					return (<div>
						活动ID <a target="_blank" href={business_link}>{id}</a>
						{execution_evidence && execution_evidence.length > 0 ?
							execution_evidence.map(({ execution_evidence_code, execution_evidence_link }, index) => (
								<p className='table-small-p' key={index}>PO <a href={execution_evidence_link} target='_blank'>{execution_evidence_code}</a></p>
							))
							: null
						}
					</div>);
				}
			}, {
				title: '活动名称',
				dataIndex: 'business_name',
				align: 'center',
				render: (name, row) => {
					return <a href={row['business_link']} target='_blank'> {name}</a >;
				}
			}, {
				title: '所属项目/品牌',
				dataIndex: 'project_name',
				align: 'center',
				render: (text, row) => {
					return <span>{row['project_name'] || '-'}/{row['brand_name'] || '-'}</span>
				}
			}, {
				title: '活动费用',
				dataIndex: 'business_cost',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : '-'
			}, {
				title: '消费明细',
				dataIndex: 'spend_detail',
				align: 'center',
				render: ({ cash, gift, credit }) => {
					return (<div style={{ textAlign: 'left' }} className='table-item-container'>
						<span>现金账户：{cash ? cash.toFixed(2).replace('-', '') : '-'}</span><br />
						<span>赠送/赔偿账户：{gift ? gift.toFixed(2).replace('-', '') : '-'}</span><br />
						<span>信用账户：{credit ? credit.toFixed(2).replace('-', '') : '-'}</span>
					</div>)
				}
			}, {
				title: '可开票金额',
				dataIndex: 'remain_invoice_amount',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : 0
			}
		]
	},
	'weibo': {
		title: "微播圈订单", name: 'weibo', line: '5', key: 'campaign_id', columns: [
			{
				title: '活动ID',
				dataIndex: 'campaign_id',
				align: 'center',
				render: (id, row) => {
					return <a target="_blank" href={row['campaign_link']}>{id}</a>
				}
			},
			{
				title: '微播圈名称',
				dataIndex: 'campaign_name',
				align: 'center',
				render: (name, row) => {
					return <a target="_blank" href={row['campaign_link']}>{name}</a>;
				}
			},
			{
				title: '结算金额',
				dataIndex: 'settle_amount',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : '-'
			}, {
				title: '消费明细',
				dataIndex: 'spend_detail',
				align: 'center',
				render: ({ cash, gift, credit }) => {
					return (<div style={{ textAlign: 'left' }} className='table-item-container'>
						<span>现金账户：{cash ? cash.toFixed(2).replace('-', '') : '-'}</span><br />
						<span>赠送/赔偿账户：{gift ? gift.toFixed(2).replace('-', '') : '-'}</span><br />
						<span>信用账户：{credit ? credit.toFixed(2).replace('-', '') : '-'}</span>
					</div>)
				}
			},
			{
				title: '总可开票金额',
				dataIndex: 'total_invoice_amount',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : 0
			},
			{
				title: '剩余可开票金额',
				dataIndex: 'remain_invoice_amount',
				align: 'center',
				render: (num) => num ? num.toFixed(2) : 0
			}
		]
	},
	'recharge': {
		title: "充值记录", name: 'recharge', line: '1', key: 'recharge_id', columns: [
			{
				title: '充值金额',
				dataIndex: 'recharge_amount',
				align: 'center',
				render: (num) => num ? num : 0
			}, {
				title: '充值时间',
				dataIndex: 'created_at',
				align: 'center',
				render: (time) => (time)
			}, {
				title: '充值方式',
				dataIndex: 'payment_type_display',
				align: 'center',
				render: (text) => (text)
			}, {
				title: '收款账户',
				dataIndex: 'account_payee',
				align: 'center',
				render: (text) => (text)
			}, {
				title: '退款金额',
				dataIndex: 'refund_amount',
				align: 'center',
				render: (num) => num ? num : '-'
			}, {
				title: '可开票金额',
				dataIndex: 'remain_invoice_amount',
				align: 'center',
				render: (num) => num ? num : 0
			}
		]
	}
}
// 开票依据 //order_associate_type 1/2 是否PO
export const invioceBytype = {
	'1': ['reservation', 'activity', 'business', 'weibo'], //按消费开票 consumption
	'2': ['recharge'], //按充值开票  recharge
	'3': [], //按合同开票
	'4': [], //按邮件审批开票
	'5': ['reservation', 'activity', 'business', 'weibo']//历史订单
}
function combineTypes(obj) {
	let ary = []
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			ary = ary.concat(obj[key])
		}
	}
	return ary
}
export const allTabType = combineTypes(invioceBytype)
export const typeMap = {
	'recharge': '1',
	'activity': '2',
	'reservation': '3',
	'weibo': '5',
	'business': '7'
}
// 处理综合展示key
export const handleKeys = type => data => {
	switch (type) {
		case 'reservation':
			return {
				order_id: data['order_id'],
				order_type: typeMap['reservation'],
				invoice_amount: data['remain_invoice_amount'],
				amount: data['total_invoice_amount']
			}
		case 'activity':
			return {
				order_id: data['campaign_id'],
				order_type: typeMap['activity'],
				invoice_amount: data['remain_invoice_amount'],
				amount: data['total_invoice_amount']
			}
		case 'business':
			return {
				order_id: data['business_id'],
				order_type: typeMap['business'],
				invoice_amount: data['remain_invoice_amount'],
				amount: data['total_invoice_amount']
			}
		case 'weibo':
			return {
				order_id: data['campaign_id'],
				order_type: typeMap['weibo'],
				invoice_amount: data['remain_invoice_amount'],
				amount: data['total_invoice_amount']
			}
		case 'recharge':
			return {
				order_id: data['recharge_id'],
				order_type: typeMap['recharge'],
				invoice_amount: data['remain_invoice_amount'],
				amount: data['total_invoice_amount']
			}
		default:
			return {}
	}
}
export default { typeMap, invioceBytype, allTabType, typeConfigMap, handleKeys }
