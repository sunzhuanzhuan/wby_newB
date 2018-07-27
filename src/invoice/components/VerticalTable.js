import React from 'react'
import './VerticalTable.less';
import { Modal } from 'antd'
import { calcSum } from "../../util";

export default class VerticalTable extends React.Component {
	constructor() {
		super();
		this.state = {
			previewVisible: false,
			imgSrc: ``
		}
	}
	handleCancel = () => {
		this.setState({
			previewVisible: false
		})
	}
	handleVertical = (data, msgType, role, status) => {
		let { invoiceRelation } = this.props;
		switch (msgType) {
			case 'string':
				return data
			case 'invoiceType':
				return data === 1 ? '普票' : data === 2 ? '专票' : ''
			case 'invoiceCompany':
				return data === 1 ? '微易辉煌' : data === 2 ? '讯达网脉' : data === 4 ? '微播易' : data === 5 ? '布谷鸟' : ''
			case 'invoiceContent':
				return data === 1 ? '技术服务费' : data === 2 ? '信息服务费' : data === 3 ? '广告服务费' : data === 4 ? '广告费' : ''
			case 'statusString':
				return status === '0' ? <div>{data}<b className="highLight" >待回款</b></div> : status === '2' ? <div>{data}<b className="highLight" >已回款</b></div> : status === '1' ? <div>{data}<b className="highLight" >部分回款</b></div> : <div>{data}</div>
			case 'pic':
				return <div>
					{data ? data.map((it, i) => {
						return <div className='thum-img-box' key={i} onClick={() => {
							this.setState({
								previewVisible: true,
								imgSrc: it.url
							})
						}}>
							<img src={it.url} />
						</div>
					}) : null}
				</div>
			case 'list':
				return <ul>
					{data ? data.map((it, i) => {
						return <li key={i}><span className='invoice-message'>{it.title + '：'}</span>{it.content}</li>
					}) : null}
				</ul>
			case 'roleList':
				return data.status_display === '已开' ?
					<div className='status-display'>
						<p>{data.status_display}</p>
						<p> 发票号及对应金额：</p>
						{invoiceRelation ? invoiceRelation.map((item, index) => {
							return <p key={index}>&nbsp;&nbsp;&nbsp;&nbsp;{item.invoice_number}&nbsp;&nbsp;&nbsp;&nbsp;{item.invoice_amount}</p>
						}) : null}
					</div>
					: data.status_display === '已寄' ?
						<div className='status-display'>
							<p>{data.status_display}<span>（快递公司：{data.express_company}&nbsp;&nbsp;&nbsp;&nbsp;快递编号：{data.waybill_number}）</span></p>
							<p> 发票号及对应金额：</p>
							{invoiceRelation ? invoiceRelation.map((item, index) => {
								return <p key={index}>&nbsp;&nbsp;&nbsp;&nbsp;{item.invoice_number}&nbsp;&nbsp;&nbsp;&nbsp;{item.invoice_amount}</p>
							}) : null}
						</div>
						: data.status_display
			case 'redString':
				let arrWaitMoney = [data.amount, -data.payback_amount]
				return <div>
					<p>申请单金额:{data.amount}</p>
					<p>已开票金额:{data.real_amount}</p>
					{data.type == 1 || data.type == 5 ? <p><p>已回款金额:{data.payback_amount}</p>
						<p>待回款金额:{calcSum(arrWaitMoney).toFixed(2)}</p></p> : null}
				</div>
			default:
				break;
		}
	}
	render() {
		let { tableprops, verticalColumns, verticalData, role, status } = this.props;
		let { previewVisible, imgSrc } = this.state;
		/* return <div>
			<table className='vertical-table' style={tableprops}>
				<tbody>
					{columns.map((item, index) => {
						return <tr key={index}>
							<td className="odd">
								{item.title1 + "："}
							</td>
							<td className='even'>
								{item.msgType1 === 'string' ? item.content1 : item.msgType1 === 'pic' ? <div>
									{item.content1.map((it, i) => {
										return <div className='thum-img-box' key={i} onClick={() => {
											this.setState({
												previewVisible: true,
												imgSrc: it.url
											})
										}}>
											<img src={it.url} />
										</div>
									})}
								</div> :
									item.msgType1 === 'list' ? <ul>
										{item.content1.map((it, i) => {
											return <li key={i}><span className='invoice-message'>{it.title + '：'}</span>{it.content}</li>
										})}
									</ul> : ''}
							</td>
							<td className="odd">
								{item.title2 + "："}
							</td>
							<td className='even'>
								{item.msgType2 === 'string' ? item.content2 : item.msgType2 === 'redString' ? <div><span className='red-string'>{item.content2}</span>元</div> : item.msgType2 === 'pic' ? <div>
									{item.content2.map((it, i) => {
										return <div className='thum-img-box' key={i} onClick={() => {
											this.setState({
												previewVisible: true,
												imgSrc: it.url
											})
										}}>
											<img src={it.url} />
										</div>
									})}
								</div> :
									item.msgType2 === 'list' ? <ul>
										{item.content2.map((it, i) => {
											return <li key={i}><span className='invoice-message'>{it.title + '：'}</span>{it.content}</li>
										})}
									</ul> : ''}
							</td>
						</tr>
					})}
				</tbody>
			</table>
			<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
				<img style={{ width: '100%' }} src={imgSrc} />
			</Modal>
		</div> */
		return <div>
			<table className='vertical-table' style={tableprops}>
				<tbody>
					{verticalColumns.map((item, index) => {
						return <tr key={index}>
							<td className="odd">
								{item.title1 + "："}
							</td>
							<td className='even'>
								{verticalData.length > 0 ? this.handleVertical(verticalData[index].content1, item.msgtype1, role, status) : ''}
							</td>
							<td className="odd">
								{item.title2 + "："}
							</td>
							<td className='even'>
								{verticalData.length > 0 ? this.handleVertical(verticalData[index].content2, item.msgtype2, role, status) : ''}
							</td>
						</tr>
					})}
				</tbody>
			</table>
			<Modal key={this.state.newRandomKey} visible={previewVisible} footer={null} onCancel={this.handleCancel} width={800} wrapClassName='pic-modal'>
				<img src={imgSrc} className='invoice-modal-pic' />
			</Modal>
		</div>
	}
}
