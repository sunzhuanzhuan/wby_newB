import React from 'react'
import { Modal } from 'antd';
import './FormContainer.less'

const ReservationModal = (props) => {
	const { visible, onCancel, title } = props;
	return (
		<Modal
			visible={visible}
			title={title}
			width='100%'
			onCancel={onCancel}
			cancelText='取消'
			maskClosable={false}
			destroyOnClose={true}
			wrapClassName='reservationAllModal'
			footer={null}
		>
			{props.children}
		</Modal>
	);
};

export default ReservationModal;
