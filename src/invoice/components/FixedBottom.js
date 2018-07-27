import React from "react";
import "./fixedBottom.less";

const CompleteApplyList = (props) => {
	// let style = { width: document.getElementById('box').clientWidth + 'px' }
	return (<div id='fixed-bottom' className='fixed-bottom-container'>
		{props.children}
	</div>);
}
export default CompleteApplyList

