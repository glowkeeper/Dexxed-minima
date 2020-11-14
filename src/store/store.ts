import { combineReducers, Reducer, Store, createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

import { ApplicationState, ActionProps } from './types'

import { reducer as infoReducer } from './app/reducers/info/reducer'
import { reducer as scriptReducer } from './app/reducers/blockchain/script/reducer'
import { reducer as balanceReducer } from './app/reducers/blockchain/balance/reducer'
import { reducer as myOrdersReducer } from './app/reducers/blockchain/myOrders/reducer'
import { reducer as orderBookReducer } from './app/reducers/blockchain/orderBook/reducer'
import { reducer as tokensReducer } from './app/reducers/blockchain/tokens/reducer'
import { reducer as tradesReducer } from './app/reducers/blockchain/trades/reducer'
import { reducer as txReducer } from './app/reducers/tx/reducer'

export const rootReducer: Reducer<ApplicationState, ActionProps> = combineReducers<ApplicationState, ActionProps>({
  info: infoReducer,
  script: scriptReducer,
  balance: balanceReducer,
  myOrders: myOrdersReducer,
  orderBook: orderBookReducer,
  tokens: tokensReducer,
  trades: tradesReducer,
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
