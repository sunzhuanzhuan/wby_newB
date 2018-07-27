import React from 'react'
import { Table } from 'antd';

//定义表头
const columns = [
	{ title: '投放平台', dataIndex: 'platform', key: 'platform', width: '15%' },
	{
		title: '执行链接', dataIndex: 'carriedlink', key: 'carriedlink', width: '55%', render: (text) => <a href={text} target="_blank">{text}</a>
	},
	{
		title: '执行截图', dataIndex: 'resultimgs', key: 'resultimgs', width: '30%', render: ((text) => {
			return <ul className='thumbnail_list clearfix'>{text.map((val, index) => {
				return <li key={index} className="thumbnail_img"><a href={val} target="_blank"><img src={val} alt="" width={70} /></a></li>
			})}</ul>
		})
	},
];

/**
 * @Author 黄晓顺
 * @param data 接口返回数据
 * @time 2018-04-18 13:35
 * @Description 处理接口数据拼接table的data数据 return Array
 */
const dataList = (data) => {
	let arr = [];
	data.map((val, index) => {
		arr.push({
			key: index,
			platform: val.platform_name,
			carriedlink: val.platform_id === 1 ? val.converted_link : val.link,
			resultimgs: val.imgs,
		})
	});
	return arr;
};

const ExecuteResult = (props) => {
	const { content } = props;
	return (
		<Table columns={columns} dataSource={dataList(content.data.backfill_results)} />

	)
};

export default ExecuteResult
