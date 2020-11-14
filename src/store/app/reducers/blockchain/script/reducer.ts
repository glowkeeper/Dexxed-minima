import { ActionProps, ScriptActionTypes, ScriptProps } from '../../../../types'

const initialInfoState: ScriptProps = {
  data: {
      scriptAddress: ''
  }
}

export const reducer = (state: ScriptProps = initialInfoState, action: ActionProps): ScriptProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  const scriptData: ScriptProps = action.payload as ScriptProps
  if ( action.type == ScriptActionTypes.ADD_CONTRACT ) {
    return { ...state, data: scriptData.data }
  } else {
    return state
  }
}
