import { ActionProps, ChainDataActionTypes, ChainDataProps } from '../../../../types'

const initialInfoState: ChainDataProps = {
  data: {
      scriptAddress: ''
  }
}

export const reducer = (state: ChainDataProps = initialInfoState, action: ActionProps): ChainDataProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  const chainData: ChainDataProps = action.payload as ChainDataProps
  if ( action.type == ChainDataActionTypes.ADD_CONTRACT ) {
    return { ...state, data: chainData.data }
  } else {
    return state
  }
}
