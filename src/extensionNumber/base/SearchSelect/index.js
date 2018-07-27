import React, { Component } from "react";
import {
    Select, Spin
} from "antd";
import debounce from 'lodash/debounce';


const Option = Select.Option

// 模糊搜索框
export default class SearchSelect extends Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.search = debounce(this.search, 800);
    }

    state = {
        data: [],
        value: [],
        searchIng: false,
    }
    search = (value) => {
        let { searchDataList, keyWord, dataToList, pageSizeKey = 'page_size', size = 20} = this.props
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ data: [], searchIng: true });
        searchDataList({ [keyWord]: value ,[pageSizeKey]: size})
        .then(dataToList)
        .then((list) => {
            if (fetchId !== this.lastFetchId) {
                return;
            }
            this.setState({ data: list, searchIng: false });
        });
    }
    handleChange = (value) => {
        this.setState({
            value,
            data: [],
            searchIng: false,
        });
    }

    render() {
        const { desc, item: [id, text]  } = this.props;
        const { searchIng, data, value } = this.state;
        return (
            <Select
                showSearch
                allowClear
                labelInValue
                filterOption={false}
                value={value}
                placeholder={desc}
                notFoundContent={searchIng ? <Spin size="small"/> : null}
                onSearch={this.search}
                onChange={this.handleChange}
                style={{ width: '120px' }}
                {...this.props}
            >
                {data.map(d => <Option key={d[id]}>{d[text]}</Option>)}
            </Select>)
    }
}
