import React from 'react'
import { Modal } from 'antd';

const AmendFormModal = (props) => {
	const { visible, onCancel, onCreate, source } = props;
	return (
		<Modal
			visible={visible}
			title={source == 'create' ? '新建模板' : '修改模板'}
			okText={source == 'create' ? '确认提交' : '确认修改'}
			width='80%'
			onCancel={onCancel}
			onOk={onCreate}
		>
			{props.children}
		</Modal>
	);
};

export default AmendFormModal;
