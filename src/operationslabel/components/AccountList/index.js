import React, {Component} from 'react';
import {Tabs, Input, Button, message} from 'antd';
import AccountListTable from './AccountListTable'
import BulkSearchAccountModal from '../../components/BulkSearchAccountModal'


const TabPane = Tabs.TabPane;
const Search = Input.Search;

class AccountList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isbatch: 3,
            searchAccountVisible: false,
            platform: "9",//分类标示
            loading: false,// 表格loading
            searche: "",//搜索账号
            current: 1,//分页页面
            status: 1,//批量查询状态

        }
    }

//批量查找
    showSearchAccountModal = () => {
        this.setState({searchAccountVisible: true, status: 1})
    }

    handleSearchAccountCancel = () => {
        this.setState({searchAccountVisible: false, status: 1})
    }

//分页
    pageCount(platform, page) {
        this.setState({loading: true, current: page, platform: platform}, () => {
            this.props.getTagDetailSearchList(
                this.state.platform,
                this.state.current,
                this.state.searche,
                this.state.isbatch,
                this.props.tagid
            ).then(() => {
                this.setState({loading: false});
            });
        });
    }

//批量查找
    bulkSearch(data) {
        this.setState({
            loading: true,
            current: 1,
            platform: data.platform,
            searche: data.searche,
            isbatch: 1,
            status: 2
        }, () => {
            this.props.getTagDetailSearchList(data.platform, 1, data.search, 1, this.props.tagid)
                .then(() => {
                    this.setState({loading: false, status: 3});
                });
        });
    }

    render() {
        const {tagDetailSearchType, tagDetailSearchList} = this.props;
        return (
            <div>
                <div className="operationslabel-detail-search">
                    {/*批量查找账号按钮*/}
                    <Button
                        className="btn-manual-search"
                        icon="search"
                        size="small"
                        onClick={this.showSearchAccountModal.bind(this)}
                    >批量查找</Button>
                    {/*批量查找账号按钮*/}
                    <Tabs className="tab" type="card" activeKey={this.state.platform} onChange={(key) => {
                        this.setState({platform: key, loading: true, searche: "", current: 1, isbatch: 3});//初始化
                        let Ser = document.getElementsByClassName("search-input");
                        for (let i = 0; i < Ser.length; i++) {
                            Ser[i].getElementsByClassName("ant-input")[0].value = "";
                        }
                        this.props.getTagDetailSearchList(key, 1, "", 3, this.props.tagid).then(() => {
                            this.setState({loading: false});
                        });
                    }}>
                        {tagDetailSearchType.searchTypeInfo ?
                            tagDetailSearchType.searchTypeInfo.map(d =>
                                    <TabPane tab={d.name} key={d.platform}>
                                        <Search className="search-input"
                                                placeholder="请输入账号名称、账号ID"
                                                onSearch={(value) => {
                                                    if (!value) return message.error("搜索条件不能为空！", 1);
                                                    this.setState({
                                                        loading: true,
                                                        searche: value,
                                                        current: 1,
                                                        isbatch: 2,
                                                        platform: d.platform
                                                    }, () => {
//初始化
                                                        this.props.getTagDetailSearchList(d.platform, 1, value, 2, this.props.tagid)
                                                            .then(() => {
                                                                this.setState({loading: false});
                                                            })
                                                    });
                                                }}
                                                enterButton={"搜" + d.name} size="large"/>
                                    </TabPane>
                            ) : ""}
                    </Tabs>
                </div>
                <AccountListTable
                    tagDetailSearchList={tagDetailSearchList}
                    platform={this.state.platform}
                    deleteAccount={this.props.deleteAccount}
                    tagid={this.props.tagid}
                    add_account_mode={this.props.add_account_mode}
                    pageCount={this.pageCount.bind(this)}
                    current={this.state.current}
                    loading={this.state.loading}
                    initTagdetails={this.props.initTagdetails}/>
                {/*批量查找弹出框*/}
                <BulkSearchAccountModal
                    visible={this.state.searchAccountVisible}
                    handleCancel={this.handleSearchAccountCancel}
                    status={this.state.status}
                    bulkSearch={this.bulkSearch.bind(this)}
                    successNum={tagDetailSearchList}/>
            </div>


        )
    }
}

export default AccountList;
