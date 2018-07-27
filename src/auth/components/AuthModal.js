import React from 'react'
import { Modal } from 'antd';

const AuthModal = (props) => {
	const { visible, onCancel, onNew, type, onEdit } = props;
	return (
		<Modal
			visible={visible}
			title={type === "new" ? '新建模板' : '修改模板'}
			okText={type === "new" ? '确认新建' : '确认修改'}
			width='50%'
			onCancel={onCancel}
			onOk={type === "new" ? onNew : onEdit}
		>
			{props.children}
		</Modal>
	);
};

export default AuthModal;
