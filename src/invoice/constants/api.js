import api from '../../api/index'
export const createAssociation = (body = {}) => {
	return api.post('/finance/invoice/application/associateOrder', { ...body }).then((response) => {
		const data = response;
		return data
	})
}
export const createInvoiceAssociation = (body = {}) => {
	return api.post('/finance/invoice/application/associateInvoice', { ...body }).then((response) => {
		const { data } = response;
		return data
	})
}
