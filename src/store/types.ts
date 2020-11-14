import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { Decimal } from 'decimal.js'

// Store stuff
export interface ApplicationState {
  info: InfoPageProps
  script: ScriptProps,
  balance: BalanceProps,
  myOrders: MyOrdersProps,
  orderBook: OrderBookProps,
  tokens: TokenProps,
  trades: TradeProps,
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
}

export interface TokenProps extends PayloadProps {
  data: Array<Token>
}

export interface Balance {
  confirmed: string
  uncomfirmed: string
  mempool: string
}

export interface BalanceProps extends PayloadProps {
  data: Array<Balance>
}

// Trades
export interface Trade {
  something: string
}

export interface TradeProps extends PayloadProps {
  data: Array<Trade>
}

export interface MyOrder {
  isBuy: boolean
  coinId: string
  owner: string
  address: string
  coinAmount: Decimal
  coinToken: string
  tradeToken: string
  decAmount: Decimal
  decPrice: Decimal
  decTotal: Decimal
}

export interface MyOrdersProps extends PayloadProps {
  data: Array<MyOrder>
}

export interface OrderBook {
  blah: string
}

export interface OrderBookProps extends PayloadProps {
  data: Array<OrderBook>
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

export const enum TradeActionTypes {
  ADD_TRADES = '@@TradeActionTypes/ADD_TRADES'
}

export const enum GetActionTypes {
  GET_INIT = '@@GetActionTypes/GET_INIT',
  GET_SUCCESS = '@@GetActionTypes/GET_SUCCESS',
  GET_FAILURE = '@@GetActionTypes/GET_FAILURE'
}
