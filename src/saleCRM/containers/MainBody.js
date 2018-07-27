import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// import { Table, Button, Popconfirm } from 'antd';

class MainBody extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}
	render() {
		return (
			<div>主体</div>
		)
	}
}

MainBody.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = () => ({


})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({

	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MainBody)

