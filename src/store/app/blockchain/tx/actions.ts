import { Minima } from 'minima'

import { Decimal } from 'decimal.js'

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

    const txnId = Math.floor(Math.random()*1000000000)
    const time = new Date(Date.now()).toString()
    const pendingData: TxData = {
        txId:  txnId,
        summary: Transaction.pending,
        time: time
    }
    dispatch(write({data: pendingData})(TransactionActionTypes.TRANSACTION_PENDING))

    Minima.cmd("keys new;newaddress;" , function( keysJSON: any ){

      if( Minima.util.checkAllResponses(keysJSON) ) {

        //console.log("Keys check!", keysJSON)

        const pubKey  = keysJSON[0].response.key.publickey
    		const address = keysJSON[1].response.address.hexaddress
        const minimaTokenId = "0x00"

        const decPrice = new Decimal(order.price)
        let decAmount = new Decimal(order.amount)
        let decTotal = decAmount.mul(decPrice)
        let hasTokenId = minimaTokenId
        let wantsTokenId = order.tokenId
        if ( !order.isBuy ) {

          // swap everything :)
          hasTokenId = order.tokenId
          wantsTokenId = minimaTokenId
      		let swap  = decTotal;
      		decTotal  = decAmount;
      		decAmount = swap;
        }

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
        //txnData.summary = Transaction.failure
    		Minima.cmd(txnCreator, function( respJSON: any ){

          //console.log("txn check!", respJSON)

          if( Minima.util.checkAllResponses( respJSON ) ) {

            const successData: TxData = {
                txId:  txnId,
                summary: Transaction.success,
                time: time
            }
            dispatch(write({data: successData})(TransactionActionTypes.TRANSACTION_SUCCESS))

    			} else {

            const failedData: TxData = {
                txId:  txnId,
                summary: respJSON[respJSON.length - 1].message,
                time: time
            }
            dispatch(write({data: failedData})(TransactionActionTypes.TRANSACTION_FAILURE))
            //Minima.log("Submit order failed")
          }
    		})
  		}  else {

        const failedData: TxData = {
            txId:  txnId,
            summary: keysJSON[keysJSON.length - 1].message,
            time: time
        }
        dispatch(write({data: failedData})(TransactionActionTypes.TRANSACTION_FAILURE))
        //Minima.log("Submit order failed")
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
        summary: Transaction.pending,
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

      txnData.summary = Transaction.failure
  		if ( Minima.util.checkAllResponses( respJSON ) ) {

        const successData: TxData = {
            txId:  txnId,
            summary: Transaction.success,
            time: time
        }
        dispatch(write({data: successData})(TransactionActionTypes.TRANSACTION_SUCCESS))

      }  else {

        const failedData: TxData = {
            txId:  txnId,
            summary: respJSON[respJSON.length - 1].message,
            time: time
        }
        dispatch(write({data: failedData})(TransactionActionTypes.TRANSACTION_FAILURE))
      }
    })
  }
}
