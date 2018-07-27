import React, { Component } from 'react'
import { Col, Input, Icon, Modal } from 'antd';
const TextArea = Input.TextArea

class BatchInput extends Component {
	state = {
		batchText: '',
		showBatchModal: false
	}

	// 处理批量输入
	handleBatchId = () => {
		let { changeInputID } = this.props;
		let { batchText } = this.state
		const reg = /\b(\d)+\b/g
		let ary = batchText.match(reg);
		if (ary) changeInputID(ary.toString())
		this.setState({ batchText: '', showBatchModal: false });
	}

	render() {
		let { changeInputID, inputID } = this.props;
		const suffix = inputID ? <Icon type="close-circle" style={{ opacity: '.5' }}
			onClick={() => { changeInputID('') }} /> : null;
		return (
			<div>
				<Col>
					<Input style={{ width: '220px' }}
						placeholder='申请单ID'
						suffix={suffix}
						value={inputID}
						onChange={e => { changeInputID(e.target.value) }}
						addonAfter={<a onClick={() => { this.setState({ showBatchModal: true }) }}>批量</a>}
					/>
				</Col>
				<Modal
					title="批量输入查询ID"
					visible={this.state.showBatchModal}
					onOk={this.handleBatchId}
					onCancel={() => {
						this.setState({ showBatchModal: false })
					}}
					bodyStyle={{ padding: '16px' }}
				>
					<p>每一行输入一个ID</p>
					<TextArea
						value={this.state.batchText}
						placeholder={`100021\n100022`}
						autosize={{ minRows: 4, maxRows: 6 }}
						onInput={(e) => {
							this.setState({ batchText: e.target.value })
						}}
					/>
				</Modal>
			</div >
		)
	}
}
export default BatchInput
