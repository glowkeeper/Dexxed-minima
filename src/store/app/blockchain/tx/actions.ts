import { Minima } from 'minima'

import { Decimal } from 'decimal.js'

import { getOrders, getTokenName } from '../actions'

import {
  AppDispatch,
  TransactionActionTypes,
  TxData,
  NewOrder,
  Order,
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

    //console.log ("New order: ", order)

    Minima.cmd("keys new;newaddress;" , function( keysJSON: any ){

      if( Minima.util.checkAllResponses(keysJSON) ) {

        //console.log("Keys check!", keysJSON)

        const pubKey  = keysJSON[0].response.key.publickey
    		const address = keysJSON[1].response.address.hexaddress

    		const txnCreator =
    			"txncreate " + txnId + ";" +
    			"txnstate " + txnId + " 0 " + pubKey + ";" +
    			"txnstate " + txnId + " 1 " + address + ";" +
    			"txnstate " + txnId + " 2 " + order.wantsTokenId + ";" +
    			"txnstate " + txnId + " 3 " + order.amount + ";" +
    			"txnauto " + txnId + " " + order.total + " " + dexContract + " " + order.hasTokenId + ";" +
    			"txnpost " + txnId + ";" +
    			"txndelete " + txnId + ";"

        //console.log("Create order: ", txnCreator)

    		//And Run it..
        //txnData.summary = Transaction.failure
    		Minima.cmd(txnCreator, function( respJSON: any ) {

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

export const takeOrder = ( order: Order ) => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const allTokens = state.tokens

    //console.log("take! " + "\nisBuy: " + order.isBuy + "\ncoindId: " + order.coinId + "\nowner: " + order.owner + "\naddress: " + order.address + "\ncoinAmount: "+ order.coinAmount.toFixed() + "\ntokenId: " + order.tokenId + "\norder tokenname: " + order.tokenName + "\nswap tokenid: " + order.swapTokenId + "\nswaptokenname: " + order.swapTokenName + "\namount: " + order.amount.toString() + "\nprice: " + order.price.toString() + "\ntotal: " + order.total.toString() + "\nstatus: " + order.status)

    let tokenName = getTokenName(order.tokenId, allTokens)
    let amountIn = order.amount.toFixed()
    let amountOut = order.total.toFixed()
    if ( !order.isBuy ) {

      tokenName = getTokenName(order.swapTokenId, allTokens)
      amountIn = order.total.toFixed()
      amountOut = order.coinAmount.toFixed()
    }

    const txnId = Math.floor(Math.random()*1000000000)
    const time = new Date(Date.now()).toString()
    const pendingData: TxData = {
        txId:  txnId,
        summary: Transaction.pending,
        time: time
    }
    dispatch(write({data: pendingData})(TransactionActionTypes.TRANSACTION_PENDING))

  	Minima.cmd("newaddress" , function( addrJSON: any ) {

      const txnId = Math.floor(Math.random()*1000000000)

  		if ( addrJSON.status ) {
  			//Get the address
  			const myAddress = addrJSON.response.address.hexaddress
  			//Create the TXN

  			//First create a transaction paying him.. and an new address for you..
  			const txnCreator =
  				//Create the Base
  				"txncreate " + txnId + ";" +
  				//Auto set up the payment
  				"txnauto " + txnId + " " + amountIn + " " + order.address + " " + order.swapTokenId + ";" +
  				//NOW add that coin.. MUST be the first - as oposite is payment
  				"txninput " + txnId + " "+ order.coinId + " 0;" +
  				//Send it to yourself..
  				"txnoutput " + txnId + " " + amountOut + " " + myAddress + " " + order.tokenId + ";" +
  				//Re Sign it..
  				"txnsignauto " + txnId + ";" +
  				//Post
  				"txnpost " + txnId + ";" +
  				//Delete..
  				"txndelete " + txnId + ";" ;

        //console.log("txCreator: ", txnCreator)

  			//Create this first stage
  			Minima.cmd(txnCreator, function( respJSON: any ) {

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
          }
  			})

  		} else {

        const failedData: TxData = {
            txId:  txnId,
            summary: addrJSON.message,
            time: time
        }
        dispatch(write({data: failedData})(TransactionActionTypes.TRANSACTION_FAILURE))
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
        dispatch(getOrders(true))

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
