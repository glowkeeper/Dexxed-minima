import { ActionProps, TokenActionTypes, TokenProps } from '../../../../types'

const initialInfoState: TokenProps = {
  data: []
}

export const reducer = (state: ScriptProps = initialInfoState, action: ActionProps): ScriptProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  const tokenData: TokenProps = action.payload as TokenProps
  if ( action.type == TokenActionTypes.ADD_TOKENS ) {
    return { ...state, data: tokenData.data }
  } else {
    return state
  }
}
