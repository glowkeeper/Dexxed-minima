// @ts-ignore
import { Minima } from '../minima'

import {
  AppDispatch,
  TransactionActionTypes,
  TxData,
  NewOrder,
  CancelOrder
} from '../../../types'

import { write } from '../../../actions'

import { Transaction } from '../../../../config'

export const initialise = () => {
  return async (dispatch: AppDispatch) => {
    const initData: TxData = {
        txId: 0,
        summary: "",
        time: ""
    }
    await dispatch(write({data: initData})(TransactionActionTypes.TRANSACTION_INIT))
  }
}

export const submitOrder = ( order: NewOrder ) => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract = state.script.data.scriptAddress

    Minima.cmd("keys new;newaddress;" , function( keysJSON: any ){

      if( Minima.util.checkAllResponses(keysJSON) ) {

        const pubKey  = keysJSON[0].response.key.publickey
    		const address = keysJSON[1].response.address.hexaddress

        const hasTokenId = order.hasTokenId
        const wantsTokenId = order.wantsTokenId
        const decAmount = order.amount
        const decPrice = order.price
        const decTotal = decAmount.mul(decPrice)

        const time = new Date(Date.now()).toString()
        const txnId = Math.floor(Math.random()*1000000000)

        let txnData: TxData = {
            txId:  txnId,
            summary: `${Transaction.pending}`,
            time: time
        }

        dispatch(write({data: txnData})(TransactionActionTypes.TRANSACTION_PENDING))

    		const txnCreator =
    			"txncreate " + txnId + ";" +
    			"txnstate " + txnId + " 0 " + pubKey + ";" +
    			"txnstate " + txnId + " 1 " + address + ";" +
    			"txnstate " + txnId + " 2 " + wantsTokenId + ";" +
    			"txnstate " + txnId + " 3 " + decAmount + ";" +
    			"txnauto " + txnId + " " + decTotal + " " + dexContract + " " + hasTokenId + ";" +
    			"txnpost " + txnId + ";" +
    			"txndelete " + txnId + ";"

    		//And Run it..
    		Minima.cmd(txnCreator, function( respJSON: any ){

          if( Minima.util.checkAllResponses( respJSON ) ) {

            txnData.summary = `${Transaction.success}`
            dispatch(write({data: txnData})(TransactionActionTypes.TRANSACTION_SUCCESS))

    			} else {

            Minima.log("Submit order failed")
          }
    		})
  		}  else {

        Minima.log("Submit order failed")
      }
    })
  }
}

export const cancelOrder = ( order: CancelOrder ) => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const coinId = order.coinId
    const owner = order.owner
    const address = order.address
    const decAmount = order.coinAmount
    const tokenId = order.tokenId

    const time = new Date(Date.now()).toString()
    const txnId = Math.floor(Math.random()*1000000000)

    let txnData: TxData = {
        txId:  txnId,
        summary: `${Transaction.pending}`,
        time: time
    }

    dispatch(write({data: txnData})(TransactionActionTypes.TRANSACTION_PENDING))

  	//Script to create transaction..
  	const txnCreator =
  		"txncreate " + txnId + ";" +
  		"txninput " + txnId + " " + coinId + ";" +
  		"txnoutput " + txnId + " " + decAmount + " " + address + " " + tokenId + ";" +
  		"txnsign " + txnId + " " + owner + ";" +
  		"txnpost " + txnId + ";" +
  		"txndelete " + txnId + ";"

  	Minima.cmd(txnCreator, function( respJSON: any ) {

  		if ( Minima.util.checkAllResponses( respJSON ) ) {

        txnData.summary = `${Transaction.success}`
        dispatch(write({data: txnData})(TransactionActionTypes.TRANSACTION_SUCCESS))

      }  else {

        Minima.log("Cancel order failed")
      }
    })
  }
}
