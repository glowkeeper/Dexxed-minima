// @ts-ignore
import { Minima } from './minima'

import {
  AppDispatch,
  ChainDataProps,
  ChainDataActionTypes
} from '../../types'

import { Config } from '../../../config'

import { write } from '../../actions'

export const initBlockchain = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

      Minima.init()
      //Minima.logging = true
  }
}

export const initDexxed = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const dexContract  = "LET owner = PREVSTATE ( 0 ) IF SIGNEDBY ( owner ) THEN RETURN TRUE ENDIF LET address = PREVSTATE ( 1 ) LET token = PREVSTATE ( 2 ) LET amount = PREVSTATE ( 3 ) RETURN VERIFYOUT ( @INPUT address amount token )";

    //Tell Minima about this contract.. This allows you to spend it when the time comes
  	Minima.cmd("extrascript \"" + dexContract + "\";", function(respJSON: any) {

      if( Minima.util.checkAllResponses(respJSON) ) {

       const chainData: ChainDataProps = {
         data: {
           scriptAddress: respJSON[0].response.address.hexaddress
         }
       }

       dispatch(write({ data: chainData.data })(ChainDataActionTypes.ADD_CONTRACT))

     } else {

       Minima.log("extrascript failed")
     }

  		//Sort tokens..
  		/*alltokens = resp[1].response.tokens;
  		var len = alltokens.length;
  		if(len<2){
  			//No Tokens.. since Minima is first
  			document.getElementById("minima_tokenlist").innerHTML = "NO TOKENS FOUND.. &nbsp;&nbsp;<button onclick='window.location.href=\"\";' class=cancelbutton>REFRESH</button>";
  		}else{
  			//Create the Select Box
  			var toktext = "<b>TOKEN : </b> <select onchange='tokenSelectChange();' id='select_tokenlist'>"
  			for(var loop=1;loop<len;loop++){
  				var json = alltokens[loop];
  					toktext += "<option value='"+json.tokenid+"'>"+json.token+" ( "+json.total+" ) "+json.tokenid.substr(0,40)+"..</option>";
  			}
  			toktext += "</select> &nbsp;&nbsp;<button onclick='window.location.href=\"\";' class=cancelbutton>REFRESH</button>";

  			//And set it..
  			document.getElementById("minima_tokenlist").innerHTML = toktext;

  			//Set the Token..
  			tokenSelectChange();
  		}

  		//Basics
  		UpdateBalance()

  		//Run it once..
  		dexPollFunction();*/
  	})
  }
}
