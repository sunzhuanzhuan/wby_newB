import React from 'react'
import VerticalAlignTable from "./VerticalAlignTable";
function modelTitle(title, detail) {
	return <div>
		<h4 style={{ float: 'left', paddingRight: 5 }}>{title}</h4>
		<div style={{ fontWeight: 400, fontSize: 13, paddingRight: 8, opacity: 0.7 }}>商机名称：{detail}</div>
	</div>
}
export default props => {
	const { record, showModal } = props
	const commentLength = record.comment && record.comment.length || 0
	const title = modelTitle("跟进备注", ` ${record.name}`)
	const list = [{
		title: '跟进时间：',
		detail: record.record_at
	}, {
		title: '跟进类型：',
		detail: record.record_type_name
	}, {
		title: '跟进备注：',
		detail: record.comment
	}]
	const content = <VerticalAlignTable list={list} />
	return <div>
		<p>跟进时间：{record.record_at}</p>
		<p>跟进类型：{record.record_type_name}</p>
		<p><div style={{ float: 'left' }}>跟进备注：</div>{commentLength === 0 ? '-' : <div style={{ float: 'left' }}>
			{record.comment.slice(0, 10)}<br />
			{record.comment.slice(10, 18)}
			{commentLength > 18 ? <a onClick={() => { showModal(title, content) }}>{'更多>>'}</a> : null}
		</div>}</p>
	</div>
}
