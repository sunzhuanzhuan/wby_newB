import React, { Component } from 'react'
import { Input, Icon } from 'antd';
import './hoverItem.css'
import {
	DragSource,
	DropTarget,
} from 'react-dnd'

const ItemSource = {
	beginDrag(CardProps) {
		return {
			id: CardProps.id,
			index: CardProps.index
		}
	},
	endDrag(CardProps, DropTargetMonitor) {
		const targetIndex = DropTargetMonitor.getItem().index
		const startIndex = CardProps.index

		//如果两个索引值一样就不再执行
		if (targetIndex === startIndex) {
			return
		}
		CardProps.setHoverIndex('')

		CardProps.moveItem(targetIndex, startIndex)
	}
}

const ItemTarget = {
	hover(CardProps, DropTargetMonitor) {
		const dragIndex = DropTargetMonitor.getItem().index
		const hoverIndex = CardProps.index

		if (dragIndex === hoverIndex) {
			return
		}

		CardProps.setHoverIndex(hoverIndex)

		DropTargetMonitor.getItem().index = hoverIndex
	},
	drop(CardProps) {
		CardProps.setHoverIndex('')
	}
}
@DropTarget('card', ItemTarget, DropTargetConnector => ({
	connectDropTarget: DropTargetConnector.dropTarget(),
}))
@DragSource(
	'card',
	ItemSource,
	(DragSourceConnector, DragSourceMonitor) => ({
		connectDragSource: DragSourceConnector.dragSource(),
		isDragging: DragSourceMonitor.isDragging()
	})
)
class EditInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		}
	}
	display() {
		this.setState({
			show: true
		})
	}
	hide() {
		const newField = this.input.input.value;
		this.setState({
			show: false
		})
		this.props.updateFieldName(newField)
	}
	render() {
		const {
			dataId,
			text,
			isDragging,
			connectDragSource,
			connectDropTarget,
			className
		} = this.props
		const opacity = isDragging ? 0 : 1;
		let display = this.display.bind(this);
		return (
			<div style={{ opacity }}>
				{
					this.state.show
						?
						<Input
							ref={e => this.input = e}
							onBlur={this.hide.bind(this)}
							onFocus={display}
							autoFocus={true}
							id={dataId}
							defaultValue={text}
						/>
						: connectDragSource &&
						connectDropTarget &&
						connectDragSource(
							connectDropTarget(
								<span
									onClick={display}
									className={className}
								>
									<Icon
										type="tags-o"
										style={{ color: '#1DA57A' }}
									/>
									{this.props.text}
								</span>
							)
						)
				}
			</div>

		)
	}
}
export default EditInput;
