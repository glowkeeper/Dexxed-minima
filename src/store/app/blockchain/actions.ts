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
          dispatch(getMyOrders())
          dispatch(getAllOrders())

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
       dispatch(getMyOrders())
       dispatch(getAllOrders())

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

const getMyOrders = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract = state.script.data.scriptAddress
    const myOrders = state.myOrders.data
    const allTokens = state.tokens

    Minima.cmd("coins relevant address:"+dexContract, function( coinsJSON: any ){

      let myOrdersData: MyOrdersProps = {
        data: []
      }

      for( let i=0; i < coinsJSON.response.coins.length; i++ ) {

        const coinProof  = coinsJSON.response.coins[i].data
  			const cPrevState = coinProof.prevstate

        const owner = Minima.util.getStateVariable( cPrevState, 0 )
  			const address = Minima.util.getStateVariable( cPrevState, 1 )
        //dex.js doesn't appear to use this here
        //const token = Minima.util.getStateVariable( cPrevState, 2 )
        const amount = new Decimal(Minima.util.getStateVariable( cPrevState, 3 ))

        let status = MyOrders.statusWaiting
        const currBlk = new Decimal(Minima.block)
        const inBlk =  new Decimal(coinProof.inblock)
        const diff =  currBlk.sub(inBlk)

        if( diff.gte(Misc.MAX_ORDER_AGE) ) {

          status =  MyOrders.statusOld
        } else if( diff.gte(Misc.MIN_ORDER_AGE) ) {

          status =  MyOrders.statusLive
        }

        //The Order
  			const coinId = coinProof.coin.coinid
  			const coinAmount = new Decimal(coinProof.coin.amount)
  			const coinToken  = coinProof.coin.tokenid
        const tradeToken = getTokenName(coinToken, allTokens)

  			//Calculate the price..
  			let decAmount = amount
  			let decPrice  = new Decimal(0)
        let isBuy = true

  			//BUY OR SELL
  			if(coinToken == "0x00") {
  				//Token is Minima - BUY
  				decPrice = coinAmount.div(decAmount)

  			} else {
  				//SELL
          isBuy = false
  				const scale = getTokenScale(coinToken, allTokens)
  				decAmount = coinAmount.mul(scale)
  				decPrice = new Decimal(amount.div(decAmount))
  			}

  			//The total
  			const decTotal = decAmount.mul(decPrice)

        let myOrder: Order = {
          isBuy: isBuy,
          coinId: coinId,
          owner: owner,
          address: address,
          coinAmount: coinAmount,
          coinToken: coinToken,
          tradeToken: tradeToken,
          decAmount: decAmount,
          decPrice: decPrice,
          decTotal: decTotal,
          status: status
        }

        myOrdersData.data.push(myOrder)
  		}

      dispatch(write({ data: myOrdersData.data })(MyOrdersActionTypes.ADD_MYORDERS))

      //console.log("my orders: ", myOrdersData)
  	})
  }
}

const getAllOrders = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract = state.script.data.scriptAddress
    const allOrders = state.orderBook.data
    const allTokens = state.tokens

    const currentToken = getCurrentToken( allTokens )

    Minima.cmd("coins address:"+dexContract, function( coinsJSON: any ) {

      let allOrdersData: OrderBookProps = {
        data: []
      }

      for( let i=0; i < coinsJSON.response.coins.length; i++ ) {
      }

    })
  }
}

/*
//Search for all the coins of this address
Minima.cmd("coins address:"+dexaddress, function(coinsjson){
  //Cycle through the results..
  var tokenorders_buy  = [];
  var tokenorders_sell = [];
  var coinlen = coinsjson.response.coins.length;
  for(i=0;i<coinlen;i++){
    var coindata = coinsjson.response.coins[i].data;

    var token      = coindata.coin.tokenid;
    var swaptoken  = Minima.util.getStateVariable(coindata.prevstate,2);//getCoinPrevState(coindata,2);

    if(token == currentToken.tokenid){
      tokenorders_sell.push(coindata);
    }else if(swaptoken==currentToken.tokenid){
      tokenorders_buy.push(coindata);
    }
  }

  //Now ORDER the list..
  tokenorders_sell.sort(comparePrice);
  tokenorders_buy.sort(comparePrice);

  //Make the Orderbook
  var cashtable="<table width=100%>";

  //Current block height
  var currblk = new Decimal(Minima.block);

  //Reset These..
  MIN_TOTAL    = new Decimal(0);
  MAX_TOTAL    = new Decimal(0);

  //Sell Orders
  for(i=0;i<tokenorders_sell.length;i++){
    //Trade details..
    var amount  = getOrderAmount(tokenorders_sell[i]);
    var price   = getOrderPrice(tokenorders_sell[i]);
    var total   = amount.mul(price);

    if(total.lt(MIN_TOTAL)){MIN_TOTAL=total;}
    if(total.gt(MAX_TOTAL)){MAX_TOTAL=total;}

    //Check within range..
    if(total.gte(SLIDER_VALUE)){
      var coinid     = tokenorders_sell[i].coin.coinid;
      var coinamount = tokenorders_sell[i].coin.amount;
      var cointoken  = tokenorders_sell[i].coin.tokenid;

      var reqaddress = Minima.util.getStateVariable(tokenorders_sell[i].prevstate,1);//getCoinPrevState(tokenorders_sell[i],1);
      var reqtokenid = Minima.util.getStateVariable(tokenorders_sell[i].prevstate,2);//getCoinPrevState(tokenorders_sell[i],2);
      var reqamount  = Minima.util.getStateVariable(tokenorders_sell[i].prevstate,3);//getCoinPrevState(tokenorders_sell[i],3);

      //Are we deep enough..
      var inblk =  new Decimal(tokenorders_sell[i].inblock);
      var diff  =  currblk.sub(inblk);
      if(diff.gte(MAX_ORDER_AGE)){
        //Too OLD! = no one but you can see it..
//					cashtable+="<tr class='infoboxpurple'><td width=33%>"+amount+"</td> <td width=34%>"+price+"</td> <td width=33%>"+total+"</td> </tr>";
      }else if(diff.gte(MIN_ORDER_AGE)){
        //Create the order function
        var tkorder = "takeOrder('BUY', '"+coinid+"', '"+coinamount+"', '"+cointoken+"', '"+reqaddress+"', '"+reqamount+"', '"+reqtokenid+"', '"+price+"', '"+amount+"', '"+total+"' );";
        cashtable+="<tr style='cursor: pointer;' class='infoboxred' onclick=\""+tkorder+"\">"
              +"<td width=33%>"+amount+"</td> <td width=34%>"+price+"</td> <td width=33%>"+total+"</td> </tr>";
      }else{
        cashtable+="<tr class='infoboxgrey'><td width=33%>"+amount+"</td> <td width=34%>"+price+"</td> <td width=33%>"+total+"</td> </tr>";
      }
    }
  }

  //Then the middle..
  cashtable+="<tr class='infoboxblue'><td colspan=3>-------</td></tr>"

  //Buy orders
  for(i=0;i<tokenorders_buy.length;i++){
    //Trade details..
    var amount  = getOrderAmount(tokenorders_buy[i]);
    var price   = getOrderPrice(tokenorders_buy[i]);
    var total   = amount.mul(price);

    if(total.lt(MIN_TOTAL)){MIN_TOTAL=total;}
    if(total.gt(MAX_TOTAL)){MAX_TOTAL=total;}

    //Check within range..
    if(total.gte(SLIDER_VALUE)){
      var coinid     = tokenorders_buy[i].coin.coinid;
      var coinamount = tokenorders_buy[i].coin.amount;
      var cointoken  = tokenorders_buy[i].coin.tokenid;

      var reqaddress = Minima.util.getStateVariable(tokenorders_buy[i].prevstate,1);//getCoinPrevState(tokenorders_buy[i],1);
      var reqtokenid = Minima.util.getStateVariable(tokenorders_buy[i].prevstate,2);//getCoinPrevState(tokenorders_buy[i],2);
      var reqamount  = Minima.util.getStateVariable(tokenorders_buy[i].prevstate,3);//getCoinPrevState(tokenorders_buy[i],3);

      //Are we deep enough..
      var inblk =  new Decimal(tokenorders_buy[i].inblock);
      var diff  =  currblk.sub(inblk);
      if(diff.gte(MAX_ORDER_AGE)){
        //Too OLD! = no one but you can see it..
//					cashtable+="<tr class='infoboxpurple'> <td width=33%>"+amount+"</td> <td width=34%>"+price+"</td> <td width=33%>"+total+"</td> </tr>";
      }else if(diff.gte(MIN_ORDER_AGE)){
        //Create the order function
        var tkorder = "takeOrder('SELL', '"+coinid+"', '"+coinamount+"', '"+cointoken+"', '"+reqaddress+"', '"+reqamount+"', '"+reqtokenid+"', '"+price+"', '"+amount+"', '"+total+"' );";
        cashtable+="<tr style='cursor: pointer;' class='infoboxgreen' onclick=\""+tkorder+"\">"
              +"<td width=33%>"+amount+"</td> <td width=34%>"+price+"</td> <td width=33%>"+total+"</td> </tr>";
      }else{
        cashtable+="<tr class='infoboxgrey'> <td width=33%>"+amount+"</td> <td width=34%>"+price+"</td> <td width=33%>"+total+"</td> </tr>";
      }
    }
  }

  //Finish up..
  cashtable+="</table>";

  //Set it..
  document.getElementById("dexxed_orderbook").innerHTML = cashtable;
});*/
