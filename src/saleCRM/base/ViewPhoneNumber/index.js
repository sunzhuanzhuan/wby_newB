import React, { Component } from "react"
import { Popover, Spin, Icon } from 'antd'

export default class ViewPhoneNumber extends Component {
	state = {
		loading: true,
		dataStr: '-'
	}

	handleView = uid => {
		console.log(uid);
		setTimeout(() => {
			this.setState({
				loading: false,
				dataStr: '188-0000-1111'
			})
		}, 1000);
	}

	render() {
		const { loading, dataStr } = this.state
		const { uid } = this.props;
		const content = loading ?
			<Spin indicator={
				<Icon type="loading" spin />} /> : dataStr;


		return <Popover placement="topLeft" title={'联系方式'} content={content}
			trigger="click" onVisibleChange={visible => visible && loading && this.handleView(uid)}>
			<a href="">查看手机号</a>
		</Popover>
	}
}
