import React, { Component } from 'react'
import CorrectionContent from './CorrectionContent'
import Attachments from './Attachments'

class AppealContent extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		const { attachments, comment, content, weiExecutionImg } = this.props;
		return (
			<div className='data-execution-result'>
				<table>
					<tbody>
						<tr>
							<td className='unqualified-reason-head'>
								已更正内容:
							</td>
							<td>
								<CorrectionContent
									content={content}
									label='申述'
									weiExecutionImg={weiExecutionImg}
								/>
							</td>
						</tr>

						<tr>
							<td>
								申述理由:
							</td>
							<td>
								{comment}
							</td>
						</tr>

						<tr>
							<td>附件:</td>
							<td>
								<Attachments
									attachments={attachments}
									width='50px'
									className="attachments-list"
								/>
							</td>
						</tr>
					</tbody>

				</table>
			</div>
		)
	}
}

export default AppealContent