import React, { Component } from 'react'
import { Modal, Input } from 'antd';

const TextArea = Input.TextArea;

class BatchSearchModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: ''
		}
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			value: nextProps.batchValue.replace(/,+/g, '\n')
		})
	}

	handleValue(value) {
		this.setState({
			value: value
		})
	}

	render() {
		return (
			<Modal
				visible={this.props.visible}
				title={this.props.title}
				onCancel={this.props.onCancel}
				onOk={() => this.props.onOk(this.props.batchSearchKey, this.state.value)}
			>
				<p>请输入PO单号， 一行为一项：</p>

				<div>
					<TextArea
						rows={7}
						value={this.state.value}
						onChange={(e) => this.handleValue(e.target.value)}
					/>
				</div>

			</Modal>
		)
	}
}

export default BatchSearchModal