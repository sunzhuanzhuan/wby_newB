import Interface from '../constants/Interface'
import { createHttpAction } from '../../store/ajaxMiddleware'

export const {
	getData,
	getData_success
} = createHttpAction('getData', Interface.getData, {
	method: 'post'
});
