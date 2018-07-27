import React, { Component } from 'react'

import { Pagination } from "antd";
import "./business.less";
import FollowRecordListItem from "./FollowRecordListItem";
class FollowRecordList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	//分页
	changePage = (page) => {
		this.props.changePage(page)
	}
	render() {
		const { followUpList } = this.props;
		/**
		 * 参数说明fllowlist(时间 根进类型  跟进人 跟进备注)
		 */
		return (
			<div className='followRecordList'>
				{
					followUpList.list && followUpList.list.map((item) => {
						return <FollowRecordListItem key={item.id} data={item} />
					})
				}
				<Pagination className="pagination"
					current={parseInt(followUpList.page)}
					total={followUpList.count}
					pageSize='20'
					onChange={this.changePage}
				/>
			</div>
		);
	}
}

export default FollowRecordList;

