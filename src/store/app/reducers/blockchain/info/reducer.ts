import { ActionProps, ChainInfoActionTypes, ChainInfoProps } from '../../../../types'

const initialInfoState: ChainInfoProps = {
  data: {
      block: 0
  }
}

export const reducer = (state: ChainInfoProps = initialInfoState, action: ActionProps): ChainInfoProps => {

  const chainData: ChainInfoProps = action.payload as ChainInfoProps
  if ( action.type == ChainInfoActionTypes.ADD_BLOCK ) {
    return {...state, data: chainData.data }
  } else {
    return state
  }
}
