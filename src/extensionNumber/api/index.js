import api from "../../api/index";
import Interface from '../constants/Interface'

// 导入账号
export const postImportAccount = body => api.post(Interface.sellerAndAE.postImportAccount, body).then(res => res.data)


