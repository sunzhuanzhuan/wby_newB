import React, { Component } from 'react'
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
const Option = Select.Option;
class BusinessCompanySelect extends Component {
	constructor(props) {
		super(props);
		this.lastFetchId = 0;
		this.fetchUser = debounce(this.fetchUser, 800);
		this.state = {
			data: [],
			value: [],
			fetching: false,
		};
	}
	fetchUser = (value) => {
		if (!value) {
			this.setState({ data: [] })
			return
		}
		this.lastFetchId += 1;
		const fetchId = this.lastFetchId;
		this.setState({ data: [], fetching: true });
		this.props.getCompanyName({ name: value })
			.then(response => {
				if (response) {
					if (fetchId !== this.lastFetchId) { // for fetch callback order
						return;
					}
					const data = response.data.list.map(user => ({
						text: user.name,
						value: user.company_id,
					}));
					this.setState({ data, fetching: false });
				} else {
					this.setState({ data: [] })
				}

			});
	}
	handleChange = (value) => {
		if (value) {
			this.props.changeCompany(value)
			this.setState({
				value,
				data: [],
				fetching: false,
			});
		}
		this.props.cleanCompanyName()
	}
	render() {
		const { fetching, data, value } = this.state;
		return (
			<Select
				{...this.props}
				showSearch
				allowClear
				labelInValue
				value={value}
				placeholder="请输入并从下拉框中选择"
				notFoundContent={fetching ? <Spin size="small" /> : null}
				filterOption={false}
				onSearch={this.fetchUser}
				onChange={this.handleChange}
				style={{ width: '100%' }}
				onFocus={() => { this.setState({ data: [] }) }}
			>
				{data.map(d => <Option key={d.value}>{d.text}</Option>)}
			</Select>
		);
	}
}

export default BusinessCompanySelect;
