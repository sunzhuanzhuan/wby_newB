import React from 'react'


const GetQcHistory = (props) => {
	const content = props.content.data;
	let complaint = content.complaint ? <div className="quality-box">
		<h1>{content.complaint.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>不合格原因:</td>
				<td>
					<table className="quality-box-TableToTable">
						<tr>
							<th width='20%'>平台</th>
							<th width='40%'>执行结果不合格原因</th>
							<th width='40%'>数据截图不合格原因</th>
						</tr>
						{
							content.complaint.reasons.map((val, index) => {
								return (
									<tr key={index}>
										<td>{val.weibo_type_name}</td>
										<td>
											{val.execution_result_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
										<td>
											{val.data_screenshot_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
									</tr>
								)
							})
						}
					</table>
				</td>
			</tr>
			{
				content.complaint.attachments.length === 0 ?
					"" :
					<tr>
						<td>附件:</td>
						<td>
							{
								content.complaint.attachments.map((val, index) => {
									return (
										<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
									)
								})
							}

						</td>
					</tr>
			}
			{
				content.complaint.comment === "" ?
					"" :
					<tr>
						<td>备注:</td>
						<td>{content.complaint.comment}</td>
					</tr>
			}
			<tr>
				<td>投诉时间:</td>
				<td>{content.complaint.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*客户/销售投诉内容*/
	let complaint_confirmed = content.complaint_confirmed ? <div className="quality-box">
		<hr />
		<h1>{content.complaint_confirmed.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>扣款比例:</td>
				<td>{content.complaint_confirmed.charge_ratio + "%"}</td>
			</tr>
			<tr>
				<td>投诉时间:</td>
				<td>{content.complaint_confirmed.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检员确认投诉内容*/
	let complaint_modified = content.complaint_modified ? <div className="quality-box">
		<hr />
		<h1>{content.complaint_modified.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>不合格原因:</td>
				<td>
					<table className="quality-box-TableToTable">
						<tr>
							<th>平台</th>
							<th width='40%'>执行结果不合格原因</th>
							<th width='40%'>数据截图不合格原因</th>
						</tr>
						{
							content.complaint_modified.reasons.map((val, index) => {
								return (
									<tr key={index}>
										<td>{val.weibo_type_name}</td>
										<td>
											{val.execution_result_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
										<td>
											{val.data_screenshot_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
									</tr>
								)
							})
						}
					</table>
				</td>
			</tr>
			{
				content.complaint_modified.attachments.length === 0 ?
					"" :
					<tr>
						<td>附件:</td>
						<td>
							{
								content.complaint_modified.attachments.map((val, index) => {
									return (
										<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
									)
								})
							}
						</td>
					</tr>
			}
			{
				content.complaint_modified.comment === "" ?
					"" :
					<tr>
						<td>备注:</td>
						<td>{content.complaint_modified.comment}</td>
					</tr>
			}
			<tr>
				<td>扣款比例:</td>
				<td>{content.complaint_modified.charge_ratio + "%"}</td>
			</tr>
			<tr>
				<td>投诉修改时间:</td>
				<td>{content.complaint_modified.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检员修改投诉内容*/
	let complaint_rejected = content.complaint_rejected ? <div className="quality-box">
		<hr />
		<h1>{content.complaint_rejected.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>驳回理由:</td>
				<td>{content.complaint_rejected.comment}</td>
			</tr>
			<tr>
				<td>驳回时间:</td>
				<td>{content.complaint_rejected.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检员驳回投诉待质检主管确认*/
	let complaint_rejection_agreed = content.complaint_rejection_agreed ? <div className="quality-box">
		<hr />
		<h1>{content.complaint_rejection_agreed.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>质检结果:</td>
				<td>{content.complaint_rejection_agreed.result_display}</td>
			</tr>
			{/* <tr>
				<td>扣款比例:</td>
				<td>{content.charge_ratio + "%"}</td>
			</tr> */}
			<tr>
				<td>质检时间:</td>
				<td>{content.complaint_rejection_agreed.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检主管同意驳回*/
	let complaint_rejection_refused = content.complaint_rejection_refused ? <div className="quality-box">
		<hr />
		<h1>{content.complaint_rejection_refused.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>不合格原因:</td>
				<td>
					<table className="quality-box-TableToTable">
						<tr>
							<th>平台</th>
							<th width='40%'>执行结果不合格原因</th>
							<th width='40%'>数据截图不合格原因</th>
						</tr>
						{
							content.complaint_rejection_refused.reasons.map((val, index) => {
								return (
									<tr key={index}>
										<td>{val.weibo_type_name}</td>
										<td>
											{val.execution_result_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
										<td>
											{val.data_screenshot_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
									</tr>
								)
							})
						}
					</table>
				</td>
			</tr>
			{
				content.complaint_rejection_refused.attachments.length === 0 ?
					"" :
					<tr>
						<td>附件:</td>
						<td>
							{
								content.complaint_rejection_refused.attachments.map((val, index) => {
									return (
										<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
									)
								})
							}
						</td>
					</tr>
			}
			{
				content.complaint_rejection_refused.comment === "" ?
					"" :
					<tr>
						<td>备注:</td>
						<td>{content.complaint_rejection_refused.comment}</td>
					</tr>
			}
			<tr>
				<td>扣款比例:</td>
				<td>{content.complaint_rejection_refused.charge_ratio + "%"}</td>
			</tr>
			<tr>
				<td>质检时间:</td>
				<td>{content.complaint_rejection_refused.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检主管拒绝驳回*/
	let direct_qc_unqualified = content.direct_qc_unqualified ? <div className="quality-box">
		<hr />
		<h1>{content.direct_qc_unqualified.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>不合格原因:</td>
				<td>
					<table className="quality-box-TableToTable">
						<tr>
							<th>平台</th>
							<th width='40%'>执行结果不合格原因</th>
							<th width='40%'>数据截图不合格原因</th>
						</tr>
						{
							content.direct_qc_unqualified.reasons.map((val, index) => {
								return (
									<tr key={index}>
										<td>{val.weibo_type_name}</td>
										<td>
											{val.execution_result_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
										<td>
											{val.data_screenshot_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
									</tr>
								)
							})
						}
					</table>
				</td>
			</tr>
			{
				content.direct_qc_unqualified.attachments.length === 0 ?
					"" :
					<tr>
						<td>附件:</td>
						<td>
							{
								content.direct_qc_unqualified.attachments.map((val, index) => {
									return (
										<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
									)
								})
							}
						</td>
					</tr>
			}
			{
				content.direct_qc_unqualified.comment === "" ?
					"" :
					<tr>
						<td>备注:</td>
						<td>{content.direct_qc_unqualified.comment}</td>
					</tr>
			}
			<tr>
				<td>扣款比例:</td>
				<td>{content.direct_qc_unqualified.charge_ratio + "%"}</td>
			</tr>
			<tr>
				<td>质检时间:</td>
				<td>{content.direct_qc_unqualified.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检员质检不合格*/
	let direct_qc_qualified = content.direct_qc_qualified ? <div className="quality-box">
		<hr />
		<h1>{content.direct_qc_qualified.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>质检结果:</td>
				<td>{content.direct_qc_qualified.result_display}</td>
			</tr>
			{
				content.direct_qc_qualified.comment === "" ?
					"" :
					<tr>
						<td>备注:</td>
						<td>{content.direct_qc_qualified.comment}</td>
					</tr>
			}
			<tr>
				<td>质检时间:</td>
				<td>{content.direct_qc_qualified.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检合格*/
	let appeal = content.appeal ? <div className="quality-box">
		<hr />
		<h1>{content.appeal.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>申请理由:</td>
				<td>{content.appeal.comment}</td>
			</tr>
			{
				content.appeal.attachments.length === 0 ?
					"" :
					<tr>
						<td>附件:</td>
						<td>
							{
								content.appeal.attachments.map((val, index) => {
									return (
										<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
									)
								})
							}
						</td>
					</tr>
			}
			<tr>
				<td>已更正内容:</td>
				<td>
					{content.appeal.result.map((val, index) => {
						return (
							<table className="quality-box-TableToTable" key={index}>
								<colgroup>
									<col style={{ width: 90 }} />
									<col className="ant-col-18" />
								</colgroup>
								<tbody>
									<tr>
										<th>平台</th><td>{val.weibo_type_name}</td>
									</tr>
									<tr>
										<th>执行链接</th>
										<td>
											<a href={val.execution_result_link} style={{ "display": val.weibo_type === 1 ? "none" : "block" }} target="_blank">
												{val.execution_result_link}
											</a>
											<a href={val.execution_result_link} style={{ "display": val.weibo_type === 1 ? "block" : "none" }} target="_blank">
												{val.execution_result_link}
											</a>
										</td>
									</tr>
									<tr>
										<th>执行截图</th>
										<td>
											{val.execution_result_img.map((val, index) => {
												return (
													<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
												)
											})
											}
										</td>
									</tr>
									<tr>
										<th>数据截图</th>
										<td>
											{val.data_screenshot_path.map((val, index) => {
												return (
													<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
												)
											})
											}
										</td>
									</tr>
									<tr>
										<th>数据</th>
										<td>
											{val.record_for_media.map((val, index) => {
												return (
													<div key={index} className="ant-col-8">{val.display + ": " + val.value}</div>
												)
											})
											}
										</td>
									</tr>
								</tbody>

							</table>
						)
					})
					}

				</td>
			</tr>
			<tr>
				<td>申请时间:</td>
				<td>{content.appeal.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*账号/媒介已申诉*/
	let first_qc_result_agree = content.first_qc_result_agree ? <div className="quality-box">
		<hr />
		<h1>{content.first_qc_result_agree.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>质检结果:</td>
				<td>{content.first_qc_result_agree.result_display}</td>
			</tr>
			<tr>
				<td>扣款比例:</td>
				<td>{content.first_qc_result_agree.charge_ratio + "%"}</td>
			</tr>
			<tr>
				<td>同意质检时间:</td>
				<td>{content.first_qc_result_agree.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*账号/媒介同意质检结果*/
	let appeal_qualified = content.appeal_qualified ? <div className="quality-box">
		<hr />
		<h1>{content.appeal_qualified.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>质检结果:</td>
				<td>{content.appeal_qualified.result_display}</td>
			</tr>
			{
				content.appeal_qualified.comment === "" ?
					"" :
					<tr>
						<td>备注:</td>
						<td>{content.appeal_qualified.comment}</td>
					</tr>
			}
			<tr>
				<td>质检时间:</td>
				<td>{content.appeal_qualified.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*申诉合格待质检主管确认*/
	let appeal_unqualified = content.appeal_unqualified ? <div className="quality-box">
		<hr />
		<h1>{content.appeal_unqualified.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>不合格原因:</td>
				<td>
					<table className="quality-box-TableToTable">
						<tr>
							<th>平台</th>
							<th width='40%'>执行结果不合格原因</th>
							<th width='40%'>数据截图不合格原因</th>
						</tr>
						{
							content.appeal_unqualified.reasons.map((val, index) => {
								return (
									<tr key={index}>
										<td>{val.weibo_type_name}</td>
										<td>
											{val.execution_result_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
										<td>
											{val.data_screenshot_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
									</tr>
								)
							})
						}
					</table>
				</td>
			</tr>
			<tr>
				<td>重新处理说明:</td>
				<td>{content.appeal_unqualified.comment}</td>
			</tr>
			<tr>
				<td>扣款比例:</td>
				<td>{content.appeal_unqualified.charge_ratio + "%"}</td>
			</tr>
			<tr>
				<td>质检时间:</td>
				<td>{content.appeal_unqualified.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*申诉不合格待媒介修改*/
	let media_modify = content.media_modify ? <div className="quality-box">
		<hr />
		<h1>{content.media_modify.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>媒介修改说明:</td>
				<td>{content.media_modify.comment}</td>
			</tr>
			{
				content.media_modify.attachments.length === 0 ?
					"" :
					<tr>
						<td>附件:</td>
						<td>
							{
								content.media_modify.attachments.map((val, index) => {
									return (
										<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
									)
								})
							}
						</td>
					</tr>
			}
			<tr>
				<td>已更正内容:</td>
				<td>
					{content.media_modify.result.map((val, index) => {
						return (
							<table className="quality-box-TableToTable" key={index}>
								<colgroup>
									<col style={{ width: 90 }} />
									<col className="ant-col-18" />
								</colgroup>
								<tr>
									<th>平台</th>
									<td>{val.weibo_type_name}</td>
								</tr>
								<tr>
									<th>执行链接</th>
									<td>
										<a href={val.execution_result_link} style={{ "display": val.weibo_type === 1 ? "none" : "block" }} target="_blank">
											{val.execution_result_link}
										</a>
										<a href={val.execution_result_link} style={{ "display": val.weibo_type === 1 ? "block" : "none" }} target="_blank">
											{val.execution_result_link}
										</a>
									</td>
								</tr>
								<tr>
									<th>执行截图</th>
									<td>
										{val.execution_result_img.map((val, index) => {
											return (
												<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
											)
										})
										}
									</td>
								</tr>
								<tr>
									<th>数据截图</th>
									<td>
										{val.data_screenshot_path.map((val, index) => {
											return (
												<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
											)
										})
										}
									</td>
								</tr>
								<tr>
									<th>数据</th>
									<td>
										{val.record_for_media.map((val, index) => {
											return (
												<div key={index} className="ant-col-8">{val.display + ": " + val.value}</div>
											)
										})
										}
									</td>
								</tr>
							</table>
						)
					})
					}

				</td>
			</tr>
			<tr>
				<td>修改时间:</td>
				<td>{content.media_modify.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*媒介已修改不合格内容*/
	let paused_comment = content.paused_comment ? <div className="quality-box">
		<hr />
		<h1>{content.paused_comment.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>暂停说明:</td>
				<td>{content.paused_comment.comment}</td>
			</tr>
			<tr>
				<td>暂停时间:</td>
				<td>{content.paused_comment.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检主管暂停质检*/
	let inspector_manager_qc_qualified = content.inspector_manager_qc_qualified ? <div className="quality-box">
		<hr />
		<h1>{content.inspector_manager_qc_qualified.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>质检结果:</td>
				<td>{content.inspector_manager_qc_qualified.result_display}</td>
			</tr>
			{
				content.inspector_manager_qc_qualified.comment === "" ?
					"" :
					<tr>
						<td>备注:</td>
						<td>{content.inspector_manager_qc_qualified.comment}</td>
					</tr>
			}
			<tr>
				<td>质检时间:</td>
				<td>{content.inspector_manager_qc_qualified.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检主管质检合格*/
	let inspector_manager_qc_unqualified = content.inspector_manager_qc_unqualified ? <div className="quality-box">
		<hr />
		<h1>{content.inspector_manager_qc_unqualified.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>质检结果:</td>
				<td>质检不合格</td>
			</tr>
			<tr>
				<td>不合格原因:</td>
				<td>
					<table className="quality-box-TableToTable">
						<tr>
							<th>平台</th>
							<th width='40%'>执行结果不合格原因</th>
							<th width='40%'>数据截图不合格原因</th>
						</tr>
						{
							content.inspector_manager_qc_unqualified.reasons.map((val, index) => {
								return (
									<tr key={index}>
										<td>{val.weibo_type_name}</td>
										<td>
											{val.execution_result_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
										<td>
											{val.data_screenshot_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
									</tr>
								)
							})
						}
					</table>
				</td>
			</tr>
			{
				content.inspector_manager_qc_unqualified.attachments.length === 0 ?
					"" :
					<tr>
						<td>附件:</td>
						<td>
							{
								content.inspector_manager_qc_unqualified.attachments.map((val, index) => {
									return (
										<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
									)
								})
							}
						</td>
					</tr>
			}
			{
				content.inspector_manager_qc_unqualified.comment === "" ?
					"" :
					<tr>
						<td>备注:</td>
						<td>{content.inspector_manager_qc_unqualified.comment}</td>
					</tr>
			}
			<tr>
				<td>扣款比例:</td>
				<td>{content.inspector_manager_qc_unqualified.charge_ratio + "%"}</td>
			</tr>
			<tr>
				<td>质检时间:</td>
				<td>{content.entry_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检主管质检不合格*/
	let final_qc_expired = content.final_qc_expired ? <div className="quality-box">
		<hr />
		<h1>{content.final_qc_expired.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>质检结果:</td>
				<td>{content.final_qc_expired.result_display}</td>
			</tr>
			<tr>
				<td>扣款比例:</td>
				<td>{content.final_qc_expired.charge_ratio + "%"}</td>
			</tr>
			<tr>
				<td>质检时间:</td>
				<td>{content.final_qc_expired.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检主管质检不合格*/
	let complaint_expired_unqualified = content.complaint_expired_unqualified ? <div className="quality-box">
		<hr />
		<h1>{content.complaint_expired_unqualified.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>扣款比例:</td>
				<td>{content.complaint_expired_unqualified.charge_ratio + "%"}</td>
			</tr>
			<tr>
				<td>驳回过期时间:</td>
				<td>{content.complaint_expired_unqualified.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检员投诉过期未确认*/
	let complaint_rejection_expired_unqualified = content.complaint_rejection_expired_unqualified ? <div className="quality-box">
		<hr />
		<h1>{content.complaint_rejection_expired_unqualified.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>不合格原因:</td>
				<td>
					<table className="quality-box-TableToTable">
						<tr>
							<th>平台</th>
							<th width='40%'>执行结果不合格原因</th>
							<th width='40%'>数据截图不合格原因</th>
						</tr>
						{
							content.complaint_rejection_expired_unqualified.reasons.map((val, index) => {
								return (
									<tr key={index}>
										<td>{val.weibo_type_name}</td>
										<td>
											{val.execution_result_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
										<td>
											{val.data_screenshot_reasons.map((val, index) => {
												return (
													<ul key={index} className="reservation_fail_reason_list">
														<li style={{ "display": parseInt(val.checked) === 1 && parseInt(val.id) !== 1 ? "block" : "none" }}>{val.content}</li>
														<li style={{ "display": parseInt(val.id) === 1 && parseInt(val.checked) === 1 ? "block" : "none" }}>{val.comment}</li>
													</ul>
												)
											})
											}
										</td>
									</tr>
								)
							})
						}
					</table>
				</td>
			</tr>
			{
				content.complaint_rejection_expired_unqualified.attachments.length === 0 ?
					"" :
					<tr>
						<td>附件:</td>
						<td>
							{
								content.complaint_rejection_expired_unqualified.attachments.map((val, index) => {
									return (
										<a href={val} key={index} target="_blank"><img src={val} alt="" /></a>
									)
								})
							}
						</td>
					</tr>
			}
			{
				content.complaint_rejection_expired_unqualified.comment === "" ?
					"" :
					<tr>
						<td>备注:</td>
						<td>{content.complaint_rejection_expired_unqualified.comment}</td>
					</tr>
			}
			<tr>
				<td>扣款比例:</td>
				<td>{content.complaint_rejection_expired_unqualified.charge_ratio + "%"}</td>
			</tr>
			<tr>
				<td>确认过期时间:</td>
				<td>{content.complaint_rejection_expired_unqualified.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*驳回过期未确认*/

	let second_qc_expired_unqualified = content.second_qc_expired_unqualified ? <div className="quality-box">
		<hr />
		<h1>{content.second_qc_expired_unqualified.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>质检结果:</td>
				<td>{content.second_qc_expired_unqualified.result_display}</td>
			</tr>
			<tr>
				<td>扣款比例:</td>
				<td>{content.second_qc_expired_unqualified.charge_ratio + "%"}</td>
			</tr>
			<tr>
				<td>质检时间:</td>
				<td>{content.second_qc_expired_unqualified.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检主管过期未处理，质检不合格*/

	let second_qc_expired_qualified = content.second_qc_expired_qualified ? <div className="quality-box">
		<hr />
		<h1>{content.second_qc_expired_qualified.module_title}</h1>
		<table className="quality-box-Table">
			<tr>
				<td>质检结果:</td>
				<td>{content.second_qc_expired_qualified.result_display}</td>
			</tr>
			<tr>
				<td>质检时间:</td>
				<td>{content.second_qc_expired_qualified.created_at}</td>
			</tr>
		</table>
	</div> : <div style={{ "display": "none" }}>暂无数据</div>;/*质检主管过期未处理，质检合格*/
	return (
		<div>
			{/*客户/销售投诉内容*/}
			{complaint}

			{/*质检员确认投诉内容*/}
			{complaint_confirmed}

			{/*质检员修改投诉内容*/}
			{complaint_modified}

			{/*质检员驳回投诉待质检主管确认*/}
			{complaint_rejected}

			{/*驳回过期未确认*/}
			{complaint_rejection_expired_unqualified}

			{/*质检主管同意驳回*/}
			{complaint_rejection_agreed}

			{/*质检主管拒绝驳回*/}
			{complaint_rejection_refused}

			{/*质检员质检不合格*/}
			{direct_qc_unqualified}

			{/*质检合格*/}
			{direct_qc_qualified}

			{/*质检员投诉过期未确认*/}
			{complaint_expired_unqualified}

			{/*账号/媒介同意质检结果*/}
			{first_qc_result_agree}

			{/*账号/媒介已申诉*/}
			{appeal}

			{/*申诉合格待质检主管确认*/}
			{appeal_qualified}

			{/*申诉不合格待媒介修改*/}
			{appeal_unqualified}

			{/*媒介已修改不合格内容*/}
			{media_modify}

			{/*质检主管暂停质检*/}
			{paused_comment}

			{/*质检主管质检合格*/}
			{inspector_manager_qc_qualified}

			{/*质检主管质检不合格*/}
			{inspector_manager_qc_unqualified}

			{/*质检主管过期未质检*/}
			{final_qc_expired}

			{/*质检主管过期未处理，质检不合格*/}
			{second_qc_expired_unqualified}

			{/*质检主管过期未处理，质检合格*/}
			{second_qc_expired_qualified}
		</div>

	)
};

export default GetQcHistory
