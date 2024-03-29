import {
    ActionProps,
    AppDataActionTypes,
    AppDataProps,
    AppData
} from '../../../types'

const initialState: AppDataProps = {
    data: {
      activePage: '/',
      activeToken: {
        value: "",
        name: "",
        label: ""
      },
      orderDisabled: [],
      buyOrderDisabled: [],
      sellOrderDisabled: [],
      hasInitialised: false
    }
}

export const reducer = (state: AppDataProps = initialState, action: ActionProps): AppDataProps => {

  //console.log("here with: ", action)
  switch (action.type) {
    case AppDataActionTypes.APPDATA_INIT: {
      return initialState
    }
    case AppDataActionTypes.APPDATA_FAILURE: {
      return state
    }
    case AppDataActionTypes.APPDATA_SUCCESS: {
      //console.log("here with: ", action.payload.data)
      const data = (action.payload as AppDataProps)
      return {...state, ...data}
    }
    default:
      return state
  }
}
