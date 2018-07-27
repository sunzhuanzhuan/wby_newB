import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd';

const FormItem = Form.Item;

export const FormBatchSearch = ({ form, name, label, placeholder, className, showModal, setBatchSearchKey, batchSearchValue, batchSearchValueChange, resetBatchSearchValue }) => {
	const { getFieldDecorator } = form;
	const divStyle = {
		display: 'inline-block'
	};

	return (
		<div style={divStyle}>
			<FormItem
				label={label}
				className={className}
			>
				{getFieldDecorator(name, {
					initialValue: batchSearchValue,
					getValueFromEvent: batchSearchValueChange
				})(
					<Input
						type="text"
						placeholder={placeholder ? placeholder : `请填写${label}`}
					/>
				)}
			</FormItem>

			<div className={'batch-search-button'}>
				<a
					href="javascript:;"
					onClick={() => {
						showModal('batchSearch');
						setBatchSearchKey(name)
					}}
				>{`批量输入${label}`}</a>

				<a
					href="javascript:;"
					className="FilterForm_derive"
					onClick={() => resetBatchSearchValue(name)}
				>{`清空${label}`}</a>
			</div>


		</div>
	)
}

FormBatchSearch.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired,
	className: PropTypes.string
}