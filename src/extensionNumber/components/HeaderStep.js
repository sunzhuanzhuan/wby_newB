import React, { Component } from "react";
import { Steps, /* Popover */ } from 'antd';
const Step = Steps.Step;

/* const customDot = (dot, { index }) => (
	<Popover content={<span>步骤 {index + 1}</span>}>
		{dot}
	</Popover>
); */


class HeaderStep extends Component {


	render() {
		let { step, style } = this.props
		return (
			<div style={style}>
				<Steps current={step} status='process'>
					<Step title="导入账号" description="导入账号、id或链接" />
					<Step title="选择账号" description="查看并选择账号" />
					<Step title="提交需求" description="填写并提交需求" />
				</Steps>
			</div>
		);
	}
}
export default HeaderStep;
