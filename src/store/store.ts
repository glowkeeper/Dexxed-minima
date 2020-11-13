import { combineReducers, Reducer, Store, createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

import { ApplicationState, ActionProps } from './types'

import { reducer as infoReducer } from './app/reducers/info/reducer'
import { reducer as chainReducer } from './app/reducers/blockchain/info/reducer'
import { reducer as txReducer } from './app/reducers/tx/reducer'
import { reducer as dataReducer } from './app/reducers/get/reducer'

export const rootReducer: Reducer<ApplicationState, ActionProps> = combineReducers<ApplicationState, ActionProps>({
  info: infoReducer,
  chainInfo: chainReducer,
  tx: txReducer,
  data: dataReducer
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
