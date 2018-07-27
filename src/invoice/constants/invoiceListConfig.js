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
						订单ID <a href={order_link}>{id}</a>
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
						活动ID <a href={campaign_link}>{id}</a>
						{execution_evidence && execution_evidence.length > 0 ?
							execution_evidence.map(({ execution_evidence_code, execution_evidence_link }, index) => (
								<p className='table-small-p' key={index}>PO <a href={execution_evidence_link}>{execution_evidence_code}</a></p>
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
					return <a href={row['campaign_link']}>{name}</a>;
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
						活动ID <a href={business_link}>{id}</a>
						{execution_evidence && execution_evidence.length > 0 ?
							execution_evidence.map(({ execution_evidence_code, execution_evidence_link }, index) => (
								<p className='table-small-p' key={index}>PO <a href={execution_evidence_link}>{execution_evidence_code}</a></p>
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
					return <a href={row['business_link']}>{name}</a>;
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
		title: "微播圈订单", name: 'weibo', line: '5', key: 'order_id', columns: [
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
				title: '本次开票金额',
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
				render: (num) => num ? parseFloat(num).toFixed(2) : 0
			}
		]
	}
}
export const companyColumns = [
	{
		title: '公司ID',
		dataIndex: 'company_id',
		key: 'company_id',
		width: 140,
		align: 'center'
	}, {
		title: '公司简称',
		dataIndex: 'company_name',
		key: 'company_name',
		width: 120,
		align: 'center'
	}, {
		title: '开票金额（元）',
		dataIndex: 'amount',
		key: 'amount',
		width: 120,
		align: 'center'
	}, {
		title: '开票依据',
		dataIndex: 'type_display',
		key: 'type_display',
		width: 120,
		align: 'center'
	},
	{
		title: '开票维度',
		dataIndex: 'execution_evidence_id',
		key: 'execution_evidence_id',
		width: 160,
		align: 'center',
		render: (text, { type_display, invoiceVeidoo, invoiceLink }) => {
			return (type_display === '消费' ? <a href={invoiceLink}>{invoiceVeidoo}</a> : null);
			// return (<div>
			// 	{execution_evidence_code ? <p className='table-small-p'>PO <a href={execution_evidence_link}>{execution_evidence_code}</a></p> : null}
			// </div>);
		}
	},
	{
		title: '合同编号',
		dataIndex: 'contract_num',
		key: 'contract_num',
		width: 160,
		align: 'center',
		render: (text, { contract_num }) => {
			return contract_num ? contract_num : "";
		}
	},
	{
		title: '合同扫描件',
		dataIndex: 'contract_scanning_copy',
		key: 'contract_scanning_copy',
		width: 300,
		align: 'center',
		render: (text) => {
			return <div>
				{text.map((item, index) => {
					return <div className='thum-img-box' onClick={() => {
						this.setState({
							previewVisible: true,
							imgSrc: item.url
						})
					}} key={index}>
						<img src={item.url} />
					</div>
				})}
			</div>
		}
	},
	{
		title: '邮件审批截图',
		dataIndex: 'email_approval_screenshots',
		key: 'email_approval_screenshots',
		width: 120,
		align: 'center'
	}, {
		title: '销售经理',
		dataIndex: 'company_owner_admin_name',
		key: 'company_owner_admin_name',
		width: 120,
		align: 'center'
	}
];
export const typeMap = {
	'recharge': '1',
	'activity': '2',
	'reservation': '3',
	'weibo': '5',
	'business': '7'
};
//处理company data为数组，并加入key值
export const handleCompany = (data) => {
	let ary = [];
	data['key'] = `company_${data.company_id}`;
	ary.push(data);
	return ary;
}
//区分消费开单和充值开单
export const AccorindTo = {
	'1': ['reservation', 'activity', 'business', 'weibo'],
	'2': ['recharge']
}
//处理typemap为数组，并加入key值
export const handleTypeMap = (typeNum) => {
	let ary = [];
	if (typeNum) {
		AccorindTo[typeNum].forEach(item => {
			ary.push({ title: typeConfigMap[item].title, key: item, columns: typeConfigMap[item].columns })
		})
	}
	return ary;
}
//处理data为数组，并加入key值
export const handleKeyColumns = data => {
	let newData = {};
	for (let key in data) {
		newData[key] = data[key].map((item, index) => {
			return { ...item, 'key': `${key}_${index}` }
		})
	}
	return newData;
}
export function debounce(fn, interval = 300) {
	let timeout = null;
	return function () {
		window.clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn.apply(this, arguments);
		}, interval);
	};
}
export default { typeConfigMap, companyColumns, handleCompany, typeMap, handleKeyColumns, debounce, handleTypeMap }
