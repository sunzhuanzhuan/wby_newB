import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Input, Form, Modal } from 'antd';
import { resetPwd, deleteWechat } from '../actions/adminUser'
const FormItem = Form.Item;
class AddAdminUser extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
		}

	}
	handleOk = () => {
		const that = this
		this.props.form.validateFields((err, values) => {
			if (!err) {
				//接口修改后在修改
				delete values.wechat
				delete values.username
				that.props.actions.resetPwd(values)
				this.changeVisible()
			}
		});

	}
	REPassword = (rule, value, callback) => {
		//新增value判断，修改loadingBug
		if (value) {
			var re = this.props.form.getFieldValue('newpwd');
			var relpassword = this.props.form.getFieldValue('renewpwd');
			if (re === relpassword) {
				callback();
			} else {
				callback("两次密码输入不符请重新输入");
			}
		} else {
			callback();
		}

	}
	cleanWechat = () => {
		const user_id = this.props.adminUserOne.user_id
		this.props.actions.deleteWechat({ user_id: user_id })
	}
	changeVisible = () => {
		const { visible } = this.state
		this.setState({ visible: !visible })
		this.props.form.resetFields()
	}
	//密码验证长度
	passwordVali = (rule, value, callback) => {
		//新增value判断，修改loadingBug
		if (value) {
			if (value.length == 0) {
				callback();
			} else if (value.length < 6 || value.length > 32) {
				callback('字符长度6~32');
			} else {
				callback();
			}
		} else {
			callback();
		}
	}
	render() {
		const { form, adminUserOne } = this.props;

		const { getFieldDecorator } = form;

		return (
			<span>

				<a onClick={this.changeVisible}>修改密码</a>
				<Modal
					title='修改密码'
					visible={this.state.visible}
					onCancel={this.changeVisible}
					onOk={this.handleOk}
					maskClosable={false}
				>
					<FormItem label="用户ID" style={{ display: 'none' }}>
						{getFieldDecorator('user_id', {
							initialValue: adminUserOne && adminUserOne.user_id,
						})(
							<Input onChange={e => this.handleValueChange('userId', e.target.value)} />
						)}
					</FormItem>
					<Form layout='horizontal'>
						<FormItem label="用户名">
							{getFieldDecorator('username', {
								initialValue: adminUserOne && adminUserOne.username,
								rules: [{ required: true, message: '请输入用户名' }],
							})(
								<Input disabled={true} />
							)}
						</FormItem>
						{adminUserOne && adminUserOne.wechat ? <FormItem label="微信授权">
							{getFieldDecorator('wechat', {
								initialValue: adminUserOne && adminUserOne.wechat,
							})(
								<Input disabled={true} addonAfter={<a onClick={this.cleanWechat}>删除</a>} />
							)}
						</FormItem> : null}
						<FormItem label="新密码">
							{getFieldDecorator('newpwd', {
								rules: [{
									required: true,
									message: '请输入正确格式的密码(6-20位)',

								}, {
									validator: this.passwordVali,
								}],
							})(
								<Input type='password' placeholder="请输入新密码" />
							)}
						</FormItem>
						<FormItem label="确认密码">
							{getFieldDecorator('renewpwd', {
								rules: [{ required: true, message: '请输入确认密码' }, {
									validator: this.REPassword,
								}],
							})(
								<Input type='password' placeholder="请输入确认密码" />
							)}
						</FormItem>
					</Form>
				</Modal>
			</span>
		)
	}
}
const AddAdminUserFrom = Form.create()(AddAdminUser)
const mapStateToProps = () => ({
	// adminUserList: getVisibleAdminUser(state.adminUserList)
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		resetPwd, deleteWechat
	}, dispatch)
})
export default (connect(
	mapStateToProps,
	mapDispatchToProps
)(AddAdminUserFrom))
// export default (Form.create()(AddAdminUser))
