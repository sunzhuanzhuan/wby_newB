import React, { Component } from 'react'
import { Form, Checkbox } from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group

class RoleRelation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedFields: []
        }
    }
    onChange(checkedValues) {
        this.setState({
            checkedFields: checkedValues
        })
    }
    render() {
        const { form, detail, checkedFields, roleList } = this.props;
        const { getFieldDecorator } = form;
        const _fields = roleList;
        const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 22 }, }
        return (
            <Form layout='horizontal'>
                <FormItem label="用户" {...formItemLayout}>
                    <span> {detail.real_name} </span>
                </FormItem>
                <FormItem label="角色"  {...formItemLayout}>
                    {getFieldDecorator('role_id', {
                        initialValue: checkedFields || [],
                        rules: [{ required: true, message: '请勾选要添加的角色' }]
                    })(
                        <CheckboxGroup onChange={(checkedValues) => this.onChange(checkedValues, this)}>
                            {
                                _fields.map(record => {
                                    return <Checkbox key={record.id} value={record.id}>{record.zh_name}</Checkbox>
                                })
                            }
                        </CheckboxGroup>
                    )}
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(RoleRelation);
