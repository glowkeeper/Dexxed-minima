import { ActionProps, TokenActionTypes, TokenProps } from '../../../../types'

const initialState: TokenProps = {
  data: []
}

export const reducer = (state: TokenProps = initialState, action: ActionProps): TokenProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  if ( action.type == TokenActionTypes.ADD_TOKENS ) {
    const tokenData: TokenProps = action.payload as TokenProps
    return { ...state, data: tokenData.data }
  } else {
    return state
  }
}
