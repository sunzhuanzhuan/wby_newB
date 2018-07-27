import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'

const videoMark = lazyLoadComponent(() => import('./components'))


class videoMarkIndex extends Component {
	state = {}
	render() {
		return (
			<div>
				<Route path='/vm/videomark' component={videoMark} />
			</div>
		);
	}
}

export default videoMarkIndex;
