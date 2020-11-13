// @ts-ignore
import { Minima } from './minima'

import {
  AppDispatch
} from '../../types'

import { Config } from '../../../config'

import { write } from '../../actions'

export const initBlockchain = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

      Minima.init()
      //Minima.logging = true
  }
}
