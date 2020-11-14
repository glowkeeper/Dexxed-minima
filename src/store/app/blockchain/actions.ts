// @ts-ignore
import { Minima } from './minima'

import { Decimal } from 'decimal.js'

import {
  AppDispatch,
  ScriptProps,
  ScriptActionTypes,
  TokenProps,
  Token,
  TokenActionTypes,
  BalanceActionTypes,
  BalanceProps,
  Balance,
  MyOrdersActionTypes,
  MyOrdersProps,
  MyOrder
} from '../../types'

import { Config } from '../../../config'

import { write } from '../../actions'

export const init = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

      Minima.init( function( msg: any ) {

        //console.log(msg)

        if ( msg.event == "connected" ) {

          dispatch(initDexxed())

  	 		} else if ( msg.event == "newblock" ) {

          //Call the Poll Function.. no need for a new thread polling..
          dispatch(getTokens())
          dispatch(getMyOrders())

  		 		/*
          UpdateBlockTime();
          UpdateMyOrders();
          */

        	/*UpdateOrderBook();
        	UpdateAllTrades();*/

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
       dispatch(getMyOrders())

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
            total:  tokens[i].total
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

export const getBlock = () => {

  return Minima.block

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

const getMyOrders = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract = state.script.data.scriptAddress
    const allTokens = state.tokens

    Minima.cmd("coins relevant address:"+dexContract, function( coinsJSON: any ){
  		//Get the details..
  		/*var cashtable="<table width=100% border=0>"+
  		"<tr> <th>TYPE</th> <th>TOKEN</th> <th>AMOUNT</th> <th>PRICE</th> <th>TOTAL</th> <th>&nbsp;</th> </tr>";*/

      let myOrdersData: MyOrdersProps = {
        data: []
      }

  		for( let i=0; i < coinsJSON.response.coins.length; i++ ) {

  			const coinProof  = coinsJSON.response.coins[i].data
  			const cPrevState = coinProof.prevstate

  			//get the PREVSTATE details that define the trade
  			const owner = Minima.util.getStateVariable( cPrevState, 0 )
  			const address = Minima.util.getStateVariable( cPrevState, 1 )
        //dex.js doesn't appear to use this
  			//const token = Minima.util.getStateVariable( cPrevState, 2 )
  			const amount = new Decimal(Minima.util.getStateVariable( cPrevState, 3 ))

  			//The Order
  			const coinId = coinProof.coin.coinid
  			const coinAmount = new Decimal(coinProof.coin.amount)
  			const coinToken  = coinProof.coin.tokenid
        const tradeToken = getTokenName(coinToken, allTokens)

  			//Calculate the price..
  			let decAmount = new Decimal(0)
  			let decPrice  = new Decimal(0)
  			let decTotal  = new Decimal(0)
        let isBuy = true

  			//BUY OR SELL
  			if(coinToken == "0x00"){
  				//Token is Minima - BUY
  				decAmount = amount
  				decPrice = coinAmount.div(decAmount)

  			} else {
  				//SELL
          isBuy = false
  				const scale = getTokenScale(coinToken, allTokens)
  				decAmount = coinAmount.mul(scale)
  				decPrice = amount.div(decAmount)
  			}

  			//The total
  			decTotal = decAmount.mul(decPrice)

        let myOrder: MyOrder = {
          isBuy: isBuy,
          coinId: coinId,
          owner: owner,
          address: address,
          coinAmount: coinAmount,
          coinToken: coinToken,
          tradeToken: tradeToken,
          decAmount: decAmount,
          decPrice: decPrice,
          decTotal: decTotal
        }

        myOrdersData.data.push(myOrder)

  			//Build it
  			/*cashtable+="<tr class='"+buysellclass+"'><td>"+buysellword+"</td>"
  			+" <td style='text-align:left'>"+tradetoken+"</td>"
  			+" <td style='text-align:left'>"+dec_amount+"</td>"
  			+"<td style='text-align:left'>"+dec_price+"</td> "
  			+"<td style='text-align:left'>"+dec_total+"</td> ";*/

  			//Are we deep enough..
        //Current block height
        /*const currBlk = new Decimal(Minima.block)
  			var inblk =  new Decimal(coinproof.inblock);
  			var diff  =  currblk.sub(inblk);
  			if(diff.gte(MAX_ORDER_AGE)){
  				cashtable+="<td><button id=\""+coin_id+"\" onclick='cancelOrder(\""+coin_id+"\",\""+owner+"\",\""+address+"\",\""+coin_amount+"\",\""+coin_token+"\");' class='cancelbutton'>TOO OLD</button> </td></tr>";
  			}else if(diff.gte(MIN_ORDER_AGE)){
  				cashtable+="<td><button id=\""+coin_id+"\" onclick='cancelOrder(\""+coin_id+"\",\""+owner+"\",\""+address+"\",\""+coin_amount+"\",\""+coin_token+"\");' class='cancelbutton'>CANCEL</button> </td></tr>";
  			}else{
  				cashtable+="<td>waiting..</td></tr>";
  			}*/
  		}

      //console.log("my orders: ", myOrdersData)

      dispatch(write({ data: myOrdersData.data })(MyOrdersActionTypes.ADD_MYORDERS))
  	})
  }
}
