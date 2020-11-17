import { ActionProps, MyTradesActionTypes, MyTradesProps } from '../../../../types'

const initialState: MyTradesProps = {
  data: []
}

export const reducer = (state: MyTradesProps = initialState, action: ActionProps): MyTradesProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  const tradeData: MyTradesProps = action.payload as MyTradesProps
  if ( action.type == MyTradesActionTypes.ADD_MYTRADES ) {
    return { ...state, data: tradeData.data }
  } else {
    return state
  }
}
