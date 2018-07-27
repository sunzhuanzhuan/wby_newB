import React, { Component } from 'react'
import './FormContainer.less'
// import { Form, Input, Tooltip, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';

class StatisticsForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}
	render() {
		const { statistics = [] } = this.props;
		return (
			<div>
				<form action="">
					<fieldset className="form_container">
						<legend>
							统计
                        </legend>
						{
							statistics.length !== 0 ?
								statistics.map(item => {
									return <span style={{ marginLeft: '8px' }} key={item.stage_id}>
										<span>{item.display}</span>
										&nbsp;:&nbsp;
										<span>{item.count}</span>
									</span>
								}) : ""
						}
					</fieldset>
				</form>
			</div>
		)
	}
}
export default StatisticsForm;
