import React from 'react'

const ExecuteContentDetail = (props) => {
	const { platform_name } = props;
	const { data } = props.content;
	let Item;
	if (platform_name === "微信公众号") {
		if (data.execution_type.find(item => parseInt(item.execution_type) === 0).checked === 1) {
			Item = <tr>
				<td>执行内容或要求:</td>
				<td className="special-td" dangerouslySetInnerHTML={{ __html: data.content }}></td>
			</tr>
		} else {
			Item = <tr>
				<td>文章标题:</td>
				<td>{data.title}</td>
			</tr>
		}
	} else if (platform_name === "新浪微博") {
		if (data.execution_type.find(item => parseInt(item.execution_type) === 1).checked === 1) {
			Item = <tr>
				<td>直发内容:</td>
				<td dangerouslySetInnerHTML={{ __html: data.content }}></td>
			</tr>
		} else if (data.execution_type.find(item => parseInt(item.execution_type) === 2).checked === 1) {
			Item = <tr>
				<td>
					<div>转发链接:</div>
					<div>转发语:</div>
				</td>
				<td>
					<div><a href={data.link} target="_blank">{data.link}</a></div>
					<div dangerouslySetInnerHTML={{ __html: data.content }}></div>
				</td>
			</tr>
		} else {
			Item = <tr>
				<td>执行内容或要求:</td>
				<td className="special-td" dangerouslySetInnerHTML={{ __html: data.content }}></td>
			</tr>
		}
	} else {
		Item = <tr>
			<td>执行内容或要求:</td>
			<td className="special-td" dangerouslySetInnerHTML={{ __html: data.content }}></td>
		</tr>
	}
	return (
		<div className="execute-content-box">
			<table>
				<tbody>
					<tr>
						<td width={140}>执行类型:</td>
						<td>
							{data.execution_type.map((val, index) => {
								return <div key={index} style={{ "display": parseInt(val.checked) === 1 ? "block" : "none" }}>{val.name}</div>
							})
							}
						</td>
					</tr>
					{Item}
					<tr>
						<td>是否含有视频/直播:</td>
						<td>

							{data.video_types.map((val, index) => {
								return <div key={index} style={{ "display": parseInt(val.select) === 1 ? "block" : "none" }}>{val.name}</div>
							})
							}
						</td>
					</tr>
					<tr>
						<td>分发平台:</td>
						<td>
							{data.platform.map((val, index) => {
								return <span key={index} style={{ marginRight: "5px" }}>{val.platform_name}</span>
							})
							}
						</td>
					</tr>
					<tr>
						<td>执行时间:</td>
						<td>{data.start_time + " - " + data.end_time}</td>
					</tr>
					<tr>
						<td>附件:</td>
						<td>
							{data.attachment.map((val, index) => {
								return <div key={index}><a href={val.file_path} target="_blank">{val.original_name}</a></div>
							})
							}

						</td>
					</tr>
					<tr>
						<td>备注(账号可见):</td>
						<td>{data.comment}</td>
					</tr>
					<tr>
						<td>备注(媒介可见):</td>
						<td>{data.comment_for_media}</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
};

export default ExecuteContentDetail
