import React from 'react'
import { Popover } from 'antd'

export default function ViewMoreText(props) {
    let { content, title, threshold = 16 } = props

    return (content.length > threshold ?
        <Popover content={
            <p className='m0' style={{
                maxWidth: '400px',
                textIndent: '2em',
                maxHeight: '320px',
                overflowY: 'auto',
            }}>{content}</p>} title={title}>
            <p className='tl m0'> {content.slice(0, threshold)}...</p>
        </Popover> : <span>{content}</span>)
}
