import React from 'react'
import { Popover } from 'antd'

const showContent = ({ price, thirdChargePrice, remainPrice }) => (
	<div className='chargePrice'>
		<ul>
			<li>
				<span>
					订单成本：
				</span>

				<span>
					{price}
				</span>
			</li>
			<li>
				<span>
					第三方扣款金额：
				</span>

				<span>
					{thirdChargePrice}
				</span>
			</li>
			<li>
				<span>
					剩余订单成本：
				</span>

				<span>
					{remainPrice}
				</span>
			</li>
		</ul>
	</div>
)
/**
 * @desc 第三方扣款为空或者没有权限时只显示第三方扣款按钮，不显示Popover
 *
 * @param price 订单成本
 * @param thirdChargePrice 第三方扣款
 * @param remainPrice 剩余订单成本
 * @param showThirdChargePay 根据权限判断是否展示
 * @returns {XML}
 * @constructor
 */
const ThirdChargePaid = ({ price, thirdChargePrice, remainPrice, showThirdChargePay }) => {
	return thirdChargePrice === null || showThirdChargePay !== true
		? <div className="thirdPartyLogo">第三方扣款</div>
		: <Popover
			content={showContent({ price, thirdChargePrice, remainPrice })}
			title="第三方扣款金额"
			trigger="hover"
		>
			<div className="thirdPartyLogo">第三方扣款</div>
		</Popover>
}
export default ThirdChargePaid