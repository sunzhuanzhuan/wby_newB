import React from 'react'
import { Table } from 'antd';

//定义表头
const columns = [
	{ title: '投放平台', dataIndex: 'platform', key: 'platform' },
	{
		title: '数据截图', dataIndex: 'dataimage', key: 'dataimage', render: (text) => {
			return <ul className='thumbnail_list clearfix'>{text.map((val, index) => {
				return <li key={index} className="thumbnail_img"><a href={val} target="_blank"><img src={val} alt="" width={70} /></a></li>
			})}</ul>
		}
	},
	{
		title: '数据', dataIndex: 'data', key: 'data', render: (text) => {
			return text.map((val, index) => {
				return <p key={index}>{val.display + ": " + val.value}</p>
			})
		}
	},
];

/**
 * @Author 黄晓顺
 * @param data 接口返回数据
 * @time 2018-04-18 10:29
 * @Description 处理接口数据拼接table的data数据 return Array
 */
const dataList = (data) => {
	let arr = [];
	data.map((val, index) => {
		arr.push({
			key: index,
			platform: val.platform_name,
			dataimage: val.imgs,
			data: val.records
		})
	});
	return arr;
};

const DataScreenshot = (props) => {
	const { content } = props;
	return (
		<Table columns={columns} dataSource={dataList(content.data.data_screenshots)} />
	)
};

export default DataScreenshot
