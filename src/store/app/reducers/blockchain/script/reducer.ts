import { ActionProps, ScriptActionTypes, ScriptProps } from '../../../../types'

const initialState: ScriptProps = {
  data: {
      scriptAddress: ''
  }
}

export const reducer = (state: ScriptProps = initialState, action: ActionProps): ScriptProps => {
  //console.log('blockchain info: ', action.type, action.payload)
  if ( action.type == ScriptActionTypes.ADD_CONTRACT ) {
    const scriptData: ScriptProps = action.payload as ScriptProps
    return { ...state, data: scriptData.data }
  } else {
    return state
  }
}
