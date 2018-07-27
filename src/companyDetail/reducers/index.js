import { combineReducers } from 'redux'
import { accountDetail, coffersList } from './accountDetail'
import { freezeDetail } from './FreezeDetail'
import { accountFlow } from './accountFlow'
import { goldenFlow, getCostBilling, getReparation } from './goldenAccount'
export default combineReducers({
    accountDetail,
    coffersList,
    freezeDetail,
    accountFlow,
    goldenFlow,
    getCostBilling,
    getReparation
})



