import React, {Component} from 'react';
import {Modal, message, notification} from 'antd';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import AddlabelForm from './AddlabelForm'
import * as TagAction from "../../action";


class OperationslaberModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            childLoading: false
        }
    }

    handleOk() {
//删除标签
        if (this.props.editType === "delete") {
            this.props.handleOk();
            this.props.deleteLoading(true);
            let current = this.props.lists.data.length === 1 && this.props.current !== 1 ? this.props.current - 1 : this.props.current;
            let data = this.props.searchText ? {
                list_type: 1,
                page: current,
                search: this.props.searchText
            } : {list_type: 1, page: current};
            this.props.actions.operationTag("operationTag", this.props.deleteData, message).then(() => {
                this.props.actions.requestTaglist("requestTaglist", data).then(() => {
                    this.props.deleteLoading(false);
                    this.props.sortLabel(this.props.lists)
                })
            })
        }
//添加标签
        if (this.props.editType === "add") {
            if (this.state.childLoading) {
                this.openNotificationWithIcon("error");
            } else {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        values.icon_path = this.pachImg(values.icon_path);
                        values.marked_graph = this.pachImg(values.marked_graph);
                        this.props.handleOk();
                        this.props.actions.addTag("addTag", values, message).then(() => {
                            this.props.addEdit();
                            this.form.resetFields();
                        });
                    }
                })
            }
        }
    }

//图片路径处理
    pachImg(url) {
        if (url) {
            let str = url.split("vol")[1];
            return "/vol" + str;
        } else {
            return "";
        }
    }

//弹窗关闭操作
    handleCancel() {
        this.props.handleCancel();
        if (this.props.editType === "add") this.form.resetFields();
    }

//控制图片未上传完毕不能提交
    openNotificationWithIcon(type) {
        notification[type]({
            message: '图片未上传完毕！请稍后在确认'
        });
    }

//判断图拍呢上传状态
    getChildLoading(bool) {
        this.setState({childLoading: bool});
    }

    render() {
        const {title, editType, visible} = this.props;
        return (
            <div>
                <Modal title={title} visible={visible} onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancel.bind(this)}>
                    {editType === "add" ?
                        <AddlabelForm ref={form => this.form = form} getChildLoading={this.getChildLoading.bind(this)}
                                      visible={visible}/> : "确定删除该标签吗？删除后可在标签回收站中找回"}
                </Modal>
            </div>

        )
    }
}

const mapStateToProps = () => {
    return {labelModal: {}};
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        ...TagAction
    }, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OperationslaberModal);
