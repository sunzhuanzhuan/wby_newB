import React, { Component } from "react";
//import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { Button, Divider, Form, Input, message, Modal } from "antd";
import * as actions from '../../actions'
import HeaderStep from '../../components/HeaderStep';
import EditableTable from '../../components/EditTable';
import { platformTypesMap } from '../../constants/config';
import { postImportAccount } from '../../api'
import './importNumber.less';
import PlatformSelect from "../../base/PlatformSelect";

const FormItem = Form.Item;
const TextArea = Input.TextArea

@connect(state => state.extensionNumber, actions)
class ImportNumber extends Component {
    state = {
        platformType: -1,
        textAry: [],
        textMap: {},
        errorAry: [],
        successAry: [],
        textValue: ``,
        resultModalShow: false,
        resultModalLoading: false,
        feedbackModalShow: false
    }

    componentWillMount() {
        let { getPlatformList, platformList } = this.props
        // 请平台列表
        if (Object.keys(platformList).length <= 0) {
            getPlatformList()
        }

    }

    // 切换平台清空各项数据
    handleChange = (value) => {
        this.setState({
            platformType: value,
            textAry: [],
            textMap: {},
            errorAry: [],
            successAry: []
        })
    }
    // 设置错误数据项
    setErrorAry = (data) => {
        this.setState({ errorAry: data })
    }
    // 关闭弹窗
    closeResultModal = () => {
        this.setState({ resultModalShow: false })
    }
    // 单条数据修改成功
    setSigleSuccessAry = (item) => {
        let { successAry } = this.state
        successAry.push(item)
        this.setState({ successAry })
    }
    // 提取文本域内容
    checkTextArea = ({ text }) => {
        let { platformType } = this.state;
        let k1reg = platformTypesMap[platformType].reg1
        let k2reg = platformTypesMap[platformType].reg2

        // const reg = /\b(?:([a-zA-Z0-9]+)\s+(.*))+\b/g
        // 按行提取字段
        const reg = /([^\n\r]+)/g
        /* text.replace(reg, (...arg) => {
            let obj = {}
            obj.n = arg[1]
            obj.m = arg[2]
            ary.push(obj)
        }); */
        let ary = text.match(reg) || [], map = {};
        ary = ary.filter(item => item.trim())
        ary = ary.map((item, index) => {
            let reg = /^([^\s]*)(\s+([^\s]*))?/
            let _item = item.trim().match(reg) || []
            _item = _item.map(item => item || '')
            return {
                n: _item[1] || '',
                m: _item[3] || '',
                v: (k1reg.test(_item[1]) && k2reg.test(_item[3])),
                key: index
            }
        });

        ary.reduce((pre, cur, n) => {
            pre[n] = cur
            return pre
        }, map);
        let successAry = [];
        let errorAry = [];
        ary.forEach(item => {
            if (item.v) {
                successAry.push(item)
            } else {
                errorAry.push(item)
            }
        });
        this.setState({
            textAry: ary,
            textMap: map,
            successAry,
            errorAry,
            resultModalShow: true
        })
    }
    // 提交号码
    submitNumber = () => {
        this.setState({ resultModalLoading: true })
        // 处理成功的数据
        let body = this.state.successAry.map(({ n, m }) => ({
            account_name: n,
            url: m,
            weibo_type: this.state.platformType

        }))
        // 异步请求处理
        postImportAccount(body).then(() => {
            // 成功回调
            message.success('导入成功', 1.2);
            this.setState({
                resultModalLoading: false,
                resultModalShow: false,
                feedbackModalShow: true
            })
        }).catch(() => {
            message.error('导入失败', 1.2);
            this.setState({
                resultModalShow: false, resultModalLoading: false
            })
        })
    }
    // 继续添加
    continueAdd = () => {
        this.formRef.props.form.setFieldsValue({ 'text': '' })
        this.setState({ feedbackModalShow: false, resultModalLoading: false })
    }

    render() {
        let { platformType, errorAry, textValue, textAry, successAry } = this.state;
        let { platformList } = this.props;

        return (
            <div className='extension-number seller-ae-page'>
                <main className='page-content'>
                    <HeaderStep step={0}/>
                    <Divider/>
                    <WrappedForm
                        wrappedComponentRef={node => this.formRef = node}
                        nextStep={this.checkTextArea}
                        handleChange={this.handleChange}
                        platformList={Object.keys(platformList)}
                        selectValue={platformType} textValue={textValue} errorAry={errorAry}></WrappedForm>
                </main>
                {this.state.resultModalShow ?
                    <Modal wrapClassName='extension-number-modal modal-seller-ae-import-list' visible={true} width={700}
                           onCancel={this.closeResultModal}
                           maskClosable={false}
                           footer={null}
                    >
                        <h2 className='modal-info-title f16'>
                            {platformTypesMap[platformType].name} -
                            您本次共导入<b className='fs-16'>{textAry.length}</b>条数据,
                            成功<b className='green fs-16'>{successAry.length}</b>条,
                            失败<b className='red fs-16'>{errorAry.length}</b>条
                        </h2>
                        {/*<p>{platformTypesMap[platformType].placeholder}</p>*/}
                        {errorAry.length > 0 ?
                            <EditableTable platformType={platformType}
                                           data={errorAry}
                                           changeData={this.setErrorAry}
                                           setSuccessAry={this.setSigleSuccessAry}
                            ></EditableTable>
                            : successAry.length > 0 ?
                                <div style={{ textAlign: 'center' }}>
                                    <Divider/>
                                    <Button
                                        type="primary"
                                        size='large'
                                        disabled={errorAry.length > 0}
                                        onClick={this.submitNumber}
                                        loading={this.state.resultModalLoading}
                                    >立即提交</Button>
                                </div> : '本次没有成功项,请先导入数据'}
                    </Modal> : null
                }
                <Modal visible={this.state.feedbackModalShow}
                       maskClosable={false}
                       title={'微播易提醒您：'}
                       wrapClassName='extension-number-modal modal-seller-ae-import-feedback'
                       closable={false}
                       width={520}
                       footer={null}
                >
                    <p className='f18 tc'>已成功加入账号列表，可在“已导入账号查看”页查看！</p>
                    <footer className='page-footer'>
                        <Button
                            type="primary"
                            onClick={() => {
                                //修改了push的方式
                                // console.log(this.props.history)
                                this.props.history.push('/extensionNumber/seller/select')
                                //browserHistory.push('/extensionNumber/seller/select')
                            }}
                        >查看导入数据</Button>
                        <Button
                            type="primary"
                            onClick={this.continueAdd}
                        >继续添加账号</Button>
                    </footer>
                </Modal>
            </div>
        );
    }
}

@Form.create({})
class WrappedForm extends Component {
    state = {
        opacity: 0
    }
    submit = () => {
        this.props.form.validateFieldsAndScroll((err) => {
            if (err) return
            let data = this.props.form.getFieldsValue()
            this.props.nextStep(data)
        })
    }

    render() {
        const { selectValue, form: { getFieldDecorator }, handleChange, textValue } = this.props;
        let { opacity } = this.state
        let item = platformTypesMap[selectValue];
        if (!item) {
            item = ''
        }
        return (<Form>
            <FormItem label="请选择拓号平台">
                {getFieldDecorator('weibo_type', {
                    rules: [{
                        required: true,
                        message: '请选择平台'
                    }]
                })(
                    <PlatformSelect
                        style={{ width: 140 }}
                        onChange={handleChange}/>
                )}
                <span className='image-tip-box'
                      onMouseEnter={() => this.setState({ opacity: 1 })}
                      onMouseLeave={() => this.setState({ opacity: 0 })}
                >
					{item && item.img ?
                        <a href='#' className='ml10'>{item.fetchTips}</a> : null}
                    {item && item.img ? <div className='image-tip' style={{
                        opacity,
                        display: opacity ? 'block' : 'none'
                    }}>
                        <img src={item.img}/>
                    </div> : null}
				</span>
            </FormItem>
            <FormItem label={"请将您表格中的账号名称" + ((item && item.text)) + "复制到文本框"}>
                {getFieldDecorator('text', {
                    initialValue: textValue,
                    rules: [{
                        required: true,
                        message: '请输入账号信息'
                    }]
                })(
                    <TextArea
                        placeholder={item ? item.placeholder : '请先选择平台'}
                        autosize={{ minRows: 10, maxRows: 15 }}
                    />
                )}
            </FormItem>
            <FormItem>
                <footer className='page-footer'>
                    <Button className='mr10' type="primary" onClick={this.submit}>加入账号列表</Button>
                </footer>
            </FormItem>
        </Form>)
    }
}

export default ImportNumber;
