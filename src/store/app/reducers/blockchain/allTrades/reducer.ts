import { ActionProps, AllTradesActionTypes, AllTradesProps } from '../../../../types'

const initialState: AllTradesProps = {
  data: []
}

export const reducer = (state: AllTradesProps = initialState, action: ActionProps): AllTradesProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  if ( action.type == AllTradesActionTypes.ADD_TRADES ) {
    const tradeData: AllTradesProps = action.payload as AllTradesProps
    return { ...state, data: tradeData.data }
  } else {
    return state
  }
}
