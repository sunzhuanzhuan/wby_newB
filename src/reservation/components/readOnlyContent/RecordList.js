import React from 'react'
import RecordItem from './RecordItem'

function RecordList({ records }) {
	return (
		<ul>
			{
				records.map(item => (
					<RecordItem
						key={item.id}
						text={item.display}
						value={item.value}
					/>
				))
			}
		</ul>
	)
}

export default RecordList