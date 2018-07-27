import React, {Component} from 'react';
import {Table, Button, Modal, message, Spin} from 'antd';


class AccountListTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account_ids: [],
            titleDeleteAccount: '',
            iconType: '',
            tabText: {
                "9": "微信",
                "23": "朋友圈",
                "1": "新浪微博",
                "live": "直播达人",
                "video": "视频自媒体",
                "orher": "其他"
            }
        }
    }


//删除和批量删除
    deleteFun(type, accountId) {
        const {deleteAccount, tagid, tagDetailSearchList, pageCount, platform, current, initTagdetails} = this.props;
        const {account_ids} = this.state;
        const $that = this;
        if (account_ids.length === 0 && type === "deleteAll") {
            Modal.error({
                title: '提示',
                content: '请先选中账号再进行操作！',
            });
        }
        if (type === "delete") {
            Modal.confirm({
                title: '提示',
                content: '确定删除账号吗？',
                onOk() {
                    deleteAccount("deleteAccount", {tag_id: tagid, account_ids: accountId}, message)
                        .then(() => {
                            pageCount(platform, current);
                            initTagdetails();
                        });

                }
            });
        }
        if (type === "deleteAll" && account_ids.length !== 0) {
            let accountNum = tagDetailSearchList.tagcount - account_ids.length;
            Modal.confirm({
                title: '提示',
                content: accountNum ? '确定删除账号吗？' : '确定删除标签下的所有账号吗？删除后标签将自动下架！',
                onOk() {
                    deleteAccount("deleteAccount", {tag_id: tagid, account_ids: account_ids.join(",")}, message)
                        .then(() => {
                            pageCount(platform, current);
                            initTagdetails();
                            $that.setState({account_ids: []});
                        });

                }
            });
        }
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({account_ids: selectedRowKeys});
    }

//分页
    changePage(page) {
        this.props.pageCount(this.props.platform, page);
    }

    render() {
        const {tagDetailSearchList, platform, add_account_mode, loading} = this.props;
        const url = window.location.href.indexOf("OperationslabelRecycle");
        const {count} = tagDetailSearchList;
        const {account_ids} = this.state;
        const rowSelection = {
            account_ids,
            onChange: this.onSelectChange,
        };

        const accountListTitle = (platform) => {
            let width = 1612;
            let title = [
                {
                    title: 'account_id',
                    dataIndex: 'account_id',
                    key: 'account_id',
                    width: 150,
                    fixed: 'left',
                },
                {
                    title: '账号名称',
                    dataIndex: 'weibo_name',
                    key: 'weibo_name',
                    width: 150,
                    render: (text, record) => parseInt(platform) !== 9 && parseInt(platform) !== 23 ?
                        <a href={record.url} target="_blank">{text}</a> : text
                },
                {
                    title: '平台',
                    dataIndex: 'weibo_type',
                    key: 'weibo_type',
                    width: 150
                },
                {
                    title: '账号ID',
                    dataIndex: 'weibo_id',
                    key: 'weibo_id',
                    width: 100
                },
                {
                    title: '账号分类',
                    dataIndex: 'category',
                    key: 'category',
                    width: 200
                },
                {
                    title: '被约次数',
                    dataIndex: 'reservation_num',
                    key: 'reservation_num',
                    width: 100
                },
                {
                    title: '当前价格有效期开始时间',
                    dataIndex: 'current_price_validity_period_start',
                    key: 'current_price_validity_period_start',
                    width: 250
                },
                {
                    title: '当前价格有效期结束时间',
                    dataIndex: 'current_price_validity_period_end',
                    key: 'current_price_validity_period_end',
                    width: 250
                }

            ];
            const weixinarr = [
                {
                    title: 'SNBT指数',
                    dataIndex: 'snbt',
                    key: 'snbt',
                    width: 100,
                    render: text => text ? text : "无"
                }
            ];
            const penyouquanArr = [
                {
                    title: '配合度',
                    dataIndex: 'account_cooperation_index',
                    key: 'account_cooperation_index',
                    width: 100,
                    render: text => text ? text : "无"
                }
            ];
            const weiboArr = [
                {
                    title: '平均评论数',
                    dataIndex: 'tweet_average_comment_num_28d',
                    key: 'tweet_average_comment_num_28d',
                    width: 150,
                    render: text => text ? text : "无"
                },
                {
                    title: '平均转发数',
                    dataIndex: 'tweet_average_repost_num_28d',
                    key: 'tweet_average_repost_num_28d',
                    width: 150,
                    render: text => text ? text : "无"
                },
                {
                    title: '平均点赞数',
                    dataIndex: 'tweet_average_like_num_28d',
                    key: 'tweet_average_like_num_28d',
                    width: 150,
                    render: text => text ? text : "无"
                }
            ];
            const zhiboArr = [
                {
                    title: '直播观众数',
                    dataIndex: 'average_play_num',
                    key: 'average_play_num',
                    width: 100,
                    render: text => text ? text : "无"
                }
            ];
            const zimeiArr = [
                {
                    title: '平均播放数',
                    dataIndex: 'average_like_num',
                    key: 'average_like_num',
                    width: 100,
                    render: text => text ? text : "无"
                },
                {
                    title: '平均互动数',
                    dataIndex: 'average_comment_num',
                    key: 'average_comment_num',
                    width: 100,
                    render: text => text ? text : "无"
                }
            ];

            const operating = {
                title: "操作",
                dataIndex: 'checkbox',
                key: 'checkbox',
                width: 100,
                fixed: 'right',
                render: (text, record) => <a href="javascript:;"
                                             onClick={this.deleteFun.bind(this, 'delete', record.account_id)}>删除</a>
            }

            if (parseInt(platform) === 9) {
                title = title.concat(weixinarr);
            }
            if (parseInt(platform) === 23) {
                title = title.concat(penyouquanArr);
            }
            if (parseInt(platform) === 1) {
                width = 1962;
                title = title.concat(weiboArr);
            }
            if (platform === "live") {
                title = title.concat(zhiboArr);
            }
            if (platform === "video") {
                width = 1712;
                title = title.concat(zimeiArr);
            }
            if (platform === "orher") {
                width = 1512;
            }
            if (add_account_mode === 1 && url === -1) { //手导入 和 不是回收站也
                title = [...title, operating]
            } else { //去复选框和删除列的宽度
                width = width - 162
            }
            return {title: title, width: width};
        }
        return (
            <div>
                <p>{this.state.tabText[platform]}账号数：{tagDetailSearchList.count ? tagDetailSearchList.count : 0}</p>
                {tagDetailSearchList.list ?
                    <div className="label-account-box-list">
                        {add_account_mode === 1 && url === -1 ? <Spin spinning={loading}><Table
                                rowKey={record => record.account_id}
                                columns={accountListTitle(platform).title}
                                rowSelection={rowSelection}
                                dataSource={tagDetailSearchList.list}
                                pagination={{
                                    pageSize: 100,
                                    current: this.props.current,
                                    total: count,
                                    onChange: this.changePage.bind(this)
                                }}
                                scroll={{x: accountListTitle(platform).width}}
                                footer={() => <Button className="deleteAll"
                                                      onClick={this.deleteFun.bind(this, "deleteAll")}>批量删除</Button>}/></Spin> :
                            <Spin spinning={loading}><Table rowKey={record => record.account_id}
                                                            columns={accountListTitle(platform).title}
                                                            dataSource={tagDetailSearchList.list}
                                                            pagination={{
                                                                pageSize: 100,
                                                                current: this.props.current,
                                                                total: count,
                                                                onChange: this.changePage.bind(this)
                                                            }}
                                                            scroll={{x: accountListTitle(platform).width}}/></Spin>}
                    </div> : ""}

            </div>

        )
    }
}

export default AccountListTable
