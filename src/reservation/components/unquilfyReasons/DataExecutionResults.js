import React, { Component } from 'react'
import UnqualifiedReasonsList from '../readOnlyContent/UnqualifiedReasonsList'
import Attachments from '../readOnlyContent/Attachments'

import '../readOnlyContent/attachments.css'

class DataExecutionResults extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		const {
			attachments,
			chargeRatio,
			comment,
			executionResult,
			weiExecutionImg,
			title
		} = this.props;

		return (
			<div className='data-execution-result'>
				<table>
					<tbody>
						<tr>
							<td className='unqualified-reason-head'>不合格原因：</td>
							<td>
								<UnqualifiedReasonsList
									reasons={executionResult}
									weiExecutionImg={weiExecutionImg}
								/>
							</td>
						</tr>

						<tr>
							<td>{title}：</td>
							<td>{comment}</td>
						</tr>

						<tr>
							<td>附件：</td>
							<td className='attachments'>
								<Attachments
									attachments={attachments}
									className="attachments-list "
								/>
							</td>
						</tr>

						<tr>
							<td>扣款比例：</td>
							<td>{chargeRatio}%</td>
						</tr>
					</tbody>

				</table>
			</div>
		)
	}
}

export default DataExecutionResults