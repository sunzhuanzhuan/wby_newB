import React, { Component } from "react"
import { Select } from 'antd'
import { connect } from "react-redux";
import * as actions from '../../actions'
import { platformTypesMap } from '../../constants/config'

const Option = Select.Option

@connect(state => state.extensionNumber, actions)
export default class PlatformSelect extends Component {
    componentWillMount() {
        let { getPlatformList, platformList } = this.props
        // 获取平台列表
        if (Object.keys(platformList).length <= 0) {
            getPlatformList()
        }
    }

    render() {
        return (
            <Select allowClear
                    optionFilterProp="children"
                    showSearch
                    placeholder='选择平台' className='w120' {...this.props}>
                {
                    Object.keys(this.props.platformList).map((key) => {
                        let { value, name } = platformTypesMap[key]
                        return <Option key={value}>{name}</Option>
                    })
                }
            </Select>
        )
    }
}

