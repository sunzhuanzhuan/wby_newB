import React, {Component} from 'react';
import {Modal, Input, Icon, Select, Form} from 'antd';

const {TextArea} = Input;

const Option = Select.Option;

class BulkSearchAccountModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: ['批量查找', '正在查找', '批量查找结果']
        }
    }

    handleOk() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let search = values.search.split(/\n+/g).filter(t => t !== "");
                this.props.bulkSearch({platform: values.platform, search: search.join(",")});
                this.props.form.resetFields();
            }

        })
    }

    handleCancel() {
        this.props.handleCancel();
        this.props.form.resetFields();
    }

    rulesText(rule, value, callback) {
        const reg = /^[a-zA-Z0-9_]{0,}$/;
        let noNumber = [];
        if (value) {
            let arr = value.split(/\n+/g).filter(t => t !== "");
            arr.map(val => {
                if (!reg.test(val)) {
                    noNumber.push(val)
                }
            });
            if (noNumber.length !== 0) {
                callback("账号ID不能为中文字符，输入错误账号ID为: " + noNumber.join(",") + ";");

            } else if (value.split(/\n+/g).length > 200) {
                callback("最多输入200个账号ID，请重新输入");
            } else {
                callback();
            }

        } else {
            callback("请输入账号ID");
        }

    }

    render() {
        const {visible, form, status, successNum} = this.props;
        const {getFieldDecorator} = form;
        const platform = [
            {id: "9", name: '微信 '},
            {id: "23", name: '朋友圈 '},
            {id: "1", name: '新浪微博 '},
            {id: "live", name: '直播达人 '},
            {id: "video", name: '视频自媒体 '},
            {id: "orher", name: '其它 '}
        ]
        return (
            <div>
                <Modal
                    className={status === 2 || status === 3 ? "operationslabel-detail operationslabel-detail-import" : "operationslabel-detail"}
                    title={this.state.title[status - 1]}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    cancelText="取消"
                    okText="批量查找"
                    visible={visible}>
                    {status === 1 ? <Form>
                        <Form.Item>
                            {getFieldDecorator('platform', {
                                rules: [{required: true, message: '请选择平台'}],
                                validateTrigger: "onBlur"
                            })(<Select style={{width: 200}} placeholder="请选择平台">
                                {platform.map(d =>
                                    <Option value={d.id} key={d.id}>{d.name}</Option>
                                )}
                            </Select>)}
                        </Form.Item>
                        <h4>请输入账号ID，一行一个，单次最多输入200个</h4>
                        <Form.Item>
                            {getFieldDecorator('search', {
                                rules: [
                                    {required: true, validator: this.rulesText}
                                ],
                                validateTrigger: "onBlur"
                            })(<TextArea autosize={{minRows: 7, maxRows: 10}}></TextArea>)}
                        </Form.Item>
                    </Form> : null}


                    {status === 2 ?
                        <h3 className="import-account-status"><Icon className="icon-format" style={{color: "#1890ff"}}
                                                                    type="loading"/>正在查找，请稍候</h3> : null}

                    {status === 3 ? <div>
                        <h3 className="import-account-status">
                            {successNum.on.length !== 0 ?
                                <Icon className="icon-format" style={{color: "#faad14"}} type="info-circle-o"/> :
                                <Icon className="icon-format" style={{color: "#52c41a"}} type="check-circle-o"/>}
                            成功找到账号<b>{successNum.ok ? successNum.ok : 0}</b>个{successNum.on.length !== 0 ?
                            <span>，失败<b className="warning">{successNum.on.length}</b>个</span> : null}</h3>
                        {successNum.on.length !== 0 ? <p className="warning">{"查找失败的账号ID: " + successNum.on}</p> : null}
                    </div> : null}
                </Modal>
            </div>

        )
    }
}

export default Form.create()(BulkSearchAccountModal)
