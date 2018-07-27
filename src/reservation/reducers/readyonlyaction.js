import { GET_EXECUTEDATA_SUCCESS, GET_EXECUTEDATA_ERROR } from "../constants/ActionTypes";
import { combineReducers } from 'redux'


const getexecutedata = (state = {
	data: {},
	message: "正在加载数据...."
}, action) => {
	switch (action.type) {
		case GET_EXECUTEDATA_SUCCESS:
			return Object.assign({}, state, {
				data: action.data,
				message: "请求成功！"
			});
		case GET_EXECUTEDATA_ERROR:
			return Object.assign({}, state, {
				message: "出错了！"
			});
		default:
			return state;
	}
};

export default combineReducers({ getexecutedata });
