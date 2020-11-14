import { ActionProps, MyOrdersActionTypes, MyOrdersProps } from '../../../../types'

const initialInfoState: MyOrdersProps = {
  data: []
}

export const reducer = (state: ScriptProps = initialInfoState, action: ActionProps): ScriptProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  const orderBookData: MyOrdersProps = action.payload as MyOrdersProps
  if ( action.type == MyOrdersActionTypes.ADD_TOKENS ) {
    return { ...state, data: orderBookData.data }
  } else {
    return state
  }
}
