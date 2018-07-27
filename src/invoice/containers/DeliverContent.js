import React, { Component } from 'react'
import { Row, Col, Input, Select } from 'antd';


const Option = Select.Option

class DeliverContent extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { expressCompanyData = [] } = this.props;
		return (
			<div>
				<Row style={{ marginTop: '10px' }} type="flex" justify="start" >
					<Col span={7} style={{ textAlign: 'right' }} > 快递公司：</Col>
					<Col span={17}>
						<Select

							style={{ width: 200 }}
							placeholder="请选择快递公司"
							onChange={this.props.handleSelectExpressCompany}
						>
							{expressCompanyData.map(d =>
								<Option value={d.id} key={d.id}>{d.display}</Option>
							)}
						</Select>
					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }} type="flex" justify="start">
					<Col span={7} style={{ textAlign: 'right' }}>运单号：</Col>
					<Col span={17}>
						<Input onBlur={this.props.getWaybillNumber} style={{ width: '200px' }} placeholder="请输入运单号" />
					</Col>
				</Row>
			</div >
		);
	}
}

export default DeliverContent
