import {
  AppDispatch,
  AppDataActionTypes,
  AppData
} from '../../types'

import { Local } from '../../../config'

import { write } from '../../actions'

export const setActivePage = (page: string) => {
  return async (dispatch: AppDispatch, getState: Function ) => {

    const state = getState()
    const hasInitialised = state.appData.data.hasInitialised

    let appData: AppData = {
      activePage: page,
      hasInitialised: hasInitialised
    }

    if ( ( page === Local.balances ) ||
         ( page === Local.about ) ||
         ( page === Local.help ) ||
         ( page === Local.contact ) ||
         ( page === Local.trades ) ||
         ( page === Local.allTrades ) ||
         ( page === Local.recentTrades ) ||
         ( page === Local.orderBook ) ||
         ( page === Local.orders ) ) {

      dispatch(write({data: appData})(AppDataActionTypes.APPDATA_SUCCESS))

    } else {

      appData.activePage = Local.home
      dispatch(write({data: appData})(AppDataActionTypes.APPDATA_FAILURE))
    }
  }
}
