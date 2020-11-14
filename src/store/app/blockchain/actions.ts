// @ts-ignore
import { Minima } from './minima'

import {
  AppDispatch,
  ScriptProps,
  ScriptActionTypes
  TokenProps,
  TokenActionTypes,
  BalanceActionTypes,
  BalanceProps,
  Balance
} from '../../types'

import { Config } from '../../../config'

import { write } from '../../actions'

export const init = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

      Minima.init( function( msg: any ) {

        if ( msg.event == "connected" ) {

          initDexxed()

  	 		} else if (msg.event == "newblock" ) {

          //Call the Poll Function.. no need for a new thread polling..
          getTokens()
  		 		/*
          UpdateBlockTime();
        	UpdateMyOrders();
        	UpdateOrderBook();
        	UpdateAllTrades();
          */

  	 		} else if (msg.event == "newbalance"){

  		 		getBalance()
  	 		}
  		})
  }
}

const initDexxed = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const tokens = state.chainInfo.data.tokens
    const dexContract  = "LET owner = PREVSTATE ( 0 ) IF SIGNEDBY ( owner ) THEN RETURN TRUE ENDIF LET address = PREVSTATE ( 1 ) LET token = PREVSTATE ( 2 ) LET amount = PREVSTATE ( 3 ) RETURN VERIFYOUT ( @INPUT address amount token )";

    //Tell Minima about this contract.. This allows you to spend it when the time comes
  	Minima.cmd("extrascript \"" + dexContract + "\";", function(respJSON: any) {

      if( Minima.util.checkAllResponses(respJSON) ) {

       const chainData: ScriptProps = {
         data: {
           scriptAddress: respJSON[0].response.address.hexaddress,
           tokens: tokens
         }
       }

       dispatch(write({ data: chainData.data })(ChainDataActionTypes.ADD_CONTRACT))

     } else {

       Minima.log("extrascript failed")
     }

  	})
  }
}

export const getTokens = () => {
  return async (dispatch: AppDispatch) => {

    //Tell Minima about this contract.. This allows you to spend it when the time comes
  	Minima.cmd("tokens;", function(respJSON: any) {

      if( Minima.util.checkAllResponses(respJSON) ) {

        const tokenData: TokenProps = []
        const tokens = respJSON[0].response.tokens

        // since Minima is first, we ignore that
        for( let i=1; i < tokens.length; i++ ) {

          const thisToken: Token = {
            tokenId: tokens[i].tokenid,
            token: tokens[i].token,
            total:  tokens[i].total
          }

          tokenData.push(thisToken)
        }

        dispatch(write({ data: tokenData })(TokenActionTypes.ADD_TOKENS))

      } else {

        Minima.log("tokens failed")
      }
  	})
  }
}

export const getBlock = () => {

  return Minima.block

}

const getBalance = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

    let balanceData: Balance[] = []

  	for( let i = 0; i < Minima.balance.length; i++ ) {

      const thisBalance: Balance = {
        confirmed: Minima.balance[i].confirmed,
        uncomfirmed: Minima.balance[i].unconfirmed,
        mempool: Minima.balance[i].mempool
      }

      balanceData.push(thisBalance)
    }

    dispatch(write({ data: balanceData })(BalanceActionTypes.GET_BALANCES))
  }
}
