import { ActionProps, TradeActionTypes, TradeProps } from '../../../../types'

const initialInfoState: TradeProps = {
  data: []
}

export const reducer = (state: ScriptProps = initialInfoState, action: ActionProps): ScriptProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  const tradeData: TradeProps = action.payload as TradeProps
  if ( action.type == TradeActionTypes.ADD_TOKENS ) {
    return { ...state, data: tradeData.data }
  } else {
    return state
  }
}
