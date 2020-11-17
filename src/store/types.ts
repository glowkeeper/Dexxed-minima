import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { Decimal } from 'decimal.js'

// Store stuff
export interface ApplicationState {
  info: InfoPageProps
  chainInfo: ChainInfoProps
  script: ScriptProps
  balance: BalanceProps
  myOrders: MyOrdersProps
  orderBook: OrderBookProps
  allTrades: AllTradesProps
  myTrades: MyTradesProps
  tokens: TokenProps
  tx: TransactionProps
}

export interface PayloadProps {
  data: object
}

export interface ActionProps extends Action {
  type: string
  payload: PayloadProps
}

export type AppDispatch = ThunkDispatch<ApplicationState, any, ActionProps>

// Info (about etc.) stuff
export const enum InfoTypes {
  HOME = "home",
  ABOUT = "about",
  HELP = "help",
  FAQ = "faq",
  CONTACT = "contact"
}

// Static info
export interface InfoPageProps extends PayloadProps {
  data: InfoData
}

export interface InfoProps {
  title: string
  data: string
}

export interface InfoData {
  home: InfoProps
  about: InfoProps
  help: InfoProps
  faq: InfoProps
  contact: InfoProps
}

// Blockchain info
export interface ChainInfoProps extends PayloadProps {
  data: {
    block: string
  }
}

// Scripts
export interface ScriptProps extends PayloadProps {
  data: {
    scriptAddress: string
  }
}

// Tokens
export interface Token {
  tokenId: string
  token: string
  //total: number
  scale: number
  total: number
  isSelected: boolean
}

export interface TokenProps extends PayloadProps {
  data: Array<Token>
}

export interface Balance {
  token: string
  confirmed: string
  uncomfirmed: string
  mempool: string
}

export interface BalanceProps extends PayloadProps {
  data: Array<Balance>
}

// Orders
export interface Order {
  isBuy: boolean
  coinId: string
  owner: string
  address: string
  coinAmount: Decimal
  tokenId: string
  tokenName: string
  swapTokenId: string
  swapTokenName: string
  amount: Decimal
  price: Decimal
  total: Decimal
  status: string
}

export interface MyOrdersProps extends PayloadProps {
  data: Array<Order>
}

export interface OrderBookProps extends PayloadProps {
  data: Array<Order>
}

// Trades
export interface Trade {
  isBuy: boolean
  coinAmount: Decimal
  tokenName: string
  amount: Decimal
  price: Decimal
  total: Decimal
  block: string
}

export interface AllTradesProps extends PayloadProps {
  data: Array<Trade>
}

export interface MyTradesProps extends PayloadProps {
  data: Array<Trade>
}

// Get stuff
export interface Data {
  info: string
}

export interface GetProps extends PayloadProps {
  data: Array<Data>
}

//Tx stuff
export interface TxData {
  txId: string
  summary: string
  time: string
}

export interface TransactionProps extends PayloadProps {
  data: TxData
}

// Action types
export const enum TransactionActionTypes {
  TRANSACTION_INIT = '@@TransactionActionTypes/TRANSACTION_INIT',
  TRANSACTION_PENDING = '@@TransactionActionTypes/TRANSACTION_PENDING',
  TRANSACTION_SUCCESS = '@@TransactionActionTypes/TRANSACTION_SUCCESS',
  TRANSACTION_FAILURE = '@@TransactionActionTypes/TRANSACTION_FAILURE'
}

export const enum ChainInfoActionTypes {
  ADD_BLOCK = '@@ChainDataActionTypes/ADD_BLOCK'
}


export const enum ScriptActionTypes {
  ADD_CONTRACT = '@@ScriptActionTypes/ADD_CONTRACT',
}

export const enum TokenActionTypes {
  ADD_TOKENS = '@@TokenActionTypes/ADD_TOKENS'
}

export const enum BalanceActionTypes {
  GET_BALANCES = '@@BalanceActionTypes/GET_BALANCES'
}

export const enum OrderBookActionTypes {
  ADD_ORDERS = '@@OrderBookActionTypes/ADD_ORDERS'
}

export const enum MyOrdersActionTypes {
  ADD_MYORDERS = '@@MyOrdersActionTypes/ADD_MYORDERS'
}

export const enum AllTradesActionTypes {
  ADD_TRADES = '@@AllTradesActionTypes/ADD_TRADES'
}

export const enum MyTradesActionTypes {
  ADD_MYTRADES = '@@MyTradesActionTypes/ADD_MYTRADES'
}

export const enum GetActionTypes {
  GET_INIT = '@@GetActionTypes/GET_INIT',
  GET_SUCCESS = '@@GetActionTypes/GET_SUCCESS',
  GET_FAILURE = '@@GetActionTypes/GET_FAILURE'
}
