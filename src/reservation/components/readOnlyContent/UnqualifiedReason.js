import React from 'react'

function UnqualifiedReason(props) {
	return (
		<ul className={props.className}>
			{
				props.reasons.filter(item => {
					if (item.checked == 1) {
						return item
					}
				}).map(item => {
					return (
						item.id === 1 ?
							<li
								key={item.content}
							>
								*{item.comment}
							</li>
							: <li
								key={item.content}
							>
								*{item.content}
							</li>
					)
				})
			}
		</ul>
	)

}

export default UnqualifiedReason
