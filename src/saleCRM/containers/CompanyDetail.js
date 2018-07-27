import React, { Component } from "react"
import {
	Row,
	Col,
	Tabs,
	Divider,
	Button,
	Menu,
	Dropdown,
	Icon,
	Spin
} from 'antd'
import CustomBreadcrumb from "../base/CustomBreadcrumb"
import { company_detail_config } from '../constants/config'
import { getUrlParam } from '../../util'
import './CompanyDetail.less'

const TabPane = Tabs.TabPane
const { mainTab } = company_detail_config

const tabHeadStyle = { background: '#f1f1f1', borderRadius: '4px 4px 0 0' }


export default class CompanyDetail extends Component {
	state = {
		loading: true
	}

	componentWillMount() {
		const { cid } = getUrlParam()
		if (!cid) {
			// 不传参数处理
			this.props.history.push('/error')
		}
		// 获取公司基本信息
		setTimeout(() => {
			this.setState({
				loading: false
			})
		}, 2000);

	}

	render() {
		const { loading } = this.state
		const isShowStage = true
		const bread = [
			{ title: '公司列表', link: '/sale/company' },
			{ title: '公司详情' }
		]
		const menu = (
			<Menu>
				<Menu.Item><a href="">创建视频任务</a></Menu.Item>
				<Menu.Item><a href="">长期微播圈</a></Menu.Item>
				<Menu.Item><a href="">智能微播圈</a></Menu.Item>
			</Menu>
		);
		return <Spin tip="Loading..." spinning={loading}>
			<div className='companydetail'>
				<header className='bread-container'>
					<div>
						<CustomBreadcrumb bread={bread} />
					</div>
					<div className='btn-list'>
						<Button type='primary' target="_blank" href="http://example.com" size='small'>老B端详情入口</Button>
						<Button type='primary' target="_blank" href="http://example.com" size='small'>老B端修改公司入口</Button>
					</div>
				</header>
				<section className='info-container'>
					<div className=''>
						公司简称：蒙牛乳业 <Divider type="vertical" />
						公司状态：已成交且有商机 <Divider type="vertical" />
						销售经理：销售员A <Divider type="vertical" />
						最后跟进时间：2018-05-24
					</div>
					<div className='btn-list'>
						<Button type='primary' target="_blank" href="http://example.com" size='small'>添加商机</Button>
						<Button type='primary' target="_blank" href="http://example.com" size='small'>创建预约需求</Button>
						<Dropdown overlay={menu} trigger={['click']}>
							<a className="ant-dropdown-link usn">
								更多操作 <Icon type="down" />
							</a>
						</Dropdown>
					</div>
				</section>
				<section>
					<Row gutter={8} style={{ marginTop: 6 }}>
						<Col span={isShowStage ? 16 : 24}>
							<Tabs defaultActiveKey={mainTab.list[0]} tabBarStyle={tabHeadStyle} animated={{
								inkBar: true,
								tabPane: false
							}}>
								{
									mainTab.list.map(item => {
										const tab = mainTab.map[item],
											content = tab.content &&
												<tab.content />
										return <TabPane tab={tab.title} key={tab.key}>{content}</TabPane>
									})
								}
							</Tabs>
						</Col>
						<Col span={isShowStage ? 8 : 0}>
							<Tabs defaultActiveKey="1" tabBarStyle={tabHeadStyle}>
								<TabPane tab="跟进记录" key="1">
									---------
								</TabPane>
							</Tabs>
						</Col>
					</Row>
				</section>
			</div>
		</Spin>
	}
}
