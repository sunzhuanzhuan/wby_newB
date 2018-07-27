import React from 'react'
export default props => <table style={{ margin: "auto" }}>
	{props.list.map((one, index) => {
		return <tr key={index} style={{ color: one.color }}>
			<th width={props.width || 68} style={{ verticalAlign: 'text-top' }}>{one.title}</th>
			<td style={{ textAlign: 'left' }}>{one.detail}</td>
		</tr>
	})}
</table>
