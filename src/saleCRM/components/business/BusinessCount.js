import React from 'react'
import PropTypes from 'prop-types'
import "./business.less";

function redcolor(num) { return <span style={{ color: 'red' }}>{num}</span> }

const StatisticsItem = ({ group = [] }) => {
	return <span>
		{
			group.map((item, key) => {
				const length = group.length
				return <span key={key}>
					{item.name}    {redcolor(item.total)} {(item.paused || item.paused == 0) ? `（已暂停${item.paused}）` : ''}
					{length - 1 > key ? length > 5 ? "；" : "、" : ''}
				</span>
			})
		}
	</span>
}
StatisticsItem.propTypes = {
	group: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		total: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]).isRequired
	}))
}


const BusinessCount = ({ statistics = [] }) => {
	return <div className='businessCount'>
		{
			statistics.map((item, key) => {
				return <p key={key}>
					{item.name}：共计  {redcolor(item.total)}，
					<StatisticsItem group={item.group} />
				</p>
			})
		}
	</div>
}
BusinessCount.propTypes = {
	statistics: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		total: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]).isRequired,
		group: PropTypes.array.isRequired
	}))
}
export default BusinessCount;
