import { ActionProps, BalanceActionTypes, BalanceProps } from '../../../../types'

const initialState: BalanceProps = {
  data: []
}

export const reducer = (state: BalanceProps = initialState, action: ActionProps): BalanceProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  const balanceData: BalanceProps = action.payload as BalanceProps
  if ( action.type == BalanceActionTypes.GET_BALANCES ) {
    return { ...state, data: balanceData.data }
  } else {
    return state
  }
}
