import React, { Component } from "react"
import { Modal } from 'antd'
import './index.less'

export default class ImageList extends Component {
	state = {
		previewVisible: false,
		previewIndex: -1
	}

	handleCancel = () => {
		this.setState({
			previewVisible: false ,
			previewIndex: -1
		})
	}

	render() {
		const { list } = this.props;
		const { previewVisible, previewIndex } = this.state;
		return <div className='imglist-container'>
			<ul>
				{list.map((link, n) => <li key={n} style={this.props.itemStyle || {}} onClick={() => {
					this.setState({
						previewIndex: n ,
						previewVisible: true
					})
				}}>
					<img src={link} alt="" /></li>)}
			</ul>
			<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
				<h5>图片描述</h5>
				<img alt="" style={{ width: '100%' }} src={list[previewIndex]} />
			</Modal>
		</div>
	}
}
