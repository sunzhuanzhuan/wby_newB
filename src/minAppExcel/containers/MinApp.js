import React, { Component } from "react";
import {
    Table, Button, DatePicker
} from "antd";
import { connect } from "react-redux";
import moment from 'moment';
import './minApp.less'
import * as actions from '../actions'

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

@connect(state => state.minApp, actions)
class MinApp extends Component {
    state = {
        // loading: false,
        start_time: moment().format('YYYY-MM-DD'),
        end_time: moment().format('YYYY-MM-DD'),
        currentPage: 1,
        loading: false


    }
    // 获取列表方法
    getList = async (query = { start_time: this.state.start_time, end_time: this.state.end_time, page: 1 }) => {
        let { getKolList } = this.props
        this.setState({ loading: true })
        getKolList({ ...query }).then(() => {
            this.setState({
                currentPage: 1,
                loading: false
            })
        }).catch(() => {

        })
    }

    componentDidMount() {

        // 获取拓号任务分配列表
        this.getList()
    }
    onChangeDate(dates, dateStrings) {
        this.setState({ start_time: dateStrings[0], end_time: dateStrings[1] })

    }
    handleQuerySucc() {
        this.getList()
    }
    handleExportSucc = async () => {
        let { getExcel } = this.props
        await getExcel({ start_time: this.state.start_time, end_time: this.state.end_time })
        let { excelAddress } = this.props
        window.open(excelAddress.exportUrl)


    }
    render() {
        let { KolList } = this.props;
        let { count = 0, map, list } = KolList || {}
        let columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                align: 'center',
            }, {
                title: '日期',
                dataIndex: 'created_time',
                align: 'center',
            }, {
                title: '渠道',
                dataIndex: 'channel',
                align: 'center',
            }, {
                title: '客户名称',
                dataIndex: 'name',
                align: 'center',
                render: (name) => {
                    return <div className='ellipsisNum'>{name}</div>
                }
            }, {
                title: '公司名称',
                dataIndex: 'company_name',
                align: 'center',
                render: (company_name) => {
                    return <div className='ellipsisNum'>{company_name}</div>
                }
            }, {
                title: '所属行业',
                dataIndex: 'industry',
                align: 'center',
                render: (industry) => {
                    return <div className='ellipsisNum'>{industry}</div>
                }
            }, {
                title: '联系电话',
                dataIndex: 'contact',
                align: 'center',
                render: (contact) => {
                    return <div className='ellipsisNum'>{contact}</div>
                }
            }, {
                title: '联系邮箱',
                dataIndex: 'email',
                align: 'center',
                render: (email) => {
                    return <div className='ellipsisNum'>{email}</div>
                }
            }
        ]

        let dataSoure = list.map(item => map[item])
        let pagination = {
            onChange: (current) => {
                let { getKolList } = this.props
                this.setState({ loading: true })
                getKolList({ start_time: this.state.start_time, end_time: this.state.end_time, page: current }).then(() => {
                    this.setState({ currentPage: current, loading: false })
                }).catch(() => {

                })
            },
            total: count,
            pageSize: 20,
            current: this.state.currentPage
        }
        return (
            <div className="operationslabel-box">
                <h3>运营管理-销售线索</h3>
                <div className="operationslabel-box-btnAndLink" style={{ marginBottom: '20px' }}>
                    查询日期：
                    <RangePicker
                        format={dateFormat}
                        defaultValue={[moment(), moment()]}
                        ranges={{
                            '今天': [moment(), moment()],
                            '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            '近一周': [moment().subtract(7, 'days'), moment()],
                            '近一月': [moment().subtract(31, 'days'), moment()]
                            // '近一月': [moment().startOf('month'), moment().endOf('month')]
                        }}
                        onChange={this.onChangeDate.bind(this)}
                    />
                    <Button style={{ marginLeft: '15px' }} onClick={this.handleQuerySucc.bind(this)}>查询</Button>
                    {/*<Link to="/ol/blacklist">标签黑名单账号</Link>*/}
                    <Button style={{ marginLeft: '15px' }} onClick={this.handleExportSucc.bind(this)}>导出数据</Button>
                </div>

                <Table
                    loading={this.state.loading}
                    columns={columns}
                    rowKey={record => record['id']}
                    dataSource={dataSoure}
                    bordered={true}
                    pagination={pagination} />
            </div >
        )
    }
}
export default MinApp;