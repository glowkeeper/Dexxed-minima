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
    const orderDisabled = state.appData.data.orderDisabled
    const buyOrderDisabled = state.appData.data.buyOrderDisabled
    const sellOrderDisabled =  state.appData.data.sellOrderDisabled

    let appData: AppData = {
      activePage: page,
      orderDisabled: orderDisabled,
      buyOrderDisabled: buyOrderDisabled,
      sellOrderDisabled: sellOrderDisabled,
      hasInitialised: hasInitialised
    }

    //console.log("setPage", appData)

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

export const setOrdersDisabled = (orders: boolean[]) => {
  return async (dispatch: AppDispatch, getState: Function ) => {

    const state = getState()
    const activePage = state.appData.data.activePage
    const hasInitialised = state.appData.data.hasInitialised
    const buyOrderDisabled = state.appData.data.buyOrderDisabled
    const sellOrderDisabled =  state.appData.data.sellOrderDisabled

    //console.log("setOrdersDisabled", orders)

    let appData: AppData = {
      activePage: activePage,
      orderDisabled: orders,
      buyOrderDisabled: buyOrderDisabled,
      sellOrderDisabled: sellOrderDisabled,
      hasInitialised: hasInitialised
    }

    dispatch(write({data: appData})(AppDataActionTypes.APPDATA_SUCCESS))
  }
}
