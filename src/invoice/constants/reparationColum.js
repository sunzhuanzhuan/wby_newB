import React from 'react';
import { Button, Popconfirm, message, Popover, Input } from 'antd';
import api from '../../api/index'
const { TextArea } = Input;

export const typeConfigMap = {
    handleRefuse: function (id) {
        api.put('/finance/reparation/refuse/' + id).then(() => {
            message.success('操作成功');
        })
    },
    handlePass: function (id) {
        let value = document.getElementById('remarks').value;
        let obj = {}
        obj.remarks = value
        api.put('/finance/reparation/complete/' + id, { ...obj }).then(() => {
            message.success('操作成功');
        })
    },
    'finance': {
        title: "财务赔偿", name: 'reservation', line: '3', key: 'order_id', columns: [
            {
                title: '操作',
                key: 13,
                align: 'center',
                width: 100,
                render: (text, record) => {
                    const content = (
                        <div>
                            <p>赔偿原因：{record.reparation_reason}</p>
                            <p>备注：{record.remarks}</p>
                            财务备注：< TextArea id='remarks' rows={4} style={{ marginBottom: '10px' }} />
                            <Button type='primary' onClick={() => { this.a.typeConfigMap.handlePass(record.reparation_id) }}>提交</Button>
                        </div>
                    );
                    return (<div>
                        {(record.status_note == "赔偿拒绝") || (record.status_note == "赔偿通过") ? null : <div>
                            <Popover content={content} title="确认通过订单赔偿申请" trigger="click">
                                <Button type="primary">通过</Button>
                            </Popover>
                            <Popconfirm title="确定要拒绝?" okText="确定" cancelText="拒绝" onConfirm={() => { this.a.typeConfigMap.handleRefuse(record.reparation_id) }}>

                                <Button type="primary" style={{ marginTop: '20px' }}>拒绝</Button>
                            </Popconfirm>
                        </div>}
                    </div>)
                }
            }, {
                title: '订单ID',
                dataIndex: 'order_id',
                key: 1,
                align: 'center',
                render: (text, record) => {
                    return (<span >
                        订单ID{record.order_id}
                        {record.evidence[record.order_id] == undefined ? null : record.evidence[record.order_id].map((item, index) => {
                            //console.log(item)
                            return (
                                <p key={index}>
                                    <a href={item.execution_evidence_id}>{item.execution_evidence_code}</a>
                                </p>

                            )
                        })
                        }
                    </span >)
                }
            }, {
                title: '需求名称',
                dataIndex: 'order_name',
                key: 3,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            {record.order_name}
                        </div>
                    )
                }
            }, {
                title: '赔偿ID',
                dataIndex: 'reparation_id',
                key: 4,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            {record.reparation_id}
                        </div>
                    )
                }
            }, {
                title: '赔偿金额',
                dataIndex: 'reparation_amount',
                key: 5,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            {record.reparation_amount}
                        </div>
                    )
                }
            }, {
                title: '结算金额',
                dataIndex: 'auditor_id',
                key: 55,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>无
                            {record.auditor_id}
                        </div>
                    )
                }
            }, {
                title: '赔偿原因',
                dataIndex: 'execution_price',
                key: 6,
                align: 'center',
                render: (text, record) => {
                    const content = (
                        <div>
                            <p>赔偿原因{record.reparation_reason}</p>
                            <p>备注{record.remarks}</p>
                        </div>
                    );
                    return (<div>
                        <Popover content={content} title="详情">
                            <Button type='primary'>查看详情</Button>
                        </Popover>

                    </div>);
                }
            }, {
                title: '申请人',
                dataIndex: 'sale_manager',
                key: 7,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            {record.sale_manager}
                        </div>
                    )
                }
            }, {
                title: '所属销售',
                dataIndex: 'username',
                key: 8,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            {record.operate_admin_info.real_name}
                        </div>
                    )
                }
            }, {
                title: '赔偿状态',
                dataIndex: 'status_note',
                key: 9,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            {record.status_note}
                        </div>
                    )
                }
            }, {
                title: '时间',
                dataIndex: 'spend_detail',
                key: 10,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            <p>申请时间{record.created_at}</p>
                            <p>通过/拒绝时间{record.updated_at}</p>
                        </div>
                    )
                }
            }, {
                title: '公司简称',
                dataIndex: 'company_name',
                key: 11,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            {record.company_name}
                        </div>
                    )
                }
            }, {
                title: 'A端登录名',
                dataIndex: 'own_user_name',
                key: 12,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            {record.own_user_name}
                        </div>
                    )
                }
            }
        ]
    }
}
export default { typeConfigMap }
