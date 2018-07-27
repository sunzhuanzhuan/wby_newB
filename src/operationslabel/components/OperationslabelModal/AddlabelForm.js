import React, {Component} from 'react';
import {Form, Upload, Input, Icon, Radio, Button,notification} from 'antd';
import api from '../../../api/index'
import axios from 'axios'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 16},
};


class AddlabelForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            icon_path: "",
            marked_graph: "",
            icon_pathloading: false,
            marked_graphloading: false,
            icon_pathrules: true,
            marked_graphrules: true
        }
    }


//图片上传
    handleChange = (fileList) => {
        let name = fileList.filename;
        let isJPG = fileList.file.type === 'image/jpeg' || fileList.file.type === 'image/jpg' || fileList.file.type === 'image/png' || fileList.file.type === 'image/gif';
        let isLt3M = fileList.file.size / 1024 / 1024 < 3;
        if (!isJPG || !isLt3M) {
            if (name === "icon_path") this.setState({icon_pathrules: false, icon_path: ""});
            if (name === "marked_graph") this.setState({marked_graphrules: false, marked_graph: ""});
        } else {
            this.props.getChildLoading(true);
            if (name === "icon_path") this.setState({icon_pathloading: true, icon_pathrules: true});
            if (name === "marked_graph") this.setState({marked_graphloading: true, marked_graphrules: true});
            let formData = new window.FormData();
            api.get("/upload/upload/uploadInfo", {params: {upload_type: "img"}}).then(response => {
                if (response.code === 200) {
                    formData.append("qqfile", fileList.file);
                    formData.append("token", response.data.token);
                    axios.post(response.data.upload_uri, formData).then(response => {
                        if (response.data.code === 1000) {
                            // console.log(response);
                            if (name === "icon_path") this.setState({
                                icon_path: response.data.data.url,
                                icon_pathloading: false
                            }, () => {
                                this.props.getChildLoading(false);
                            });
                            if (name === "marked_graph") this.setState({
                                marked_graph: response.data.data.url,
                                marked_graphloading: false
                            }, () => {
                                this.props.getChildLoading(false);
                            });
                        }else{
							notification['error']({
								message: response.data.msg
							});
							this.setState({
								icon_pathloading: false,
								marked_graphloading: false,
							})
						}

					})
                }
            });
        }
    };

    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible) {
            this.setState({icon_path: "", marked_graph: ""})
        }
    }

//上传图片删除按钮
    deleteImg(type) {
        if (type === "icon_path") this.setState({icon_path: ""});
        if (type === "marked_graph") this.setState({marked_graph: ""})
    }

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Form>
                <Form.Item {...formItemLayout} label="标签名称">
                    {getFieldDecorator('name', {
                        rules: [
                            {required: true, message: '标签名称不得为空!'},
                            {pattern: "^.{1,15}$", message: '标签名称不得超过15个字'},
                        ],
                        validateTrigger: "onBlur"
                    })(<Input placeholder="标签名称不得超过15个字"/>)}
                </Form.Item>

                <Form.Item {...formItemLayout} label="标签简介" style={{"margin-top": "20px"}}>
                    {getFieldDecorator('description', {
                        rules: [
                            {pattern: "^.{0,30}$", message: '标签简介不得超过30个字'},
                        ],
                        validateTrigger: "onBlur",
                        initialValue: ""
                    })(<Input placeholder="标签简介不得超过30个字"/>)}
                </Form.Item>
                <FormItem
                    {...formItemLayout}
                    label="贴纸"
                    style={{"margin-top": "20px"}}>
                    {getFieldDecorator('icon_path', {
                        initialValue: this.state.icon_path
                    })(<Input type="text" style={{"display": "none"}}/>)}
                    <Upload name="icon_path"
                            listType="text"
                            showUploadList={false}
                            customRequest={this.handleChange.bind(this)}>
                        {this.state.icon_path ?
                            <div>
                                <img src={this.state.icon_path} width="40"/>
                                <a href="javascript:;" style={{marginLeft: "10px"}}
                                   onClick={this.deleteImg.bind(this, "icon_path")}>删除</a>
                            </div> :
                            <Button type="primary">
                                <Icon type={this.state.icon_pathloading ? 'loading' : 'upload'}/> 上传
                            </Button>}
                    </Upload>
                    <div style={{color: this.state.icon_pathrules ? "" : "red", lineHeight: "20px"}}>
                        仅jpg、jpeg、png、gif格式，不大于3M，建议高度40像素
                    </div>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="标识"
                    style={{"margin-top": "20px"}}>
                    {getFieldDecorator('marked_graph', {
                        initialValue: this.state.marked_graph
                    })(<Input type="text" style={{"display": "none"}}/>)}
                    <Upload name="marked_graph"
                            listType="text"
                            showUploadList={false}
                            customRequest={this.handleChange.bind(this)}
                    >
                        {this.state.marked_graph ?
                            <div>
                                <img src={this.state.marked_graph} width="40"/>
                                <a href="javascript:;" style={{marginLeft: "10px"}}
                                   onClick={this.deleteImg.bind(this, "marked_graph")}>删除</a>
                            </div> :
                            <Button type="primary">
                                <Icon type={this.state.marked_graphloading ? 'loading' : 'upload'}/> 上传
                            </Button>}
                    </Upload>
                    <div style={{color: this.state.marked_graphrules ? "" : "red", lineHeight: "20px"}}>
                        仅jpg、jpeg、png、gif格式，不大于3M，建议高度40像素
                    </div>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="添加账号方式"
                    style={{"margin-top": "20px"}}
                    className="operation-ant-radio-wrapper">
                    {getFieldDecorator('add_account_mode', {
                        initialValue: 1
                    })(
                        <RadioGroup>
                            <Radio value={1}>手动导入</Radio>
                            <Radio value={2}>执行脚本</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(AddlabelForm);
