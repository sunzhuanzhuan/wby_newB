import React, { Component } from 'react'

class TableFilterContainer extends Component {
    state = {}
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <haeder className='table-top-filter' >
                {this.props.children}
            </haeder >
        )
    }
}
export default TableFilterContainer
