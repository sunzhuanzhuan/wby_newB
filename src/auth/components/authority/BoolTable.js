import React, { Component } from 'react'
import { Table } from 'antd';

class BoolTable extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	render() {
		const { data, columns } = this.props;

		return <Table
			rowKey={record => record.name}
			columns={columns}
			dataSource={data}
			pagination={false}
		/>

	}
}

export default BoolTable;
