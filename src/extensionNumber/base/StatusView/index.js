import React from 'react'
import { Badge } from 'antd'

/**
 * @return {null}
 */
export default function StausView(props) {
    let status = props.status || null
    let map = {
        '未入库': 'error',
        '已上架': 'success',
        '已下架': 'warning',
        '抓取中': 'processing',
        '抓取失败': 'default',
        '拓号终止': 'default',
        '待拓号': 'processing',
        '拓号完成': 'success',
    }
    return (status ? <Badge status={map[status] || 'default'} text={status} /> : null)
}
