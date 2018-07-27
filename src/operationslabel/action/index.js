import api from '../../api/index'
import {
    IMPORT_TAG_CHECK,
    REQUEST_TAGLIST,
    TAG_DETAILS,
    TAG_DETAILS_SEARCH_TYPE,
    TAG_DETAILS_SEARCH_LIST
} from "../constants/ActionTypes";
import * as tagApi from "../constants/API";


//标签列表
export const requestTaglist = (type, data) => (dispatch) => {
    return api.get(tagApi[type],
        {params: data}).then((response) => {
        if (response.code === 200) {
            dispatch({
                type: REQUEST_TAGLIST,
                data: response.data
            });
        }

    })
};
//添加标签
export const addTag = (type, data, message) => () => {
    return api.post(tagApi[type], data).then((response) => {
        if (response.code === 200) {
            if (response.msg === "标签名称已存在！") {
                message.error(response.msg, 1);
            } else {
                message.success(response.msg, 1);
            }

        }
    })
};
//删除或恢复标签
export const operationTag = (type, data, message) => () => {
    return api.post(tagApi[type], data).then((response) => {
        if (response.code === 200) {
            message.success(response.msg, 1);
        }
    })
};

//标签详情
export const tagDetails = (type, data) => (dispatch) => {
    return api.get(tagApi[type], {params: data}).then((response) => {
        if (response.code === 200) {
            dispatch({
                type: TAG_DETAILS,
                data: response.data
            });
        }
    })
};
//标签详情-账号信息类型
export const tagDetailSearchType = (type, data) => (dispatch) => {
    return api.get(tagApi[type], {params: data}).then((response) => {
        if (response.code === 200) {
            dispatch({
                type: TAG_DETAILS_SEARCH_TYPE,
                data: response.data
            });
        }
    })
};
//标签详情-账号信息列表
export const tagDetailSearchList = (type, data) => (dispatch) => {
    return api.post(tagApi[type], data).then((response) => {
        if (response.code === 200) {
            dispatch({
                type: TAG_DETAILS_SEARCH_LIST,
                data: response.data
            });
        }
    })
};


//账号批量导入
export const accountImport = (type, data) => (dispatch) => {
    return api.post(tagApi[type], data).then((response) => {
        if (response.code === 200) {
            dispatch({
                type: IMPORT_TAG_CHECK,
                data: response.data
            });
        }
    })
};

//标签编辑
export const tagUpdate = (type, data, message) => () => {
    return api.post(tagApi[type], data).then((response) => {
        if (response.code === 200) {
            message.success(response.msg, 1);
        }
    })
};

//删除标签账号
export const deleteAccount = (type, data, message) => () => {
    return api.post(tagApi[type], data).then((response) => {
        if (response.code === 200) {
            message.success(response.msg, 1);
        }
    })
};

//标签排序
export const tagSort = (type, data, message) => () => {
    return api.post(tagApi[type], data).then((response) => {
        if (response.code === 200) {
            message.success(response.msg, 1);
        }
    })
};
