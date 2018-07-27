import React from "react";
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

const CustomBreadcrumb = ({ bread = [] }) => {
	return <Breadcrumb separator=">">
		{
			bread.map(({ title, link }, n) => <Breadcrumb.Item key={n}>{link ?
				<Link to={link}>{title}</Link> : title}</Breadcrumb.Item>)
		}
	</Breadcrumb>
}

export default CustomBreadcrumb
