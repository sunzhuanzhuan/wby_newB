import React from "react"
import './index.less'
const HeadTitle = props => {

    return <header className={'head-title-' + props.type}>
		<div className='title'>{props.title}</div>
		{props.desc ? props.desc : null}
	</header>
}

export default HeadTitle
