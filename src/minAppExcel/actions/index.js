import Interface from '../constants/Interface'
import { createHttpAction } from '../../store/ajaxMiddleware'

// 获取列表信息
export const {
    getKolList,
    getKolList_success
} = createHttpAction('getKolList', Interface.getKolList, {
    method: 'get',
});
//导出excel接口
export const {
    getExcel,
    getExcel_success
} = createHttpAction('getExcel', Interface.getExport, {
    method: 'get',
});