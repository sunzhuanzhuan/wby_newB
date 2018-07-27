import api from '../../api/index'

export const create = (nowValues) => () => {
	return api.get('/toolbox/order/filter/toTask', {
		params: { ...nowValues }
	})
}
