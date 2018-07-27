import React, { Component } from 'react'
import UnqualifiedReasonsListForMediaModify from '../readOnlyContent/UnqualifiedReasonsListForMediaModify'

class DataExecutionResultsForMediaModify extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		const {
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
							<td className='unqualified-reason-head'>不合格原因:</td>
							<td>
								<UnqualifiedReasonsListForMediaModify
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
							<td>扣款比例：</td>
							<td>{chargeRatio}%</td>
						</tr>
					</tbody>

				</table>
			</div>
		)
	}
}

export default DataExecutionResultsForMediaModify