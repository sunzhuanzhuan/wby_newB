import { GET_REPARATION_LIST, GET_SALE_LIST, REPARION_STATUS } from '../constants/ActionTypes'


export const getRepartionData = (state = [], action) => {
    switch (action.type) {
        case GET_REPARATION_LIST:
            return action.payload;
        default:
            return state;
    }
}

export const saleData = (state = [], action) => {
    switch (action.type) {
        case GET_SALE_LIST:
            return action.payload;
        default:
            return state;
    }
}
//获取赔偿状态
export const repartionStatus = (state = [], action) => {
    switch (action.type) {
        case REPARION_STATUS:
            return action.payload;
        default:
            return state;
    }
}