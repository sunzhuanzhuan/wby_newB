import React, {Component} from "react";
import {Button, Col, DatePicker, Form, Input, message, Modal, Popover, Row, Select, Table} from "antd";

import {requirementPlanMap, sourceMap} from "../../constants/config";
import {connect} from "react-redux";
import * as actions from '../../actions'

import PlatformSelect from '../../base/PlatformSelect'
import FilterContainer from "../../components/FilterContainer";
import './allocateTask.less';
// import StausView from "../../base/StatusView";
import MediaManagerSelect from "../../base/MediaManagerSelect";
import ViewMoreText from "../../base/ViewMoreText";
import moment from 'moment';

const {RangePicker} = DatePicker;
const FormItem = Form.Item
const Option = Select.Option
const {TextArea} = Input;


@connect(state => state.extensionNumber, actions)
class AllocateTask extends Component {
    state = {
        filter: {},
        currentPage: 1,
        selectedRowKeys: [],
        step: 1,
        allocateModalShow: false,
        submitAllocateLoading: false,
        requirementModalShow: false,
        requirementDetail: null,
    }

    // 分配媒介
    handleSubmitAllocate = async () => {
        let {postAllotMediaManager, allotList: {map}} = this.props;
        this.formRef.props.form.validateFields((err, values) => {
            if (!err) {
                // 处理发送数据
                let body = {
                    ...values,
                    ext_account_ids: this.state.selectedRowKeys.map(key => map[key]['ext_account_id'])
                };
                this.setState({submitAllocateLoading: true})
                // 发送请求
                postAllotMediaManager(body).then(({msg}) => {
                    message.success(msg, 1.2)
                    // 重新拉取数据 + 复位
                    this.getList()
                    this.setState({
                        allocateModalShow: false,
                        submitAllocateLoading: false,
                        selectedRowKeys: [],
                    })
                    ;
                })
                    .catch(() => {
                        message.error('分配失败', 1.2)
                        this.setState({
                            submitAllocateLoading: false
                        })
                    })
            }
        })

    }

    // 获取列表方法
    getList = async (query = {}) => {
        let {getAllotList} = this.props
        let {filter} = this.state
        this.setState({tableLoading: true})
        await getAllotList({...filter, page: 1, ...query})
        this.setState({
            selectedRowKeys: [],
            filter: {...filter, ...query},
            tableLoading: false,
            currentPage: query.page || 1
        })
    }

    componentWillMount() {
        // 获取拓号任务分配列表
        this.getList()
    }

    // 创建需求详情弹窗内容
    createRequirementDetail = info => {
        let C = null;
        if (info) {
            C = <div className='requirement-detail'>
                <Row>
                    <Col span={7}>需求名称:</Col>
                    <Col span={15} offset={1}>{info.requirement_name}</Col>
                </Row>
                <Row>
                    <Col span={7}>创建人区域:</Col>
                    <Col span={15} offset={1}>{info.creator_area}</Col>
                </Row>
                <Row>
                    <Col span={7}>项目组名称:</Col>
                    <Col span={15} offset={1}>{info.project_team_name}</Col>
                </Row>
                <Row>
                    <Col span={7}>需求计划:</Col>
                    <Col span={15} offset={1}>{info.requirement_plan}</Col>
                </Row>
                <Row>
                    <Col span={7}>创建人联系方式:</Col>
                    <Col span={15} offset={1}>{info.creator_mobile}</Col>
                </Row>
                <Row>
                    <Col span={7}>需求来源:</Col>
                    <Col span={15} offset={1}>{sourceMap[info.source_code].text}</Col>
                </Row>
                <Row>
                    <Col span={7}>预计推广时间:</Col>
                    <Col span={15} offset={1}>{info.promotion_start_at + ' 到 ' + info.promotion_end_at}</Col>
                </Row>
                <Row>
                    <Col span={7}>推广产品:</Col>
                    <Col span={15} offset={1}>{info.promoted_product}</Col>
                </Row>
                <Row>
                    <Col span={7}>最晚上架时间:</Col>
                    <Col span={15} offset={1}>{info.launched_before}</Col>
                </Row>
                <Row>
                    <Col span={7}>需求描述:</Col>
                    <Col span={15} offset={1}>{info.desc}</Col>
                </Row>
                <Row>
                    <Col span={7}>备注:</Col>
                    <Col span={15} offset={1}>{info.comment}</Col>
                </Row>
            </div>
            this.setState({
                requirementModalShow: true,
                requirementDetail: C
            })
        }
    }

    render() {
        let {allotList} = this.props
        let {count = 0, page = 1, pageNum = 100, map, list} = allotList || {}
        let columns = [
            {
                title: '需求名称',
                dataIndex: 'requirement_name',
                align: 'center',
                fixed: 'left',
                width:120,
                render: (name, info) => {
                    return <a onClick={() => {
                        this.createRequirementDetail(info)
                    }}>{name}</a>;
                }
            }, {
                title: '账号名称',
                dataIndex: 'account_name',
                align: 'center',
                fixed: 'left',
                width:120,
                render: (name) => {
                    return name;
                }
            }, {
                title: 'URL',
                dataIndex: 'url',
                align: 'center',
                width: '200px',
                render: (URL) => {
                    return URL
                }
            }, {
                title: 'ID',
                dataIndex: 'weibo_id',
                align: 'center',
                render: (weiboID) => {
                    return weiboID
                }
            },
            {
                title: '平台',
                dataIndex: 'weibo_type_name',
                align: 'center',
                render: (text) => {
                    return <span>{text || '-'}</span>
                }
            }, {
                title: '需求描述',
                dataIndex: 'desc',
                align: 'center',
                width: 160,
                render: (text) => {
                    return <ViewMoreText content={text || ''} title={'需求描述'}/>
                }
            }, {
                title: '提交时间',
                dataIndex: 'created_at',
                align: 'center',
                width: 102,
                render: (num) => num ? num : '-'
            }, {
                title: '最晚上架时间',
                dataIndex: 'launched_before',
                align: 'center',
                width: 102,
                render: (text) => text || '-'
            }, {
                title: '需求计划',
                dataIndex: 'requirement_plan',
                align: 'center',
                render: (time) => time || '-'
            }, {
                title: '销售/AE',
                dataIndex: 'creator',
                align: 'center',
                render: (name, {cell_phone}) =>
                    <Popover placement="top" title='联系方式:' content={cell_phone}
                             trigger="hover"><a>{name}</a></Popover> || '-'
            }, /*{
                title: '拓号状态',
                dataIndex: 'finish_status',
                align: 'center',
                render: (status, { termination_resaon }) => {
                    if (status === '终止拓号') {
                        return <Popover placement="top" title='终止理由:' content={termination_resaon || '无'} trigger="hover">
                            <span><StausView status={status}/></span>
                        </Popover>
                    } else {
                        return <StausView status={status}/> || '-'
                    }

                }
            }, */{
                title: '区域',
                dataIndex: 'creator_area',
                align: 'center',
                render: (time) => time || '-'
            }, {
                title: '备注',
                dataIndex: 'comment',
                align: 'center',
                width: 160,
                fixed: 'right',
                render: (text) => <ViewMoreText content={text || ''} title={'备注'}/>
            }
        ]
        let rowSelection = {
            getCheckboxProps: record => ({
                disabled: record['finish_status_code'] == '1'
            }),
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys})
            },
            fixed:'left'
        };
        let pagination = {
            position: 'top',
            showTotal: total => `共 ${Math.ceil(total / pageNum)} 页，${total} 条`,
            size: 'small',
            hideOnSinglePage: true,
            onChange: (current) => {
                this.getList({page: current})
            },
            total: count,
            pageSize: pageNum,
            current: Number(page) || 1
        }
        let primary_key = 'id'
        let dataSoure = list.map(item => map[item])
        return (
            <div className='extension-number allocate-task-page'>
                <header className='page-content'>
                    <FilterContainer>
                        <FilterForm tableLoading={this.state.tableLoading} getList={this.getList}/>
                    </FilterContainer>
                </header>
                <main>
                    <Table rowSelection={rowSelection} pagination={pagination}
                           bordered columns={columns}
                           rowKey={record => record[primary_key]}
                           loading={this.state.tableLoading}
                           dataSource={dataSoure}
                           scroll={{ x: 1500}}
                           locale={{
                               emptyText: '当日无分配任务'
                           }}
                    />
                </main>
                <footer className='page-footer'>
                    <Button type='primary' className='next-button'
                            disabled={this.state.selectedRowKeys.length <= 0}
                            onClick={() => {
                                this.setState({allocateModalShow: true})
                            }}>分配</Button>
                </footer>
                {this.state.allocateModalShow ?
                    <Modal visible={true}
                           maskClosable={false}
                           wrapClassName='extension-number-modal modal-allocate-task-page'
                           title="微播易提醒您：请选择分配拓展媒介经理"
                           confirmLoading={this.state.submitAllocateLoading}
                           onCancel={() => {
                               this.setState({allocateModalShow: false})
                           }}
                           onOk={this.handleSubmitAllocate}
                    ><AllocateForm wrappedComponentRef={node => this.formRef = node}/>
                    </Modal> : null}
                <Modal visible={this.state.requirementModalShow}
                       onCancel={() => this.setState({requirementModalShow: false})}
                       footer={null}
                       className='extension-number-modal'
                       title='需求详情'
                >
                    {this.state.requirementDetail}
                </Modal>
            </div>
        );
    }
}

@Form.create({})
class FilterForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }

    submitQuery = (e) => {
        let {getList} = this.props
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.launched_before_at && values.launched_before_at.length) {
                    values['launched_before_start_at'] = values.launched_before_at[0].format();
                    values['launched_before_end_at'] = values.launched_before_at[1].format();
                } else {
                    values['launched_before_start_at'] = undefined;
                    values['launched_before_end_at'] = undefined;
                }
                delete values.launched_before_at
                // 查询请求
                getList(values)
            }
        });
    }

    render() {
        let requirementPlanKeys = [1, 2],
            // finishStatusKeys = [1],
            // finishStatusAry = finishStatusKeys.map(key => finishStatusMap[key]),
            requirementPlanAry = requirementPlanKeys.map(key => requirementPlanMap[key])
        const {getFieldDecorator} = this.props.form;
        return (<div><Form layout="inline" onSubmit={this.submitQuery}>
            <FormItem label="平台">
                {
                    getFieldDecorator('weibo_type', {})(
                        <PlatformSelect getPopupContainer={() => document.querySelector('.allocate-task-page')}/>)
                }
            </FormItem>
            <FormItem label="账号名称">
                {
                    getFieldDecorator('account_name', {})(
                        <Input placeholder='填写账号名称'/>)
                }
            </FormItem>
            <FormItem label="需求名称">
                {
                    getFieldDecorator('requirement_name', {})(
                        <Input placeholder='填写需求名称'/>)
                }
            </FormItem>
            <FormItem label="选择计划">
                {
                    getFieldDecorator('requirement_plan', {})(
                        <Select allowClear
                                getPopupContainer={() => document.querySelector('.allocate-task-page')}
                                className='w130' placeholder='需求计划'>
                            {requirementPlanAry.map(({id, text}) =>
                                <Option key={id}>{text}</Option>)}
                        </Select>)
                }
            </FormItem>
            <FormItem label="销售/AE">
                {
                    getFieldDecorator('creator', {})(
                        <Input placeholder='填写销售/AE'/>)
                }
            </FormItem>
            {/*<FormItem label="拓号状态">
                {
                    getFieldDecorator('finish_status', {})(
                        <Select allowClear
                                getPopupContainer={() => document.querySelector('.allocate-task-page')}
                                className='w130' placeholder='选择状态'>
                            {finishStatusAry.map(({ id, text }) =>
                                <Option key={id}>{text}</Option>)}
                        </Select>)
                }
            </FormItem>*/}
            <FormItem label="最晚上架时间">
                {
                    getFieldDecorator('launched_before_at', {})(<RangePicker format='YYYY-MM-DD HH:mm:ss' showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                    }}/>)
                }
            </FormItem>
            <FormItem>
                <Button ghost type='primary' style={{width: '80px'}}
                        htmlType="submit"
                        loading={this.props.tableLoading}
                        className='filter-button'>查询</Button>
            </FormItem>
        </Form>
        </div>)
    }
}

@Form.create({})
class AllocateForm extends Component {
    render() {
        const {getFieldDecorator} = this.props.form
        return (<Form layout="inline">
                <FormItem label="拓号专员">
                    {
                        getFieldDecorator('owner_admin_id', {
                            rules: [{required: true, message: '请选择拓号专员'}]
                        })(
                            <MediaManagerSelect group={[56,40,39]} exnum={"请选择拓号专员"}/>)
                    }
                </FormItem>
                <div>
                    <FormItem style={{margin: '0'}}>
                        {
                            getFieldDecorator('comment', {
                                rules: [{max: 500, message: '最多可输入500字'}]
                            })(
                                <TextArea style={{width: '472px'}} placeholder="备注" autosize={{
                                    minRows: 4,
                                    maxRows: 4
                                }}/>
                            )
                        }
                    </FormItem>
                </div>
            </Form>
        )
    }
}

export default AllocateTask;
