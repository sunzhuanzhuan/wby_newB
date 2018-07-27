import React, {Component} from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Modal, Input, Form, Checkbox, Row, Col, Icon, message} from 'antd';
import * as TagAction from "../../action";

const {TextArea} = Input;
const CheckboxGroup = Checkbox.Group;

class BulkImportAccountModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 1,//导入步骤状态
            verification: "",//导入验证错误文字
            okText: '开始导入',
            confirmLoading: false,
            accountId: [], //导入账号总数
            tagall: [],//剔除标签重复
            tagid: this.props.tagid,
            impotBtn: false, //去人导入禁用
            n2: 0,//检测账号
            accountnum: 0 //最后导入的账号数
        }
    }

//确认导入
    handleOk() {
        if (this.state.status === 2) {
            if (this.state.accountnum === 0) {
                this.setState({status: 1, okText: '开始导入'}, () => {
                    message.error("导入账号不能为空！", 1)
                });
                return;
            }
            this.setState({status: 3}, () => {
                this.props.actions.accountImport(
                    "importTagInsert", {
                        accountIds: this.state.accountId.join(","),
                        tagid: this.state.tagid,
                        tagall: this.state.tagall
                    }).then(() => {
                    this.setState({status: 4}, () => {
                        if (this.props.importAccountStatus.no.length === 0) {
                            setTimeout(() => {
                                this.handleCancel();
                            }, 1200)
                        }
                    });
                });
            })

        }
        if (this.state.status === 1) {
            this.props.form.validateFields((err, values) => {
                if (this.verification(values.accountId)) {
                    this.setState({verification: "", confirmLoading: true}, () => {
                        this.props.actions.accountImport("importTagCheck",
                            {accountId: this.account_id(values.accountId).join(","), tagid: this.state.tagid})
                            .then(() => {
                                this.setState({
                                    status: 2,
                                    confirmLoading: false,
                                    accountId: this.accountRemove(this.account_id(values.accountId),
                                        this.props.importAccount.is_exist.noexist.accountid,
                                        this.props.importAccount.black.exist.accountid,
                                        this.props.importAccount.repeat.exist.accountid,
                                        this.props.importAccount.inferior.exist.accountid),
                                    okText: '确认导入',

                                }, () => {
                                    this.setState({accountnum: this.state.accountId.length});
                                });
                            });
                    });
                }
            });
        }
    }

//关闭窗口
    handleCancel() {
        this.props.handleCancel();
        setTimeout(() => {
            this.setState({status: 1, tagall: []}, () => {
                this.props.form.resetFields();
            })
        }, 200);
        if (this.state.status === 4) {
            this.props.initTagdetails();
            this.props.getTagDetailSearchList("9", 1, "", 3, this.props.tagid);
        }
    }

//拼接account_id字符串
    account_id(data) {
        let accountId = new Set((data.split(/\n+/g).filter(t => t !== "")));
        this.setState({n2: [...accountId].length});
        return [...accountId]
    }

//验证导入账号规则
    verification(data) {
        let noNumber = [];
        const reg = /^[0-9]+[0-9]*]*$/;
//判断是否为空
        if (!data) {
            this.setState({verification: "请输入account_id"});
            return false;
        } else {
//判断是否为数字
            let arr = data.split(/\n+/g).filter(t => t !== "");
            arr.map(val => {
                if (!reg.test(val)) {
                    noNumber.push(val);
                }
            });
            if (noNumber.length !== 0) {
                this.setState({verification: "account_id必须为数字，非数字的account_id为: " + noNumber.join(",") + ";"});
                return false;
            }
            if (data.split(/\n+/g).length > 200) {
                this.setState({verification: "最多输入200个账号，请重新输入"});
                return false;
            }
        }

        return true;
    }

//账号剔除
    accountRemove(account, is_exist, black, repeat, inferior) {
        let arr = [...is_exist, ...black, ...repeat, ...inferior];
        return account.filter(item => {
            return !arr.includes(item)
        });
    }

//多选条件
    onChange(value) {
        this.setState({tagall: value});
        // console.log(value)
    }

//减去其他标签重复账号
    accountnum(e) {
        let n = parseInt(e.target.name);
        let c = e.target.checked;
        let num = 0;
        if (c) {
            num = this.state.accountnum - n;
        } else {
            num = this.state.accountnum + n;
        }
        this.setState({accountnum: num < 0 ? 0 : num}, () => {
            if (this.state.accountnum > this.state.accountId.length) {
                this.setState({accountnum: this.state.accountId.length})
            }
        });


    }

    render() {
        const {visible, form, importAccount, importAccountStatus} = this.props;
        const {getFieldDecorator} = form;
        const {is_exist, black, inferior, repeat, onther} = importAccount;
        const {ok, no} = importAccountStatus;
        return (
            <div>
                <Modal
                    className={this.state.status === 3 || this.state.status === 4 ? "operationslabel-detail operationslabel-detail-import" : "operationslabel-detail"}
                    title={<span>批量导入账号<span style={{marginLeft: "20px"}}>{"标签名称: " + this.props.name}</span></span>}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    cancelText="取消"
                    okText={this.state.okText}
                    visible={visible}
                    confirmLoading={this.state.confirmLoading}>
                    {this.state.status === 1 || this.state.status === 2 ? <div><Form>
                        <h4>请输入account_id，一行一个，单次最多导入200个</h4>
                        <p className="tips-auto-delete"><span className="warning">说明：</span>重复账号、标签黑名单账号在导入进标签时会自动剔除</p>
                        <Form.Item>
                            {getFieldDecorator('accountId', {initialValue: ""})(<TextArea
                                autosize={{minRows: 7, maxRows: 10}}
                                disabled={this.state.status === 2 ? true : false}/>)}
                        </Form.Item>
                        <div style={{"display": this.state.verification ? "block" : "none", color: "red"}}>
                            {this.state.verification}
                        </div>
                        {this.state.status === 2 ? <div className="account-check-result">
                            <h4>一、账号检测结果</h4>
                            <p>{is_exist.noexist.accountid.length === 0 ? null :
                                <span className="warning">{is_exist.noexist.accountid.length}个账号未找到，
account_id为{is_exist.noexist.accountid.join(",") + "；"}</span>}
                                共检测到<b> {this.state.n2}</b> 个账号,其中标签黑名单账号<b>{black.exist.accountid.length}</b>个，
                                劣质号<b>{inferior.exist.accountid.length}</b>个，
                                当前标签已包含的重复账号<b>{repeat.exist.accountid.length}</b>个；</p>
                            <h4>二、其他标签重复账号剔除</h4>
                            <p>有<b>{onther.length}</b>个标签和当前标签的账号有重合，选中后可剔除本标签的重合账号</p>
                            {onther.length !== 0 ? <CheckboxGroup onChange={this.onChange.bind(this)}>
                                <Row type="flex" justify="start">
                                    {onther.map((value, index) => {
                                        return <Col key={index}>
                                            <Checkbox name={value.TradingCount} value={value.operation_tag_id}
                                                      checked={false} onClick={this.accountnum.bind(this)}>
                                                {value.name + "(" + value.TradingCount + "个)"}
                                            </Checkbox>
                                        </Col>
                                    })}
                                </Row>
                            </CheckboxGroup> : null}
                            <p>本次将批量导入<span className="warning">{this.state.accountnum}</span>个账号</p>
                        </div> : ""}
                    </Form></div> : ""}
                    {this.state.status === 3 ?
                        <h3 className="import-account-status"><Icon className="icon-format" style={{color: "#1890ff"}}
                                                                    type="loading"/>正在导入，请稍候</h3> : ""}
                    {this.state.status === 4 ? <div>
                        {no.length === 0 ?
                            <h3 className="import-account-status"><Icon className="icon-format"
                                                                        style={{color: "#52c41a"}}
                                                                        type="check-circle-o"/>成功导入账号<b>{ok.length}</b>个
                            </h3> :
                            <div>
                                <h3 className="import-account-status"><Icon className="icon-format"
                                                                            style={{color: "#faad14"}}
                                                                            type="info-circle-o"/>成功导入账号<b>{ok.length}</b>个，失败<b
                                    className="warning">{no.length}</b>个</h3>
                                <p className="warning">{"失败账号account_id: " + no.join(",")}</p>
                            </div>
                        }
                    </div> : ""}

                </Modal>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        importAccount: state.operationslabelReducers.accountImport.accountIds || {},
        importAccountStatus: state.operationslabelReducers.accountImport || {}
    }
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        ...TagAction
    }, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(BulkImportAccountModal));
