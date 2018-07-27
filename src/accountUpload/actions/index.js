import api from "../../api/index";
import * as Types from "../constans/ActionTypes";

export const getIcon = () => dispath => {
	return api.get("/toolbox/account/getIcon").then(response => {
		const { data } = response;
		dispath({ type: Types.GET_TYPE_ICON, payload: data });
	});
};
export const getInfo = value => dispatch => {
	return api
		.post("/toolbox/account/getInfo", { weibo_type: value })
		.then(response => {
			const { data } = response;
			dispatch({ type: Types.GET_TEMP_INFO, payload: data });
		});
};

export const getUploadInfo = () => dispatch => {
	return api.get("/upload/upload/uploadInfo").then(response => {
		const { data } = response;
		dispatch({
			type: Types.GET_UPLOAD_INFO,
			payload: data
		});
	});
};

export const postUpload = data => dispatch => {
	dispatch({
		type: Types.POST_UPLOAD_INFO,
		payload: data
	});
};

export const excelImport = values => () => {
	return api.post("/toolbox/account/excelImport", { ...values });
};
