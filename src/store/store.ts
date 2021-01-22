import { combineReducers, Reducer, Store, createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

import { ApplicationState, ActionProps } from './types'

import { reducer as appDataReducer } from './app/reducers/app/reducer'
import { reducer as chainReducer } from './app/reducers/blockchain/info/reducer'
import { reducer as scriptReducer } from './app/reducers/blockchain/script/reducer'
import { reducer as balanceReducer } from './app/reducers/blockchain/balance/reducer'
import { reducer as myOrdersReducer } from './app/reducers/blockchain/myOrders/reducer'
import { reducer as orderBookReducer } from './app/reducers/blockchain/orderBook/reducer'
import { reducer as allTradesReducer } from './app/reducers/blockchain/allTrades/reducer'
import { reducer as myTradesReducer } from './app/reducers/blockchain/myTrades/reducer'
import { reducer as tokensReducer } from './app/reducers/blockchain/tokens/reducer'
import { reducer as txReducer } from './app/reducers/tx/reducer'

export const rootReducer: Reducer<ApplicationState, ActionProps> = combineReducers<ApplicationState, ActionProps>({
  appData: appDataReducer,
  chainInfo: chainReducer,
  script: scriptReducer,
  balance: balanceReducer,
  myOrders: myOrdersReducer,
  orderBook: orderBookReducer,
  allTrades: allTradesReducer,
  myTrades: myTradesReducer,
  tokens: tokensReducer,
  tx: txReducer,
})

export function configureStore(
  initialState: ApplicationState
): Store<ApplicationState, ActionProps> {

  // create the redux-saga middleware
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(ReduxThunk)
  )

  return store
}
