import React, { Component } from "react"
import { Button, Row, Col, Modal } from 'antd'
import ImageList from '../../base/ImageList'
import HeadTitle from "../../base/HeadTitle";
import './companyInMainTab.less'
import ViewPhoneNumber from "../../base/ViewPhoneNumber";

export default class CompanyInMainTab extends Component {
	state = {
		editBaseInfoModal: false,
		editContactInfo: true,
		editOtherInfo: true,
	}

	componentWillMount() {}

	render() {
		const imglist = [
			'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1530006731&di=eeec8f6f23351e69e431089985ecb347&src=http://www.hnmxzx.com/uploads/allimg/121201/1-1212010T044649.jpg',
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530611567&di=8e2b8d9ea6c7224b15240c54cbfb9ad7&imgtype=jpg&er=1&src=http%3A%2F%2Fimg.atobo.com%2FUserFiles%2FCertificate%2F1%2F8%2F8%2F2%2F320%2F1882320%2FBig%2F2013_4_10_13_55_41_9055.jpg',
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530016560160&di=18140c9f26a430ec4f908513ab0ad4b8&imgtype=0&src=http%3A%2F%2Fwww.nanyangcable.cn%2Fasp%2FUploadFiles%2F20137810938532.jpg'
		]
		const { editBaseInfoModal } = this.state
		return <div className='main-tab-container'>
			<HeadTitle title='公司' type='h3' desc={
				<p>主体名称：蒙牛 <a href="#">取消关联</a></p>} />
			<HeadTitle title='基本信息' type='h4' desc={
				<Button type='primary' size='small'>编辑</Button>} />
			<section className='container baseinfo'>
				<Row>
					<Col span={4}>
						<div className='baseinfo-items tr'>公司简称：</div>
					</Col>
					<Col span={8}>
						<div className='baseinfo-items'>蒙牛乳业</div>
					</Col>
					<Col span={4} className='tr'>
						<div className='baseinfo-items tr'>年度投放预算：</div>
					</Col>
					<Col span={8}>
						<div className='baseinfo-items'>100w-500w</div>
					</Col>
				</Row>
				<Row>
					<Col span={4} className='tr'>
						<div className='baseinfo-items tr'>公司资质：</div>
					</Col>
					<Col span={20}>
						<div className='baseinfo-items'>
							<ImageList itemStyle={{
								width: 140,
								height: 100
							}} list={imglist} />
						</div>
					</Col>
				</Row>
			</section>
			<HeadTitle title='联系人信息' type='h4' desc={
				<Button type='primary' size='small'>编辑</Button>} />
			<section className='container contactinfo'>
				<ul>
					<li className='contactinfo-items'>
						<Row>
							<Col span={4}>
								<div className='items tr'>联系人：</div>
							</Col>
							<Col span={8}>
								<div className='items'>姓名</div>
							</Col>
							<Col span={4} className='tr'>
								<div className='items tr'>手机号：</div>
							</Col>
							<Col span={8}>
								<div className='items'>
									<ViewPhoneNumber uid={111}/>
								</div>
							</Col>
						</Row>
						<Row>
							<Col span={4}>
								<div className='items tr'>邮箱：</div>
							</Col>
							<Col span={8}>
								<div className='items'>-</div>
							</Col>
							<Col span={4} className='tr'>
								<div className='items tr'>QQ：</div>
							</Col>
							<Col span={8}>
								<div className='items'>-</div>
							</Col>
						</Row>
						<span className='tags default'>默认</span>
					</li>
					<li className='contactinfo-items'>
						<Row>
							<Col span={4}>
								<div className='items tr'>联系人：</div>
							</Col>
							<Col span={8}>
								<div className='items'>姓名</div>
							</Col>
							<Col span={4} className='tr'>
								<div className='items tr'>手机号：</div>
							</Col>
							<Col span={8}>
								<div className='items'>
									<ViewPhoneNumber uid={222}/>
								</div>
							</Col>
						</Row>
						<Row>
							<Col span={4}>
								<div className='items tr'>邮箱：</div>
							</Col>
							<Col span={8}>
								<div className='items'>-</div>
							</Col>
							<Col span={4} className='tr'>
								<div className='items tr'>QQ：</div>
							</Col>
							<Col span={8}>
								<div className='items'>-</div>
							</Col>
						</Row>
					</li>
				</ul>
			</section>
			<HeadTitle title='其他信息' type='h4' desc={
				<Button type='primary' size='small'>编辑</Button>} />
			<section className='container othersinfo'>
				<Row>
					<Col span={4}>
						<div className='items tr'>行业分类：</div>
					</Col>
					<Col span={8}>
						<div className='items'>--</div>
					</Col>
					<Col span={4}>
						<div className='items tr'>行业分类：</div>
					</Col>
					<Col span={8}>
						<div className='items'>-</div>
					</Col>
				</Row>
			</section>
			{editBaseInfoModal ? <Modal visible={true} title='编辑公司-基本信息'>
				hehehh
			</Modal> : null}
		</div>
	}
}
