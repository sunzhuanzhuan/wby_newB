import React, { Component } from 'react';
import { Table, Input, Popconfirm, Divider, message } from 'antd';
import { platformTypesMap } from '../constants/config';
message.config({
	top: 20
})
const EditableCell = ({ editable, value, onChange }) => (
	<div>
		{editable
			? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
			: value
		}
	</div>
);

class EditableTable extends Component {
	constructor(props) {
		super(props);
		let titleM = props.typeMap || 'ID/链接'
		this.columns = [
			{
				title: '用户名',
				dataIndex: 'n',
				width: '25%',
				render: (text, record) => this.renderColumns(text, record, 'n'),
			}, {
				title: titleM,
				dataIndex: 'm',
				width: '50%',
				render: (text, record) => this.renderColumns(text, record, 'm'),
			}, {
				title: '操作',
				dataIndex: 'operation',
				render: (text, record) => {
					const { editable } = record;
					return (
						<div className="editable-row-operations">
							{editable ?
								<span>
									<a onClick={() => this.save(record.key)}>保存</a>
									<Divider type="vertical" />
									<Popconfirm title="确定取消吗?" onConfirm={() => this.cancel(record.key)}>
										<a>取消</a>
									</Popconfirm>
								</span>
								: <a onClick={() => this.edit(record.key)}>编辑</a>}
							<Divider type="vertical" />
							<Popconfirm title="确定删除吗??" onConfirm={() => this.onDelete(record.key)}>
								<a href="javascript:;">删除</a>
							</Popconfirm>
						</div>
					);
				},
			}];

		this.cacheData = props.data.map(item => ({ ...item }));
	}
	renderColumns(text, record, column) {
		return (
			<EditableCell
				editable={record.editable}
				value={text}
				onChange={value => this.handleChange(value, record.key, column)}
			/>
		);
	}
	handleChange(value, key, column) {
		const newData = [...this.props.data];
		const target = newData.filter(item => key === item.key)[0];
		if (target) {
			target[column] = value;
			this.props.changeData(newData);
		}
	}
	edit(key) {
		const newData = [...this.props.data];
		const target = newData.filter(item => key === item.key)[0];
		if (target) {
			target.editable = true;
			this.props.changeData(newData);
		}
	}
	async save(key) {
		let { platformType, setSuccessAry } = this.props;
		let k1reg = platformTypesMap[platformType].reg1
		let k2reg = platformTypesMap[platformType].reg2
		const newData = [...this.props.data];
		const target = newData.filter(item => key === item.key)[0];
		if (target) {
			target.v = (k1reg.test(target.n) && k2reg.test(target.m))
			if (target.v) {
				this.onDelete(key)
				setSuccessAry(target)
				return
			}
			this.error()
			/* delete target.editable;
			this.props.changeData(newData);
			this.cacheData = newData.map(item => ({ ...item })); */
		}
	}
	onDelete = (key) => {
		const newData = [...this.props.data];
		this.props.changeData(newData.filter(item => item.key !== key));
	}
	cancel(key) {
		const newData = [...this.props.data];
		const target = newData.filter(item => key === item.key)[0];
		if (target) {
			Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
			delete target.editable;
			this.props.changeData(newData);
		}
	}
	error = () => {
		message.error('格式错误,请重新修改!!', 1);
	};
	render() {
		return <Table scroll={{ y: 300 }}
			pagination={false} bordered
			size='small'
			dataSource={this.props.data} columns={this.columns} />;
	}
}

export default EditableTable
