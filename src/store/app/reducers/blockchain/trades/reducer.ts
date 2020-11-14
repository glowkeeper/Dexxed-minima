import { ActionProps, TradeActionTypes, TradeProps } from '../../../../types'

const initialState: TradeProps = {
  data: []
}

export const reducer = (state: TradeProps = initialState, action: ActionProps): TradeProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  const tradeData: TradeProps = action.payload as TradeProps
  if ( action.type == TradeActionTypes.ADD_TRADES ) {
    return { ...state, data: tradeData.data }
  } else {
    return state
  }
}
