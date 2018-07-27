import React from 'react'
import AttachmentItem from './AttachmentItem'
import './attachments.css'

function Attachments(props) {
	const { attachments, width, className } = props
	return (
		<div className={className}>
			{
				attachments.map(item => (
					<AttachmentItem
						key={item}
						src={item}
						width={width}
					/>))
			}
		</div>

	)
}

export default Attachments