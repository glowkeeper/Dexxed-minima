import { ActionProps, OrderBookActionTypes, OrderBookProps } from '../../../../types'

const initialState: OrderBookProps = {
  data: []
}

export const reducer = (state: OrderBookProps = initialState, action: ActionProps): OrderBookProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  if ( action.type == OrderBookActionTypes.ADD_ORDERS ) {    
    const orderBookData: OrderBookProps = action.payload as OrderBookProps
    return { ...state, data: orderBookData.data }
  } else {
    return state
  }
}
