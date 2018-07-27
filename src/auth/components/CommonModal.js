import React from 'react'
import { Modal } from 'antd';

const CommonModal = (props) => {
	const { visible, onCancel, onNew, type, onEdit, title, okText } = props;
	return (
		<Modal
			visible={visible}
			title={title}
			okText={okText}
			cancelText={"取消"}
			width='50%'
			onCancel={onCancel}
			onOk={type === "add" ? onNew : onEdit}
		>
			{props.children}
		</Modal>
	);
};

export default CommonModal;
