import {combineReducers} from 'redux'
import {
    REQUEST_TAGLIST,
    TAG_DETAILS,
    TAG_DETAILS_SEARCH_TYPE,
    IMPORT_TAG_CHECK,
    TAG_DETAILS_SEARCH_LIST
} from "../constants/ActionTypes";


//请求标签列表
const requestTaglist = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_TAGLIST:
            return action.data;
        default:
            return state;
    }
};

//标签详情
const tagDetails = (state = {}, action) => {
    switch (action.type) {
        case TAG_DETAILS:
            return action.data;
        default:
            return state;
    }
};

//标签详情-账号信息类型
const tagDetailSearchType = (state = {}, action) => {
    switch (action.type) {
        case TAG_DETAILS_SEARCH_TYPE:
            return action.data;
        default:
            return state;
    }
};
//标签详情-账号信息列表
const tagDetailSearchList = (state = {}, action) => {
    switch (action.type) {
        case TAG_DETAILS_SEARCH_LIST:
            return action.data;
        default:
            return state;
    }
};
//批量导入账号查询
const accountImport = (state = {}, action) => {
    switch (action.type) {
        case IMPORT_TAG_CHECK:
            return action.data;
        default:
            return state;
    }
};


export default combineReducers({
    requestTaglist,
    tagDetails,
    tagDetailSearchType,
    accountImport,
    tagDetailSearchList
})
