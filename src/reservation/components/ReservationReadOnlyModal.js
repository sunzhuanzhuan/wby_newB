import React from 'react';
import { Modal } from 'antd';
import './readOnlyContent/readyOnly.less';

//只读弹窗内容展示组件
import ExecuteContentDetail from '../components/readOnlyContent/ExecuteContent'
import ExecuteResult from '../components/readOnlyContent/ExecuteResult'
import DataScreenshot from '../components/readOnlyContent/DataScreenshot'
import GetQcHistory from '../components/readOnlyContent/GetQcHistory'

/**
 * @Author 黄晓顺
 *
 * @param data 父组件传来的显示你容
 * @param recod 标题调用内容数据
 * @time 2018-04-18 10:29
 * @Description 只读弹框出现 执行内容 结果，数据截图 你容展示方法
 */
const readOnlyConentList = (data, record) => {
	return {
		ExecuteContent: {
			title: `查看执行内容【订单号:${record.order_id} 账号名称:${record.account_name} 平台:${record.platform_name}】`,
			content: <ExecuteContentDetail content={data} platform_name={record.platform_name} />
		},
		ExecuteResult: {
			title: `查看执行结果【订单号：${record.order_id}账号名称：${record.account_name}平台：${record.platform_name}】`,
			content: <ExecuteResult content={data} />
		},
		DataScreenshot: {
			title: "查看数据截图",
			content: <DataScreenshot content={data} />
		},
		GetQcHistory: {
			title: "查看质检状态",
			content: <GetQcHistory content={data} />
		}
	}
};

const ReservationReadOnlyModal = (props) => {
	const { visible, records, readOnlyContent, type, onCancel } = props;
	return (
		<Modal
			visible={visible}
			maskClosable={false}
			title={readOnlyConentList(readOnlyContent, records)[type].title}
			width='55%'
			footer={null}
			onCancel={onCancel}
			wrapClassName="readOnlyModal"
		>
			{readOnlyConentList(readOnlyContent, records)[type].content}
		</Modal>
	);
};

export default ReservationReadOnlyModal;
