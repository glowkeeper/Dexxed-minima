import { ActionProps, MyOrdersActionTypes, MyOrdersProps } from '../../../../types'

const initialState: MyOrdersProps = {
  data: []
}

export const reducer = (state: MyOrdersProps = initialState, action: ActionProps): MyOrdersProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  if ( action.type == MyOrdersActionTypes.ADD_MYORDERS ) {
    const myOrderData: MyOrdersProps = action.payload as MyOrdersProps
    return { ...state, data: myOrderData.data }
  } else {
    return state
  }
}
