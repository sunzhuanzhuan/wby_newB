import api from '../../api/index'
import * as ReadyOnlyRequestUrl from "../constants/ReadyOnlyRequestUrl";

/**
 * @Author 黄晓顺
 * @param data 视图图层传来的数据
 * @time 2018-04-18 09:33
 * @Description 只读弹框出现 执行内容 结果，数据截图 action
 */
export const getExecuteData = (data) => (dispatch) => {
	dispatch({ type: "GET_EXECUTEDATA_BEFOR" });
	return api.get(ReadyOnlyRequestUrl[data.url], {
		params: { order_id: data.id }
	}).then(response => {
		if (response.data) {
			dispatch({
				type: "GET_EXECUTEDATA_SUCCESS",
				data: response.data
			})
		} else {
			dispatch({
				type: "GET_EXECUTEDATA_ERROR",
			})
		}
	})
};
