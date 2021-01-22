import { Minima } from 'minima'

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
  Order,
  AllTradesActionTypes,
  AllTradesProps,
  MyTradesActionTypes,
  MyTradesProps,
  Trade
} from '../../types'

import { Misc, Config, Orders as OrdersConfig } from '../../../config'

import { write } from '../../actions'

export const init = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

      Minima.init( function( msg: any ) {

        //console.log(msg)

        if ( msg.event == "connected" ) {

          dispatch(initDexxed())
          dispatch(getBalance())
          dispatch(getTokens())
          dispatch(getBlock())

  	 		} else if ( msg.event == "newblock" ) {

          dispatch(getTokens())
          dispatch(getBlock())

          const justMyOrders = true
          dispatch(getOrders(justMyOrders))
          // All orders (including mine)
          dispatch(getOrders(!justMyOrders))

          dispatch(getAllTrades())
          dispatch(getMyTrades())

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
            total:  tokens[i].total,
            isSelected: false
          }

          tokenData.data.push(thisToken)
        }

        dispatch(write({ data: tokenData.data })(TokenActionTypes.ADD_TOKENS))

        console.log("tokens: ", tokenData)

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

      //console.log("tokens: ",  tokens[i])

      const thisToken: Token = {
        tokenId: tokens[i].tokenid,
        tokenName: tokens[i].token,
        scale: tokens[i].scale,
        total:  tokens[i].total,
        isSelected: isSelected
      }

      tokenData.data.push(thisToken)
    }

    dispatch(write({ data: tokenData.data })(TokenActionTypes.ADD_TOKENS))

    console.log("Set tokens: ", tokenData)
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

    dispatch(write({ data: balanceData.data })(BalanceActionTypes.GET_BALANCES))

    console.log("balances: ", balanceData)
  }
}

const getTokenName = ( tokenId: string, tokens: TokenProps ): string => {

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

          console.log("This coin: ", coinData.response.coins[i].data)

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
          const swapTokenName = getTokenName(swapTokenId, allTokens)
          let decAmount = new Decimal(Minima.util.getStateVariable( cPrevState, 3 ))

          // Status
          let status = OrdersConfig.statusWaiting
          const currBlk = new Decimal(Minima.block)
          const inBlk =  new Decimal(coinProof.inblock)
          const diff =  currBlk.sub(inBlk)

          if( diff.gte(Misc.MAX_ORDER_AGE) ) {

            status =  OrdersConfig.statusOld
          } else if( diff.gte(Misc.MIN_ORDER_AGE) ) {

            status =  OrdersConfig.statusLive
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

const getAllTrades = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract = state.script.data.scriptAddress
    const allTokens = state.tokens

    Minima.cmd("txpowsearch input:" + dexContract + ";", function( tradesJSON: any ) {

      if( Minima.util.checkAllResponses(tradesJSON) ) {

        let tradesData: AllTradesProps = {
          data: []
        }

        const txPowList = tradesJSON[0].response.txpowlist
        for ( let i=0; i < txPowList.length; i++ ) {

          const txpItem = txPowList[i]

    			//check has more than 1 input..
    			const txPow = txPowList[i].txpow
    			if ( txPow.body.txn.inputs.length >1 && txpItem.isinblock ) {

            const coinProof = txPow.body.witness.mmrproofs[0].data
    				const coinId = coinProof.coin.coinid
      			const coinAmount = new Decimal(coinProof.coin.amount)
    				let tokenId = coinProof.coin.tokenid
            let tokenName = getTokenName(tokenId, allTokens)

            // Get the state we need
            const cPrevState = coinProof.prevstate
            let decAmount = new Decimal(Minima.util.getStateVariable( cPrevState, 3 ))

            // Calculate the (buy or sell) price..
      			let decPrice  = new Decimal(0)

            // To get this to match dexxed, you seem to have to reverse this from orders
            let isBuy = true
      			if( tokenId == "0x00" ) {

              isBuy = false
              decPrice = coinAmount.div(decAmount)
              tokenId = Minima.util.getStateVariable( cPrevState, 2 )
              tokenName = getTokenName(tokenId, allTokens)
      			} else {

      				const scale = getTokenScale(tokenId, allTokens)
      				const scaledAmount = coinAmount.mul(scale)
      				decPrice = new Decimal(decAmount.div(scaledAmount))
      			}

            //The total
      			const decTotal = decAmount.mul(decPrice)
            const blockTime   = txpItem.inblock

            // Complete order
            const thisTrade: Trade = {
              isBuy: isBuy,
              coindId: coinId,
              coinAmount: coinAmount,
              tokenId: tokenId,
              tokenName: tokenName,
              amount: decAmount,
              price: decPrice,
              total: decTotal,
              block: blockTime
            }

            tradesData.data.push(thisTrade)
          }
        }

        dispatch(write({ data: tradesData.data })(AllTradesActionTypes.ADD_TRADES))

        console.log("all trades: ", tradesData)

      } else {

        Minima.log("Get orders failed")
      }
    })
  }
}

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
              let tokenName = getTokenName(tokenId, allTokens)

              const cPrevState = coinProof.prevstate
              let decAmount = new Decimal(Minima.util.getStateVariable( cPrevState, 3 ))
              // Calculate the (buy or sell) price..
        			let decPrice  = new Decimal(0)

              // To get this to match dexxed, you seem to have to reverse this from orders
              let isBuy = true
              const value = new Decimal(txpItem.values[0].value)
              if( tokenId == "0x00" ) {

                tokenId = Minima.util.getStateVariable( cPrevState, 2 )
                tokenName = getTokenName(tokenId, allTokens)

                decPrice = coinAmount.div(decAmount)

                if( value.gte(0) ) {

                  isBuy = false
                }
              } else {

                // Get the state we need
                const scale = getTokenScale(tokenId, allTokens)
        				const scaledAmount = coinAmount.mul(scale)
        				decPrice = new Decimal(decAmount.div(scaledAmount))

                if ( value.lt(0) ) {

                  isBuy = false
                }
              }

              //The total
        			const decTotal = decAmount.mul(decPrice)
              const blockTime   = txpItem.inblock

              // Complete trade
              const thisTrade: Trade = {
                isBuy: isBuy,
                coindId: coinId,
                coinAmount: coinAmount,
                tokenId: tokenId,
                tokenName: tokenName,
                amount: decAmount,
                price: decPrice,
                total: decTotal,
                block: blockTime
              }

              tradesData.data.push(thisTrade)
            }
          }
        }

        dispatch(write({ data: tradesData.data })(MyTradesActionTypes.ADD_MYTRADES))

        console.log("my trades: ", tradesData)

      } else {

        Minima.log("Get my trades failed")
      }
    })
  }
}
