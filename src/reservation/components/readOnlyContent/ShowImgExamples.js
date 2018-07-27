import React from 'react'
import { Modal } from 'antd';

const ShowImgExamples = (props) => {
	const { visible, imgExamples, closeModal } = props

	return (
		<Modal
			visible={visible}
			cancelText='关闭'
			okText={false}
			onCancel={closeModal}
			footer={null}
		>
			<ul className='thumbnail_list clearfix'>
				{
					imgExamples.map((item, index) => {
						return (
							<li key={index} className="thumbnail_img">
								<a href={item} target="_blank"><img src={item} /></a>
							</li>
						)
					})
				}
			</ul>
		</Modal>
	)
}

export default ShowImgExamples
