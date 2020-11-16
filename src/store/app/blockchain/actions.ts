// @ts-ignore
import { Minima } from './minima'

import { Decimal } from 'decimal.js'

import {
  AppDispatch,
  ScriptProps,
  ScriptActionTypes,
  ChainInfoActionTypes,
  ChainInfoProps,
  TokenProps,
  Token,
  TokenActionTypes,
  BalanceActionTypes,
  BalanceProps,
  Balance,
  MyOrdersActionTypes,
  MyOrdersProps,
  OrderBookActionTypes,
  OrderBookProps,
  Order
} from '../../types'

import { Misc, Config, MyOrders } from '../../../config'

import { write } from '../../actions'

export const init = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

      Minima.init( function( msg: any ) {

        //console.log(msg)

        if ( msg.event == "connected" ) {

          dispatch(initDexxed())

  	 		} else if ( msg.event == "newblock" ) {

          dispatch(getBlock())
          dispatch(getTokens())

          const justMyOrders = true
          dispatch(getOrders(justMyOrders))
          // All orders (including mine)
          dispatch(getOrders(!justMyOrders))

        	/*UpdateAllTrades();*/

  	 		} else if ( msg.event == "newbalance" ) {

  		 		dispatch(getBalance())
  	 		}
  		})
  }
}

const initDexxed = () => {
  return async (dispatch: AppDispatch) => {

    const dexContract = "LET owner = PREVSTATE ( 0 ) IF SIGNEDBY ( owner ) THEN RETURN TRUE ENDIF LET address = PREVSTATE ( 1 ) LET token = PREVSTATE ( 2 ) LET amount = PREVSTATE ( 3 ) RETURN VERIFYOUT ( @INPUT address amount token )";

    //Tell Minima about this contract.. This allows you to spend it when the time comes
  	Minima.cmd("extrascript \"" + dexContract + "\";", function(respJSON: any) {

      //console.log("extrascript: ", respJSON)
      if( Minima.util.checkAllResponses(respJSON) ) {

       const scriptData: ScriptProps = {
         data: {
           scriptAddress: respJSON[0].response.address.hexaddress
         }
       }

       //console.log("script: ", scriptData)

       dispatch(write({ data: scriptData.data })(ScriptActionTypes.ADD_CONTRACT))

       dispatch(getBalance())
       dispatch(getTokens())

       const justMyOrders = true
       dispatch(getOrders(justMyOrders))
       // All orders (including mine)
       dispatch(getOrders(!justMyOrders))

     } else {

       Minima.log("extrascript failed")
     }

  	})
  }
}

export const getTokens = () => {
  return async (dispatch: AppDispatch) => {

    // Find all known tokens
    Minima.cmd("tokens;", function(respJSON: any) {

      if( Minima.util.checkAllResponses(respJSON) ) {

        const tokenData: TokenProps = {
          data: []
        }
        const tokens = respJSON[0].response.tokens

        // since Minima is first, we ignore that
        for( let i=1; i < tokens.length; i++ ) {

          const thisToken: Token = {
            tokenId: tokens[i].tokenid,
            token: tokens[i].token,
            scale: tokens[i].scale,
            total:  tokens[i].total,
            isSelected: false
          }

          tokenData.data.push(thisToken)
        }

        //console.log("tokens: ", tokenData)

        dispatch(write({ data: tokenData.data })(TokenActionTypes.ADD_TOKENS))

      } else {

        Minima.log("tokens failed")
      }
  	})
  }
}

export const setToken = (tokenid: string) => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract = state.script.data.scriptAddress
    const myOrders = state.myOrders.data
    const tokens = state.tokens

    const tokenData: TokenProps = {
      data: []
    }

    for( let i=1; i < tokens.length; i++ ) {

      const isSelected = tokens[i].tokenid === tokenid ? true : false

      const thisToken: Token = {
        tokenId: tokens[i].tokenid,
        token: tokens[i].token,
        scale: tokens[i].scale,
        total:  tokens[i].total,
        isSelected: isSelected
      }

      tokenData.data.push(thisToken)
    }

    dispatch(write({ data: tokenData.data })(TokenActionTypes.ADD_TOKENS))
  }
}

const getBlock = () => {
  return async (dispatch: AppDispatch) => {

    const chainInfo: ChainInfoProps = {
      data: {
        block: Minima.block
      }
    }

    dispatch(write({ data: chainInfo.data })(ChainInfoActionTypes.ADD_BLOCK))
  }
}

const getBalance = () => {
  return async (dispatch: AppDispatch) => {

    let balanceData: BalanceProps = {
      data: []
    }

  	for( let i = 0; i < Minima.balance.length; i++ ) {

      const thisBalance: Balance = {
        token: Minima.balance[i].token,
        confirmed: Minima.balance[i].confirmed,
        uncomfirmed: Minima.balance[i].unconfirmed,
        mempool: Minima.balance[i].mempool
      }

      balanceData.data.push(thisBalance)
    }

    //console.log("balance: ", balanceData)
    dispatch(write({ data: balanceData.data })(BalanceActionTypes.GET_BALANCES))
  }
}

const getTokenName = ( tokenId: string, tokens: TokenProps ): string => {

  if( tokenId == "0x00" ) {
		return "Minima"
	}

	for ( let i = 0; i < tokens.data.length; i++) {
		//check it
		if( tokens.data[i].tokenId == tokenId ) {
			return tokens.data[i].token
		}
	}

	return "";
}

const getTokenScale = ( tokenId: string, tokens: TokenProps ): Decimal => {

  for ( let i = 0; i < tokens.data.length; i++) {

    if(tokens.data[i].tokenId == tokenId ) {

      const tempTokenScale = new Decimal(tokens.data[i].scale)
			const tempTokenScaleFactor = new Decimal(10).pow(tempTokenScale);
			return tempTokenScaleFactor
		}
	}

	return new Decimal(1)
}

const getCurrentToken = ( tokens: TokenProps ): string => {

  let tokenId = ""

  for ( let i = 0; i < tokens.data.length; i++) {

    if(tokens.data[i].isSelected ) {

      tokenId = tokens.data[i].tokenId
      break;
		}
	}

	return tokenId
}

const getOrders = (justMyOrders: boolean) => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract = state.script.data.scriptAddress
    const myOrders = state.myOrders.data
    const allTokens = state.tokens

    let minimaCmd = "coins address:" + dexContract  + ";"
    let actionType: OrderBookActionTypes | MyOrdersActionTypes = OrderBookActionTypes.ADD_ORDERS

    if ( justMyOrders ) {

      minimaCmd = "coins relevant address:" + dexContract + ";"
      actionType = MyOrdersActionTypes.ADD_MYORDERS
    }

    Minima.cmd(minimaCmd, function( coinsJSON: any ){

      if( Minima.util.checkAllResponses(coinsJSON) ) {

        let ordersData: MyOrdersProps = {
          data: []
        }

        const coinData = coinsJSON[0]
        for( let i=0; i < coinData.response.coins.length; i++ ) {

          //The Order
          const coinProof  = coinData.response.coins[i].data
    			const coinId = coinProof.coin.coinid
    			const coinAmount = new Decimal(coinProof.coin.amount)
    			const tokenId = coinProof.coin.tokenid
          const tokenName = getTokenName(tokenId, allTokens)

          // Get state
    			const cPrevState = coinProof.prevstate
          const owner = Minima.util.getStateVariable( cPrevState, 0 )
    			const address = Minima.util.getStateVariable( cPrevState, 1 )
          const swapTokenId = Minima.util.getStateVariable( cPrevState, 2 )
          let decAmount = new Decimal(Minima.util.getStateVariable( cPrevState, 3 ))

          // Status
          let status = MyOrders.statusWaiting
          const currBlk = new Decimal(Minima.block)
          const inBlk =  new Decimal(coinProof.inblock)
          const diff =  currBlk.sub(inBlk)

          if( diff.gte(Misc.MAX_ORDER_AGE) ) {

            status =  MyOrders.statusOld
          } else if( diff.gte(Misc.MIN_ORDER_AGE) ) {

            status =  MyOrders.statusLive
          }

    			// Calculate the (buy or sell) price..
    			let decPrice  = new Decimal(0)
          let isBuy = true

    			//BUY OR SELL
    			if( tokenId == "0x00" ) {
    				//Token is Minima - BUY
    				decPrice = coinAmount.div(decAmount)

    			} else {
    				//SELL
            isBuy = false
    				const scale = getTokenScale(tokenId, allTokens)
    				const scaledAmount = coinAmount.mul(scale)
    				decPrice = new Decimal(decAmount.div(scaledAmount))
    			}

    			//The total
    			const decTotal = decAmount.mul(decPrice)

          // Complete order
          let thisOrder: Order = {
            isBuy: isBuy,
            coinId: coinId,
            owner: owner,
            address: address,
            coinAmount: coinAmount,
            tokenId: tokenId,
            tokenName: tokenName,
            swapTokenId: swapTokenId,
            amount: decAmount,
            price: decPrice,
            total: decTotal,
            status: status
          }

          ordersData.data.push(thisOrder)
    		}

        dispatch(write({ data: ordersData.data })(actionType))

        justMyOrders ? console.log("my orders: ", ordersData, actionType) : console.log("all orders: ", ordersData, actionType)
      } else {

        Minima.log("Get orders failed")
      }
  	})
  }
}

/*
const getAllOrders = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract = state.script.data.scriptAddress
    const allOrders = state.orderBook.data
    const allTokens = state.tokens

    const currentTokenId = getCurrentToken( allTokens )

    Minima.cmd("coins address:"+dexContract, function( coinsJSON: any ) {

      let allOrdersData: OrderBookProps = {
        data: []
      }

      for( let i=0; i < coinsJSON.response.coins.length; i++ ) {

        //The Order
        const coinProof = coinsJSON.response.coins[i].data
        const coinId = coinProof.coin.coinid
        const coinAmount = new Decimal(coinProof.coin.amount)
        const tokenId = coinProof.coin.tokenid
        const tokenName = getTokenName(tokenId, allTokens)

        // Get state
        const cPrevState = coinProof.prevstate
        const owner = Minima.util.getStateVariable( cPrevState, 0 )
  			const address = Minima.util.getStateVariable( cPrevState, 1 )
        const swapTokenId  = Minima.util.getStateVariable( cPrevState, 2 )
        let decAmount = new Decimal(Minima.util.getStateVariable( cPrevState, 3 ))

        // Status
        let status = MyOrders.statusWaiting
        const currBlk = new Decimal(Minima.block)
        const inBlk =  new Decimal(coinProof.inblock)
        const diff =  currBlk.sub(inBlk)

        if( diff.gte(Misc.MAX_ORDER_AGE) ) {

          status =  MyOrders.statusOld
        } else if( diff.gte(Misc.MIN_ORDER_AGE) ) {

          status =  MyOrders.statusLive
        }

        // Calculate the (buy or sell) price..
      	var decPrice  = new Decimal(0)
        let isBuy = true

      	if ( tokenId == "0x00" ) {

          //BUY
      		decPrice  = coinAmount.div(decAmount)
      	} else {

          //SELL
          isBuy = false
          const scale = getTokenScale(tokenId, allTokens)
  				const scaledAmount = coinAmount.mul(scale)
  				decPrice = new Decimal(decAmount.div(scaledAmount))
      	}

        //The total
  			const decTotal = decAmount.mul(decPrice)

        // Complete order
        let thisOrder: Order = {
          isBuy: isBuy,
          coinId: coinId,
          owner: owner,
          address: address,
          coinAmount: coinAmount,
          tokenId: tokenId,
          tokenName: tokenName,
          swapTokenId: swapTokenId,
          amount: decAmount,
          price: decPrice,
          total: decTotal,
          status: status
        }

        allOrdersData.data.push(thisOrder)
      }

      dispatch(write({ data: allOrdersData.data })(OrderBookActionTypes.ADD_ORDERS))

      console.log("all orders: ", allOrdersData)

    })
  }
}
*/
