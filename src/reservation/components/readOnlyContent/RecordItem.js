import React from 'react'

function RecordItem({ text, value }) {
	return (
		<li>{text}: {value}</li>
	)
}

export default RecordItem