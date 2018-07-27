import React, { Component } from 'react'
import { Select } from 'antd';
const Option = Select.Option

class AppInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            permissionFields: props.permissionFields || [],
            checkedFields: props.checkedFields || {},
            resourceList: props.resourceList || []
        }
    }

    render() {
        const { applist = [] } = this.props;

        return (
            <div style={{ marginBottom: 10, display: 'inline-block' }}>
                应用类型：<Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="请选择应用"
                    onChange={this.props.onChange}
                >
                    {applist.map(d =>
                        <Option value={d.app_id} key={d.app_id}>{d.app_name}</Option>
                    )}
                </Select>
            </div>
        )
    }
}

export default AppInfo;
