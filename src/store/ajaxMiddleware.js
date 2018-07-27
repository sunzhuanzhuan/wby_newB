import { toast, showLoading, hideLoading, request } from '../util'
import { createAction } from 'redux-actions'

const actionTypeCache = {};
const CALL_API = 'CALL_API';
const { Promise } = window;
export default store => next => (action) => {
	const {
		endpoint,
		data,
		types,
		ignoreToast,
		ignoreLoading,
		method,
		dataType,
	} = (action.payload && action.payload[CALL_API]) || {};
	if (!endpoint || !types) {
		return next(action)
	}

	if (!Array.isArray(types) || types.length !== 3) {
		throw new Error('CALL_API 的 action types 必须包含发送、成功、失败三个actionType。')
	}

	const [requestType, successType, failureType] = types;
	next(requestType());

	return new Promise(async (resolve, reject) => {
		ignoreLoading !== true && await showLoading();
		try {
			let res;
			res = await request(endpoint, {
				data,
				type: method || 'GET',
				dataType,
				method: method || 'GET',
			});
			resolve(res);
			hideLoading();
			console.warn('请求:success', 'response', res, { endpoint, data });
			false && console.warn(store);
			return next(successType(res))
		} catch (ex) {
			console.warn('请求:failure', 'response', ex, { endpoint, data });
			const errorMsg = (ex && (ex.responseText || ex.statusText || ex.errorMsg)) || '系统繁忙，请重试';
			reject(ex);
			hideLoading();
			if (ignoreToast !== true) {
				toast({ text: errorMsg })
			}
			return next(failureType(ex))
		}
	});
}


/**
 * actionType
 * endpoint  lwp方法名称
 * ignoreToast 不显示失败时通用提示
 * ignoreLoading 不显示请求时候通用loading  toast
 */
export const createHttpAction = (actionType,
	endpoint,
	{ ignoreToast, ignoreLoading, isHttp, method, dataType } = {}
) => {
	if (actionTypeCache[actionType]) {
		throw new Error(`创建http action type 重复：${actionType}`)
	}
	actionTypeCache[actionType] = actionType;

	const types = [
		createAction(`${actionType}_request`),
		createAction(`${actionType}_success`),
		createAction(`${actionType}_failure`)
	]

	const payloadCreator = (data = []) => {
		console.log('payloadCreator', data)
		return {
			[CALL_API]: {
				types,
				endpoint,
				data,
				ignoreToast,
				ignoreLoading,
				isHttp,
				method,
				dataType,
			},
		}
	};
	const httpActions = {
		[actionType]: createAction(actionType, payloadCreator),
		[types[0]]: types[0],
		[types[1]]: types[1],
		[types[2]]: types[2],
	};

	return httpActions;
};
