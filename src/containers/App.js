import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Layout, Button } from 'antd';
import SiderMenu from '../components/SiderMenu'
import { getUserLoginInfo } from '../login/actions'
import { resetSiderAuth, getAuthorizations } from '../actions'
import BrowserJudge from '../util/showBrowserJudge'
const { Header, Content } = Layout;
const Cookies = require('js-cookie');
window.Cookies = Cookies;

class App extends Component {
	state = {
		collapsed: true
	};
	onCollapse = (collapsed) => {
		this.setState({ collapsed });
	}
	logout = () => {
		this.props.history.push('/login');
		this.props.actions.resetSiderAuth()
	}
	async componentWillMount() {
		//重新获取页面尺寸，以防继承前一浏览页面的滚动条
		window.onresize = null
		await this.props.actions.getUserLoginInfo();
		this.props.actions.getAuthorizations();
	}
	componentWillUnmount() {
		Cookies.remove('token');
	}
	render() {
		const height = document.documentElement.clientHeight + 'px';
		let layStyle = {
			height: height,
			minWidth: 1200
		}
		let headerStyle = {
			height: '55px',
			backgroundColor: '#000c17',
			color: '#fff',
			fontSize: '18px',
			padding: '0 10px',
			lineHeight: '55px',
			position: 'relative'
		}
		let contentStyle = {
			backgroundColor: '#fff',
			margin: '0 20px',
			padding: '20px'
		}
		let btnStyle = {
			position: 'absolute',
			right: '10px',
			top: '10px'
		}

		const { loginReducer: { userLoginInfo }, siderMenuAuth = [] } = this.props;
		return userLoginInfo['X-Access-Token'] ? <Layout style={layStyle}>
			<BrowserJudge />
			<Header style={headerStyle}>
				<span>NB</span>
				<a style={{ ...btnStyle, top: '0px', right: '100px' }} href="http://toufang.weiboyi.com:8080/">老平台</a>
				<Button type="primary" onClick={this.logout.bind(this)} style={btnStyle}>退出</Button>
			</Header>
			<Layout>
				<SiderMenu assignments={siderMenuAuth} routing={this.props.routing}></SiderMenu>
				<Content style={contentStyle} id='app-content-children-id'>
					{this.props.children}
				</Content>
			</Layout>
		</Layout> : null
	}
}

App.propTypes = {
	children: PropTypes.element
}

const mapStateToProps = (state) => ({
	loginReducer: state.loginReducer,
	siderMenuAuth: state.authorizationsReducers.siderMenuAuth,
	routing: state.routing.locationBeforeTransitions
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		getUserLoginInfo, resetSiderAuth, getAuthorizations
	}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
