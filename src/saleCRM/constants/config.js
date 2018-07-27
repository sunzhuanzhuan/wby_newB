import CompanyInMainTab from '../components/companyDetail/CompanyInMainTab'
import BusinessInMainTab from "../components/companyDetail/BusinessInMainTab";
import PermissionsInMainTab
	from "../components/companyDetail/PermissionsInMainTab";
import FinanceInMainTab from "../components/companyDetail/FinanceInMainTab";

export const company_detail_config = {
	mainTab: {
		list: ['company', 'business', 'permissions', 'finance'],
		map: {
			company: {
				title: '公司',
				key: 'company',
				content: CompanyInMainTab
			},
			business: {
				title: '商机',
				key: 'business',
				content: BusinessInMainTab
			},
			permissions: {
				title: '权限与配置',
				key: 'permissions',
				content: PermissionsInMainTab
			},
			finance: {
				title: '财务',
				key: 'finance',
				content: FinanceInMainTab
			}
		}
	}
}
export const businessModal = {
	stop: '暂停',
	over: '终止',
	addFollowRecord: '添加跟进记录',
}
export default { company_detail_config, businessModal }
