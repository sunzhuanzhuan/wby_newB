import React, { Component } from "react";
import { Tabs } from "antd";
import CompleteApplyTable from "./CompleteApplyTable";

const TabPane = Tabs.TabPane;

class CompleteTabs extends Component {

	render() {
		let { isConsumption, isRecharge, tabList } = this.props;
		return (
			<Tabs
				className={this.props.type === 5 ? 'tabs-type5-extra' : null}
				defaultActiveKey={tabList[0]['name']} onChange={this.changeSelect} type="card"
				tabBarExtraContent={this.props.type === 5 ? <div className='tabs-extra-content'>
					<div>当前页面展示的订单结案时间：<span className='tabs-extra-left-span'>2018年5月22日 之前</span></div>
				</div> : isConsumption ? <span style={{ color: 'red' }}>消费现金账户的选择部分请选择按照“充值”开票</span> : null}
			>
				{tabList.map(({ title, name }, index) => (
					<TabPane tab={title} key={name}>
						<CompleteApplyTable
							position="bottom"
							typeDetail={tabList[index]}
							isRecharge={isRecharge}
							isConsumption={isConsumption}
							invoice_id={this.props.id}
							totalBox={this.props.totalBox}
							checkDisable={this.props.checkDisable}
							type={this.props.type}
						/>
					</TabPane>
				))}
			</Tabs>
		);
	}
}
export default CompleteTabs;
