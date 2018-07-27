import React from 'react'
import './statistic.less'

export const Statistic = () => {
	return (
		<fieldset className="company-statistic">
			<legend>统计</legend>
			公司状态：
			共计<span>1209</span>，
			已成交且有商机<span>120</span>、
			已成交且无商机<span>120</span>、
			未成交且有商机<span>120</span>、
			未成交且无商机<span>120</span>
		</fieldset>
	)
}

