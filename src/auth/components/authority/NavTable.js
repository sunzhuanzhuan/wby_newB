import React, { Component } from 'react'
import { Table } from 'antd';

class NavTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data
        }
    }

    render() {
        const { data, columns } = this.props;

        const _getRowClassName = (record) => {
            return record.subs ? '' : 'Hello--hide-expand'
        }

        const getRows = (record) => {
            if (record.subs) {
                record.columns = columns
                return <NavTable
                    data={record.subs}
                    columns={record.columns}
                />
            }

        }
        return <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={data}
            rowClassName={_getRowClassName}
            expandedRowRender={getRows}
            pagination={false}
        />

    }
}

export default NavTable;
