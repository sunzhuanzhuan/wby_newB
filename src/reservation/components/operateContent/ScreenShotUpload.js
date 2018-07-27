import React, { Component } from 'react'
import { Form, Upload, Icon } from 'antd'
const FormItem = Form.Item;

const uploadBtn = (<div>
	<Icon type='plus' />
</div>)

class ScreenShotUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uploading: false
		}
	}
	getValueFromEvent(event) {
		const { limit, uploadOnChange, name } = this.props
		if (event.file.status === 'uploading') {
			this.setState({
				uploading: true
			})
		} else {
			this.setState({
				uploading: false
			})
		}

		if (event.fileList.length > limit) {
			event.fileList.splice(limit, event.fileList.length)
		}

		return uploadOnChange({ event, limit, name });
	}
	validator(rule, value, cb) {
		this.props.validator(rule, value, cb, this.state.uploading)
	}
	render() {
		const {
			form,
			field,
			required,
			errorMsg,
			uploadProps,
			beforeUpload,
			uploadBtnVisible,
			limit,
			label,
			extra,
			formItemLayout
		} = this.props;

		const { getFieldDecorator } = form;

		return (
			<FormItem
				className="shotImg"
				label={label}
				extra={extra}
				{...formItemLayout}
			>
				<div>
					{
						getFieldDecorator(field, {
							getValueFromEvent: this.getValueFromEvent.bind(this),
							rules: [{
								required: required,
								message: errorMsg,
								validator: this.validator.bind(this)
							}]
						})(

							<Upload
								{...uploadProps}
								limit={limit}
								className={'avatar-uploader'}
								beforeUpload={beforeUpload}
							>
								{uploadBtnVisible ? uploadBtn : null}
							</Upload>
						)
					}

				</div>
			</FormItem>
		)
	}
}

export default ScreenShotUpload