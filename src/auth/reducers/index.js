import { combineReducers } from 'redux'
import sourceRulesList, { sourceRulesDetail, sourceRulesParam } from './sourceRules'
import sourceTypeList from './sourceType'
import navGroupList from './navGroup'
import roleList, { rolesPagination } from './roles'
import { getRuleList, getSourceTypeDetail, getSourceTypeParam } from './sourceType'
import sourceList, { sourceDetail, sourceParam, sourcesPagination } from './source'
import navTypeList, { getNavTypeDetail, getNavTypeParam, navTypePagination } from './navType'
import navList, { getNavDetail, getNavParam, navPagination } from './nav'
import roleRelationList, { roleRelationPagination } from './roleRelation'
import { userAuthorityList } from './authority'
import roleAuthorityList, { permissionId, role } from './roleAuthority'

export default combineReducers({
	sourceRulesList,
	navGroupList,
	sourceTypeList,
	getRuleList,
	roleList,
	rolesPagination,
	roleRelationList,
	roleRelationPagination,
	sourceList,
	navTypeList,
	navList,
	navPagination,
	sourceRulesDetail,
	sourceRulesParam,
	getSourceTypeDetail,
	getSourceTypeParam,
	sourceDetail,
	sourceParam,
	sourcesPagination,
	getNavTypeDetail,
	getNavTypeParam,
	navTypePagination,
	getNavDetail,
	getNavParam,
	userAuthorityList,
	roleAuthorityList,
	permissionId,
	role
})
