
import { combineReducers } from 'redux'
import { companyInfo, getMeta, getFileInfo, getCountInfo, modifiedForm, getToken, getInvoiceTitle } from './invoiceApply'
import {
	applyList, applyMetaData, applyListStat, saleList, availableInvoiceList, commitReviewCheck, changeState,
	invoiceStat, postAssociateNewInvoice, getInvoiceRelation, createList, partMoney
} from './ApplyList'
import { completeApplyDetail, completeOrderList, tableSelectedRowKeys, brandAndProjectList } from './completeApply';
import { getApplyDetail } from "./applyDetail";
import { getRepartionData, saleData, repartionStatus } from "./repartion";
import associateInvoice from './associateInvoice';
export default combineReducers({
	applyList,
	saleList,
	createList,
	availableInvoiceList,
	applyListStat,
	applyMetaData,
	commitReviewCheck,
	postAssociateNewInvoice,
	changeState,
	invoiceStat,
	completeApplyDetail,
	completeOrderList,
	tableSelectedRowKeys,
	brandAndProjectList,
	companyInfo,
	getMeta,
	getFileInfo,
	getApplyDetail,
	getCountInfo,
	getRepartionData,
	...associateInvoice,
	saleData,
	repartionStatus,
	modifiedForm,
	getToken,
	getInvoiceRelation,
	getInvoiceTitle,
	partMoney
})


