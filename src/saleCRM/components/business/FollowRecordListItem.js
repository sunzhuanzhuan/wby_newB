import React, { Component } from 'react';
import "./business.less";

class FollowRecordListItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			more: true,
			show: "none"
		};
	}
	componentDidMount() {
		let width = document.querySelector(".BusinessFollowUpComment-content").offsetWidth * 3;
		let comment = this.props.data.comment;
		if (comment) {
			let num = 0;
			for (var i = 0; i < comment.length; i++) {
				if (comment.charCodeAt(i) > 255) {
					num = num + 15
				} else {
					num = num + 8
				}
			}
			if (num > width) {
				this.setState({
					show: "block"
				})
			}
		}
	}
	//点击更多
	more = () => {
		this.setState({
			more: false
		})
	}
	//点击收起
	packUp = () => {
		this.setState({
			more: true
		})
	}
	render() {
		const { data } = this.props;
		return <ul className="clearUlStyle">
			<li>
				<div>{data.record_at}&nbsp;&nbsp;&nbsp;{data.record_type === 8 ? <span style={{ color: 'red' }}>{data.title}</span> : data.title}</div>
				{
					this.state.more === true ?
						<div className="BusinessFollowUpComment">
							<div className="BusinessFollowUpComment-content">
								{data.comment ? data.comment : ""}
								<div className="BusinessFollowUpComment-content-more"
									onClick={this.more}
									style={{ display: this.state.show }}
								>更多</div>
							</div>
						</div> :
						<div className="BusinessFollowUpComment">
							{data.comment}
							<span className="BusinessFollowUpComment-packUp"
								onClick={this.packUp}>收起</span>
						</div>
				}
			</li>
		</ul>
	}
}

export default FollowRecordListItem;
