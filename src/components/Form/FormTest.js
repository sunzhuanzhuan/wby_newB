import React from 'react'
import { Form, Button } from 'antd'
import { FormComponent } from './FormComponent'

const arr = [
	{
		id: 'test',
		fields: {},
		type: 'input',
		attr: {
			type: "text",
			placeholder: ''
		},
		childrenOptions: {}
	},

	{
		id: 'age',
		fields: {},
		type: 'select',
		attr: {
			type: "text",
			placeholder: ''
		},
		childrenOptions: {
			selectOptions: [
				{ value: 123, name: 123 }
			]
		}
	},
	{
		id: 'age',
		fields: {},
		type: 'checkbox',
		attr: {},
		childrenOptions: {
			label: '年龄',
			selectOptions: [
				{ value: 123, name: 123 }
			]
		}
	}
]
const FormFilter = Form.create()(({ arr, form, onClick }) => {
	// const { getFieldDecorator } = form;
	const _arr = arr.map((item, key) => {
		return <FormComponent
			key={key}
			form={form}
			item={item} />
	})


	return <Form>
		{_arr}
		<Button onClick={onClick}>搜索</Button>
	</Form>
})

// const FormTest = ({ form }) => {
// 	return <FormFilter arr={arr} form={form}></FormFilter>
// }
class FormTest extends React.Component {
	onClick = () => {
		this.formRef.validateFields((values) => {
			console.log("values", values)
		});
	}
	saveFormRef = (formRef) => {
		// debugger;
		this.formRef = formRef;
	}
	render() {
		// const { form } = this.props;
		return <FormFilter onClick={this.onClick} ref={this.saveFormRef} arr={arr}></FormFilter>
	}
}
// const FormFilterWrap = Form.create()(FormTest);
export default FormTest

