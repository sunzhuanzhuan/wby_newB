import * as Types from "../constans/ActionTypes";

export default (state = {
	typeInfo: [],
	tempInfo: {},
	uploadInfo: {},
	postLoadInfo: {},
	postExcel: {}
}, action) => {
	state = JSON.parse(JSON.stringify(state));
	switch (action.type) {
		case Types.GET_TYPE_ICON:
			state.typeInfo = action.payload;
			break;
		case Types.GET_TEMP_INFO:
			state.tempInfo = action.payload;
			break;
		case Types.GET_UPLOAD_INFO:
			state.uploadInfo = action.payload;
			break;
		case Types.POST_UPLOAD_INFO:
			state.postLoadInfo = action.payload;
			break;
		case Types.EXCEL_IMPORT:
			state.postExcel = action.payload;
			break;
		default:
			break;
	}
	return state;

};
