import { Layout, Menu, Icon } from 'antd';
import React, { Component } from 'react';
// import 'antd/dist/antd.css';
const SubMenu = Menu.SubMenu;
const Header = Layout.Header;
const Slider = Layout.Sider;
const Content = Layout.Content;

class Sider extends Component {
	// submenu keys of first level
	constructor(props) {
		super(props);
		this.rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
		this.state = {
			openKeys: ['sub1'],
			height: document.documentElement.clientHeight + 'px'
		};
	}
	componentDidMount() {
		window.addEventListener('resize', this.onWindowResize.bind(this))
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize.bind(this))
	}
	onOpenChange(openKeys) {
		const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
		if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
			this.setState({ openKeys });
		} else {
			this.setState({
				openKeys: latestOpenKey ? [latestOpenKey] : [],
			});
		}
	}
	onWindowResize() {
		this.setState({
			height: document.documentElement.clientHeight + 'px'
		})
	}
	render() {
		let layStyle = {
			height: this.state.height
		}
		let headerStyle = {
			height: '55px',
			backgroundColor: '#007bff',
			color: '#fff',
			fontSize: '18px',
			padding: '0 10px',
			lineHeight: '55px'
		}
		let siderStyle = {
			width: '287px!important',
			backgroundColor: '#343a40'
		}
		let contentStyle = {
			backgroundColor: '#fff'
		}
		return (
			<Layout style={layStyle}>
				<Header style={headerStyle}>
					<span>NB</span>
				</Header>
				<Layout>
					<Slider style={siderStyle}>
						<Menu
							mode="inline"
							openKeys={this.state.openKeys}
							onOpenChange={this.onOpenChange.bind(this)}
							style={{ width: 200, backgroundColor: '#343a40', color: '#fff' }}
						>
							<SubMenu key="sub1" title={<span><Icon type="mail" /><span>订单工具</span></span>}>
								<Menu.Item key="1" style={{ backgroundColor: '#343a40', color: '#fff' }}>订单列表</Menu.Item>
								<Menu.Item key="2" style={{ backgroundColor: '#343a40', color: '#fff' }}>模板列表</Menu.Item>
								<Menu.Item key="3" style={{ backgroundColor: '#343a40', color: '#fff' }}>字段修改</Menu.Item>

							</SubMenu>
							<SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
								<Menu.Item key="5" style={{ backgroundColor: '#343a40', color: '#fff' }}>Option 5</Menu.Item>
								<Menu.Item key="6" style={{ backgroundColor: '#343a40', color: '#fff' }}>Option 6</Menu.Item>
							</SubMenu>
							<SubMenu style={{ backgroundColor: '#343a40', color: '#fff' }} key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
								<Menu.Item key="9" style={{ backgroundColor: '#343a40', color: '#fff' }}>Option 9</Menu.Item>
								<Menu.Item key="10" style={{ backgroundColor: '#343a40', color: '#fff' }}>Option 10</Menu.Item>
								<Menu.Item key="11" style={{ backgroundColor: '#343a40', color: '#fff' }}>Option 11</Menu.Item>
								<Menu.Item key="12" style={{ backgroundColor: '#343a40', color: '#fff' }}>Option 12</Menu.Item>
							</SubMenu>
						</Menu>
					</Slider>
					<Content style={contentStyle}>
						{/* <OrderList /> */}
					</Content>
				</Layout>
			</Layout>
		);
	}
}

export default Sider;
