import { Minima } from 'minima'

import { Decimal } from 'decimal.js'

import {
  AppDispatch,
  ScriptProps,
  ScriptActionTypes,
  AppDataActionTypes,
  AppData,
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
  OrderProps,
  Order,
  OrderStatus,
  AllTradesActionTypes,
  AllTradesProps,
  MyTradesActionTypes,
  MyTradesProps,
  TradeProps,
  Trade
} from '../../types'

import { Misc, Config, Orders as OrdersConfig } from '../../../config'

import { write } from '../../actions'

export const init = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

      const state = getState()

      Minima.init( function( msg: any ) {

        //console.log("init stuff", msg)

        if ( msg.event == "connected" ) {

          dispatch(write({data: {}})(AppDataActionTypes.APPDATA_INIT))
          dispatch(initDexxed())
          dispatch(getBalance())
          dispatch(getTokens())
          dispatch(getBlock())

  	 		} else if ( msg.event == "newblock" ) {

          if ( !state.appData.data.hasInitialised ) {

            const activePage = state.appData.data.activePage
            let appData: AppData = {
              activePage: activePage,
              hasInitialised: true
            }
            dispatch(write({data: appData})(AppDataActionTypes.APPDATA_SUCCESS))
          }

          dispatch(getTokens())
          dispatch(getBlock())

          const justMyOrders = true
          dispatch(getOrders(justMyOrders))
          // All orders (including mine)
          dispatch(getOrders(!justMyOrders))

          dispatch(getTrades())

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

       dispatch(write({ data: scriptData.data })(ScriptActionTypes.ADD_CONTRACT))

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

          //console.log("this token: ", tokens[i])

          const thisToken: Token = {
            tokenId: tokens[i].tokenid,
            tokenName: tokens[i].token,
            scale: tokens[i].scale,
            total:  tokens[i].total
          }

          tokenData.data.push(thisToken)
        }

        dispatch(write({ data: tokenData.data })(TokenActionTypes.ADD_TOKENS))

        //console.log("tokens: ", tokenData)

      } else {

        Minima.log("tokens failed")
      }
  	})
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
        unconfirmed: Minima.balance[i].unconfirmed,
        mempool: Minima.balance[i].mempool
      }

      balanceData.data.push(thisBalance)
    }

    dispatch(write({ data: balanceData.data })(BalanceActionTypes.GET_BALANCES))

    //console.log("balances: ", balanceData)
  }
}

export const getTokenName = ( tokenId: string, tokens: TokenProps ): string => {

  if( tokenId == "0x00" ) {
		return "Minima"
	}

	for ( let i = 0; i < tokens.data.length; i++) {
		//check it
		if( tokens.data[i].tokenId == tokenId ) {
			return tokens.data[i].tokenName
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

const sortOrderBook = (ordersData: OrderProps): Order[]  => {
  return ordersData.data.sort((a: Order, b: Order) => b.price.cmp(a.price))
}

const sortMyOrders = (ordersData: OrderProps): Order[] => {
  return  ordersData.data.sort((a: Order, b: Order) =>  a.tokenName.localeCompare(b.tokenName) || b.price.cmp(a.price))
}

export const getOrders = (justMyOrders: boolean) => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract = state.script.data.scriptAddress
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

          //console.log("This coin: ", coinData.response.coins[i].data)

          //The Order
          const coinProof  = coinData.response.coins[i].data
    			const coinId = coinProof.coin.coinid
    			let coinAmount = new Decimal(coinProof.coin.amount)
    			const tokenId = coinProof.coin.tokenid
          const tokenName = getTokenName(tokenId, allTokens)

          // Get state
          //State[], port: string):
    			const cPrevState = coinProof.prevstate

          const owner: string = Minima.util.getStateVariable( cPrevState, "0" ) as string
    			const address = Minima.util.getStateVariable( cPrevState, "1" ) as string
          const swapTokenId = Minima.util.getStateVariable( cPrevState, "2" ) as string
          const stateVar = Minima.util.getStateVariable( cPrevState, "3") as string
          let amount = stateVar ? new Decimal(stateVar) : new Decimal(0)

          // Status
          let status = OrderStatus.WAITING
          const currBlk = new Decimal(Minima.block)
          const inBlk =  new Decimal(coinProof.inblock)
          const diff =  currBlk.sub(inBlk)

          if( diff.gte(Misc.MAX_ORDER_AGE) ) {

            status =  OrderStatus.OLD
          } else if( diff.gte(Misc.MIN_ORDER_AGE) ) {

            status =  OrderStatus.LIVE
          }

    			// Calculate the (buy or sell) price..
    			let decPrice  = new Decimal(0)
    			let decTotal  = new Decimal(0)
          let isBuy = true
          let swapTokenName = getTokenName(swapTokenId, allTokens)

    			//BUY OR SELL
    			if( tokenId == "0x00" ) {
    				//Token is Minima - BUY
    				decPrice = coinAmount.div(amount)
            decTotal = amount.mul(decPrice)

            //console.log("buy: ", amount.toFixed(), coinAmount.toFixed(), decPrice.toFixed(), decTotal.toFixed())

    			} else {

    				//SELL
            isBuy = false
            const scale = getTokenScale(tokenId, allTokens)
            const thisAmount = amount
            amount = coinAmount.mul(scale)
            decTotal = thisAmount
            decPrice = decTotal.div(amount)
            //const thisAmount = amount.div(scale)
            //coinAmount = thisAmount

            //console.log("sell order: ", coinProof, amount.toFixed(), coinAmount.toFixed(), decPrice.toFixed(), decTotal.toFixed())
    			}

          // Complete order
          const thisOrder: Order = {
            isBuy: isBuy,
            coinId: coinId,
            owner: owner,
            address: address,
            coinAmount: coinAmount,
            tokenId: tokenId,
            tokenName: tokenName,
            swapTokenId: swapTokenId,
            swapTokenName: swapTokenName,
            amount: amount,
            price: decPrice,
            total: decTotal,
            status: status
          }

          ordersData.data.push(thisOrder)
    		}

        const sortedOrders = justMyOrders ? sortMyOrders(ordersData) : sortOrderBook(ordersData)
        dispatch(write({ data: sortedOrders })(actionType))

        //justMyOrders ? console.log("my orders: ", ordersData, actionType) : console.log("all orders: ", ordersData, actionType)
      } else {

        Minima.log("Get orders failed")
      }
  	})
  }
}

const sortTrades = (tradesData: TradeProps): Trade[]  => {
  return tradesData.data.sort((a: Trade, b: Trade) => b.block.localeCompare(a.block))
}

const getTrades = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract = state.script.data.scriptAddress
    const allTokens = state.tokens

    Minima.cmd("txpowsearch input:" + dexContract + ";", function( tradesJSON: any ) {

      if( Minima.util.checkAllResponses(tradesJSON) ) {

        let tradesData: AllTradesProps = {
          data: []
        }

        let myTradesData: MyTradesProps = {
          data: []
        }

        const txPowList = tradesJSON[0].response.txpowlist
        for ( let i=0; i < txPowList.length; i++ ) {

          const txpItem = txPowList[i]

          //console.log("tx: ", txpItem)

    			//check has more than 1 input..
    			const txPow = txPowList[i].txpow
    			if ( txPow.body.txn.inputs.length >1 && txpItem.isinblock ) {

            const coinProof = txPow.body.witness.mmrproofs[0].data
    				const coinId = coinProof.coin.coinid
      			const coinAmount = new Decimal(coinProof.coin.amount)
    				let tokenId = coinProof.coin.tokenid

            // Get the state we need
            const cPrevState = coinProof.prevstate
            let amount = new Decimal(Minima.util.getStateVariable( cPrevState, "3" ) as string)
            let tokenName = getTokenName(tokenId, allTokens)

            //console.log("trades amount: ", tokenName, amount.toFixed(), coinAmount.toFixed())

            // Calculate the (buy or sell) price..
      			let decPrice  = new Decimal(0)
      			let decTotal  = new Decimal(0)

            let isBuy = true
      			if( tokenId == "0x00" ) {

              isBuy = false
              tokenId = Minima.util.getStateVariable( cPrevState, "2" ) as string
              tokenName = getTokenName(tokenId, allTokens)
              decPrice = coinAmount.div(amount)
              decTotal = amount.mul(decPrice)

      			} else {

              const scale = getTokenScale(tokenId, allTokens)
              const thisAmount = amount
      				amount = coinAmount.mul(scale)
              decTotal = thisAmount
      				decPrice = thisAmount.div(amount)
      			}

            const blockTime   = txpItem.inblock

            // Complete order
            const thisTrade: Trade = {
              isBuy: isBuy,
              coindId: coinId,
              coinAmount: coinAmount,
              tokenId: tokenId,
              tokenName: tokenName,
              amount: amount,
              price: decPrice,
              total: decTotal,
              block: blockTime
            }

            tradesData.data.push(thisTrade)

            // my trades
            if( txpItem.relevant ) {

              const value = new Decimal(txpItem.values[0].value)
              let myTrade = thisTrade
        			if( tokenId == "0x00" ) {

                if( value.lte(0) ) {

                  myTrade.isBuy = true
                }

        			} else {

                if ( value.lte(0) ) {

                  myTrade.isBuy = false
                }
        			}
              myTradesData.data.push(thisTrade)
            }
          }
        }

        const sortedAllTrades = sortTrades(tradesData)
        const sortedMyTrades = sortTrades(myTradesData)

        dispatch(write({ data: sortedAllTrades })(AllTradesActionTypes.ADD_TRADES))
        dispatch(write({ data: sortedMyTrades })(MyTradesActionTypes.ADD_MYTRADES))

      } else {

        Minima.log("Get orders failed")
      }
    })
  }
}

/*
const getMyTrades = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract = state.script.data.scriptAddress
    const allTokens = state.tokens

    Minima.cmd("txpowsearch input:" + dexContract + ";", function( tradesJSON: any ) {

      if( Minima.util.checkAllResponses(tradesJSON) ) {

        let tradesData: MyTradesProps = {
          data: []
        }

        const txPowList = tradesJSON[0].response.txpowlist
        for ( let i=0; i < txPowList.length; i++ ) {

          const txpItem = txPowList[i]

          // Check if this is one of mine
          if( txpItem.relevant ) {

      			//check has more than 1 input..
      			const txPow = txPowList[i].txpow
      			if ( txPow.body.txn.inputs.length >1 && txpItem.isinblock ) {

              const coinProof = txPow.body.witness.mmrproofs[0].data
      				const coinId = coinProof.coin.coinid
        			const coinAmount = new Decimal(coinProof.coin.amount)
      				let tokenId = coinProof.coin.tokenid

              const cPrevState = coinProof.prevstate
              let amount = new Decimal(Minima.util.getStateVariable( cPrevState, "3" ) as string)
              let tokenName = getTokenName(tokenId, allTokens)

        			let decPrice  = new Decimal(0)
              let decTotal  = new Decimal(0)
              const value = new Decimal(txpItem.values[0].value)

              let isBuy = true
        			if( tokenId == "0x00" ) {

                isBuy = false
                tokenId = Minima.util.getStateVariable( cPrevState, "2" ) as string
                tokenName = getTokenName(tokenId, allTokens)
                decPrice = coinAmount.div(amount)
                decTotal = amount.mul(decPrice)

                if( value.lte(0) ) {

                  isBuy = true
                }

        			} else {

                const scale = getTokenScale(tokenId, allTokens)
                const thisAmount = amount
        				amount = coinAmount.mul(scale)
                decTotal = thisAmount
        				decPrice = thisAmount.div(amount)

                if ( value.lte(0) ) {

                  isBuy = false
                }
        			}

              const blockTime   = txpItem.inblock

              // Complete trade
              const thisTrade: Trade = {
                isBuy: isBuy,
                coindId: coinId,
                coinAmount: coinAmount,
                tokenId: tokenId,
                tokenName: tokenName,
                amount: amount,
                price: decPrice,
                total: decTotal,
                block: blockTime
              }

              tradesData.data.push(thisTrade)
            }
          }
        }

        dispatch(write({ data: tradesData.data })(MyTradesActionTypes.ADD_MYTRADES))

        //console.log("my trades: ", tradesData)

      } else {

        Minima.log("Get my trades failed")
      }
    })
  }
}
*/
