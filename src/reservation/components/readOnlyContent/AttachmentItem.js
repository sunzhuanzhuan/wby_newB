import React from 'react'

function AttachmentItem(props) {
	return (
		<div>
			<a href={props.src} target="_blank">
				<img src={props.src} width={props.width} />
			</a>
		</div>
	)
}

export default AttachmentItem