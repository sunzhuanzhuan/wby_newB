import React from "react";
import { Layout, Menu, Icon, message } from "antd";
import { Link, withRouter } from "react-router-dom";
import "./SiderMenu.less";
import "./SiderMenu.css";
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

class SiderDemo extends React.Component {
	state = {
		collapsed: true,
		defaultSelectedKeys: ["/login"],
		selectedKeys: []
	};
	onCollapse = collapsed => {
		this.setState({ collapsed });
	}
	componentWillMount() {
		let pathname = window.location.pathname;
		if (pathname) {
			this.setState({
				defaultSelectedKeys: [pathname],
				selectedKeys: [pathname]
			})
		}
	}
	componentWillReceiveProps(nextProps) {
		//修改了获取值的方式，routing不存在了
		if (nextProps.location.pathname !== this.props.location.pathname) {
			this.setState({
				selectedKeys: [nextProps.location.pathname]
			})
		}
	}

	render() {
		const { assignments, history } = this.props;
		if (assignments.length !== 0) {
			if (assignments[0].name === "noPermissions") {
				message.error("该用户没有任何权限", () => {
					history.replace("/login")
				})
			} else {
				this.permissions = assignments.filter(item => item.subs);
				if (assignments.filter(item => item.subs).length === 0) {
					this.subs = []
					message.error("该用户没有可用权限", () => {
						history.replace("/login")
					})
				}
			}
		}
		return (
			<Sider
				collapsedWidth="40px"
				width={this.state.collapsed ? "40px" : "200px"}
				collapsible
				collapsed={this.state.collapsed}
				onCollapse={this.onCollapse}
				className='fixed-slider'
			>
				<div className="logo" />
				<Menu
					style={{ width: this.state.collapsed ? 40 : 200 }}
					mode="inline"
					theme="dark"
					defaultSelectedKeys={this.state.defaultSelectedKeys}
					selectedKeys={this.state.selectedKeys}
				>
					{
						this.permissions ?
							this.permissions.map(item => {
								return <SubMenu
									key={item.name}
									title={
										<span>
											<Icon type={item.url} />
											<span>{item.name}</span>
										</span>
									}
								>
									{
										item.subs ?
											item.subs.map(it => {
												return <Menu.Item key={it.url}>
													<Link to={it.url}>{it.name}</Link>
												</Menu.Item>
											}) : ""
									}
								</SubMenu>
							}) : ""
					}
				</Menu>
			</Sider>
		);
	}
}

export default withRouter(SiderDemo);
