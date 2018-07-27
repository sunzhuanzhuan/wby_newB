import React from 'react'
import { Modal } from 'antd';

const NavGroupModal = (props) => {
	const { visible, onCancel, onAdd, type, onEdit } = props;
	return (
		<Modal
			visible={visible}
			title={type === "add" ? '添加导航' : '修改导航'}
			okText={type === "add" ? '确认添加' : '确认修改'}
			width='380px'
			onCancel={onCancel}
			onOk={type === "add" ? onAdd : onEdit}
		>
			{props.children}
		</Modal>
	);
};

export default NavGroupModal;
