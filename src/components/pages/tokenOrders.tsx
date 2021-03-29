import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { Decimal } from 'decimal.js'

import { setBuyOrdersDisabled, setSellOrdersDisabled } from '../../store/app/appData/actions'
import { takeOrder } from '../../store/app/blockchain/tx/actions'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

import Spinner from 'react-spinner-material'

import confirmIcon from '../../images/tickIcon.svg'
import cancelIcon from '../../images/crossIcon.svg'

import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'

import { Help, Balances } from '../../config'

import {
  OrderBook
} from '../../config/strings'

import { themeStyles } from '../../styles'

import {
  ApplicationState,
  AppDispatch,
  BalanceProps,
  Balance,
  OrderBookProps,
  Order,
  NewOrder,
  Token
} from '../../store'

interface TokenOrderProps {
  token: Token
}

interface OrdersStateProps {
  initialised: boolean
  balanceData: BalanceProps
  orderData: OrderBookProps
  buyOrdersDisabled: boolean[],
  sellOrdersDisabled: boolean[]
}

interface OrdersDispatchProps {
  setSellOrdersDisabled: (orders: boolean[]) => void
  setBuyOrdersDisabled: (orders: boolean[]) => void
  takeOrder: (order: Order) => void
}

type Props = TokenOrderProps & OrdersStateProps & OrdersDispatchProps

const display = (props: Props) => {

  const [isLoading, setIsLoading] = useState(true)
  let [ordersLength, setOrdersLength] = useState(0)
  let [buyDisabled, setBuyDisabled] = useState([] as boolean[])
  let [sellDisabled, setSellDisabled] = useState([] as boolean[])

  const [take, setTake] = useState ({
    isBuy: true,
    coinId: "",
    owner: "",
    address: "",
    coinAmount: new Decimal(0),
    tokenId: "",
    tokenName: "",
    swapTokenId: "",
    swapTokenName: "",
    amount: new Decimal(0),
    price: new Decimal(0),
    total: new Decimal(0),
    status: ""
  } as Order)
  const [takeOrderDialogue, setTakeOrderDialogue] = useState({
    isOpen: false,
    isBuy: true,
    buttonIndex: 0
  })

  const classes = themeStyles()

  const processTakeOrder = (order: Order, isBuy: boolean, index: number) => {
    //console.log("Take! ", order)
    if ( isBuy ) {

      buyDisabled[index] = true
      setTakeOrderDialogue({
        isOpen: true,
        isBuy: true,
        buttonIndex: index
      })

    } else {

      sellDisabled[index] = true
      setTakeOrderDialogue({
        isOpen: true,
        isBuy: false,
        buttonIndex: index
      })
    }

    setTake(order)
  }

  const takeOrderDialogueClose = () => {

    takeOrderDialogue.isBuy ? buyDisabled[takeOrderDialogue.buttonIndex] = false : sellDisabled[takeOrderDialogue.buttonIndex] = false
    setTakeOrderDialogue({
      isOpen: false,
      isBuy: true,
      buttonIndex: 0
    })
  }

  const doTakeOrder = () => {
    setTakeOrderDialogue({
      isOpen: false,
      isBuy: true,
      buttonIndex: 0
    })

    props.setSellOrdersDisabled(sellDisabled)
    props.setBuyOrdersDisabled(buyDisabled)
    props.takeOrder(take)
  }

  let buyRowCounter = 0
  let sellRowCounter = 0
  let tokenAmount = (new Decimal(0)).toFixed(2)
  let tokenUnconfirmed = (new Decimal(0)).toFixed(2)
  let tokenMempool = (new Decimal(0)).toFixed(2)

  useEffect(() => {

    if ( ( props.initialised ) &&
         ( isLoading ) ) {

      setIsLoading(false)
    }

    //console.log("buy and sell", props.buyOrdersDisabled.length, props.sellOrdersDisabled.length)
    //console.log("Orders length", props.orderData.data.length, ordersLength)

    //console.log("buys", props.buyOrdersDisabled)
    //console.log("sells", props.sellOrdersDisabled)

    const disabledLength = props.buyOrdersDisabled.length + props.sellOrdersDisabled.length

    if ( ( props.orderData.data ) &&
         ( props.orderData.data.length ) &&
         ( props.orderData.data.length == disabledLength ) ) {

       //console.log("Am I here?")

       for (let i = 0; i < props.buyOrdersDisabled.length; i++ ) {
         buyDisabled[i] = props.buyOrdersDisabled[i]
       }

       for (let i = 0; i < props.sellOrdersDisabled.length; i++ ) {
         sellDisabled[i] = props.sellOrdersDisabled[i]
       }

    } else {

      //console.log("Or am I here?")
      let buyCounter = 0
      let sellCounter = 0
      for (let i = 0; i < props.orderData.data.length; i++ ) {
        if ( props.orderData.data[i].isBuy ) {
          buyDisabled[buyCounter] = false
          buyCounter += 1
        } else {
          sellDisabled[sellCounter] = false
          sellCounter += 1
        }
      }

      props.setBuyOrdersDisabled(buyDisabled)
      props.setSellOrdersDisabled(sellDisabled)
    }

    ordersLength = props.orderData.data.length

  }, [props.orderData, props.initialised, props.buyOrdersDisabled, props.sellOrdersDisabled])

  return (

    <>

    { props.token.tokenName ?

      <Grid container alignItems="flex-start">

        <Grid item container justify="flex-start" xs={3}>
          <Typography variant="h3">
            {props.token.tokenName}
          </Typography>
        </Grid>

        <Grid item container justify="flex-end" xs={3}>
          <Typography variant="h3">
            {Balances.amount}
          </Typography>
        </Grid>
        <Grid item container justify="flex-end" xs={3}>
          <Typography variant="h3">
            {Balances.unconfirmed}
          </Typography>
        </Grid>
        <Grid item container justify="flex-end" xs={3}>
          <Typography variant="h3">
            {Balances.mempool}
          </Typography>
        </Grid>

        <Grid item container justify="flex-start" xs={12}>
          <svg
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 2000 4"
          >
            <line x2="2000" stroke="#001c32" strokeWidth={4} />
          </svg>
        </Grid>

        {
          <>
            { props.balanceData.data.map( ( balance: Balance, index: number ) => {

              if ( balance.token == props.token.tokenName ) {

                const amount = +balance.confirmed
                const unconfirmed = +balance.unconfirmed
                const mempool = +balance.mempool

                tokenAmount = amount.toFixed(2)
                tokenUnconfirmed = unconfirmed.toFixed(2)
                tokenMempool = mempool.toFixed(2)
              }

              return ( null )
            })}

            <Grid item container xs={12}>

              <Grid item container justify="flex-start" xs={3}>
               <Typography variant="h3">
                 &nbsp;
               </Typography>
              </Grid>
              <Grid item container justify="flex-end" xs={3}>
               <Typography variant="body2">
                 {tokenAmount}
               </Typography>
              </Grid>
              <Grid item container justify="flex-end" xs={3}>
                <Typography variant="body2">
                  {tokenUnconfirmed}
                </Typography>
              </Grid>
              <Grid item container justify="flex-end" xs={3}>
                <Typography variant="body2">
                  {tokenMempool}
                </Typography>
              </Grid>

            </Grid>

          </>
        }

        {
          <>

            <Grid item container justify="space-evenly" xs={12}>
              <Grid item container justify="center" xs={2}>
                <Typography style={{color: OrderBook.buyColour}} variant="h3">
                  {OrderBook.total}
                </Typography>
              </Grid>
              <Grid item container justify="center" xs={2}>
                <Typography style={{color: OrderBook.buyColour}} variant="h3">
                  {OrderBook.amount}
                </Typography>
              </Grid>
              <Grid item container justify="center" xs={2}>
                <Typography style={{color: OrderBook.buyColour}} variant="h3">
                  {OrderBook.price}
                </Typography>
              </Grid>

              <Grid item container justify="center" xs={2}>
                <Typography style={{color: OrderBook.sellColour}} variant="h3">
                  {OrderBook.price}
                </Typography>
              </Grid>
              <Grid item container justify="center" xs={2}>
                <Typography style={{color: OrderBook.sellColour}} variant="h3">
                  {OrderBook.amount}
                </Typography>
              </Grid>
              <Grid item container justify="center" xs={2}>
                <Typography style={{color: OrderBook.sellColour}} variant="h3">
                  {OrderBook.total}
                </Typography>
              </Grid>

              <Grid item container justify="flex-start" xs={12}>
                <svg
                   xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 2000 4"
                >
                  <line x2="2000" stroke="#001c32" strokeWidth={4} />
                </svg>
              </Grid>
            </Grid>

            { isLoading ?

              <Grid className={classes.details} item container justify="center">
                <Spinner
                  radius={40}
                  color={"#001C32"}
                  stroke={5}
                  visible={isLoading}
                />
              </Grid> : (

                <Grid item container justify="space-evenly" xs={6}>

                  {props.orderData.data.map( ( order: Order, index: number ) => {

                    if ( ( order.swapTokenId == props.token.tokenId ) &&
                         ( order.isBuy ) ) {

                      //console.log("Isbuy order: ", +order.amount.toFixed(2), +order.coinAmount.toFixed(2) )
                      const type = OrderBook.buy
                      const colour = OrderBook.buyColour

                      const amount = +order.amount
                      const thisAmount = amount.toFixed(2)

                      const price = +order.price
                      const thisPrice = price.toFixed(2)

                      const total = +order.total
                      const thisTotal = total.toFixed(2)

                      const thisIndex = buyRowCounter
                      let rowColour = buyRowCounter % 2 ? '#FAFAFF' : '#F5F3F2'
                      if ( buyDisabled[thisIndex] ) {
                        rowColour = '#C8C8D4'
                      }
                      buyRowCounter += 1

                      return (
                        <React.Fragment key={index}>

                          <Grid item container xs={12}>

                            <Button
                              onClick={() => processTakeOrder(order, true, thisIndex)}
                              disabled={buyDisabled[thisIndex]}
                              style={{
                                width: "100%",
                                backgroundColor: rowColour,
                                textTransform: 'none',
                                fontSize: "1em",
                                lineHeight: "1",
                                borderRadius: 0,
                                padding: 0
                              }}
                            >
                              <Grid item xs={4}>
                               <Typography style={{color: colour}} variant="body2">
                                 {thisTotal}
                               </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography style={{color: colour}} variant="body2">
                                   {thisAmount}
                                 </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography style={{color: colour}} variant="body2">
                                   {thisPrice}
                                 </Typography>
                              </Grid>
                            </Button>

                          </Grid>

                        </React.Fragment>
                      )
                    }
                  })}
                </Grid>
              )
            }
            <Grid item container justify="space-evenly" xs={6}>

              {props.orderData.data.map( ( order: Order, index: number ) => {


                if ( ( order.tokenId == props.token.tokenId ) &&
                     ( !order.isBuy ) ) {

                  //console.log("Issell order: ", +order.amount.toFixed(2), +order.coinAmount.toFixed(2) )

                  const type = OrderBook.sell
                  const colour = OrderBook.sellColour

                  const amount = +order.amount
                  const thisAmount = amount.toFixed(2)

                  const price = +order.price
                  const thisPrice = price.toFixed(2)

                  const total = +order.total
                  const thisTotal = total.toFixed(2)

                  const thisIndex = sellRowCounter
                  let rowColour = sellRowCounter % 2 ? '#FAFAFF' : '#F5F3F2'
                  if ( sellDisabled[thisIndex] ) {
                    rowColour = '#C8C8D4'
                  }
                  sellRowCounter += 1

                  return (

                    <React.Fragment key={index}>

                      <Grid item container xs={12}>
                        <Button
                          onClick={() => processTakeOrder(order, false, thisIndex)}
                          disabled={sellDisabled[thisIndex]}
                          style={{
                            width: "100%",
                            backgroundColor: rowColour,
                            textTransform: 'none',
                            fontSize: "1em",
                            lineHeight: "1",
                            borderRadius: 0,
                            padding: 0
                          }}
                        >
                          <Grid item xs={4}>
                            <Typography style={{color: colour}} variant="body2">
                               {thisPrice}
                             </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography style={{color: colour}} variant="body2">
                               {thisAmount}
                             </Typography>
                          </Grid>
                          <Grid item xs={4}>
                           <Typography style={{color: colour}} variant="body2">
                             {thisTotal}
                           </Typography>
                          </Grid>
                        </Button>
                      </Grid>

                    </React.Fragment>
                  )
                }
              })}
            </Grid>
          </>
        }

      </Grid>

      : (
        null
      )

    }

      <Modal
        aria-labelledby={Help.takeOrderSure}
        aria-describedby={Help.takeOrderSure}
        className={classes.orderModal}
        open={takeOrderDialogue.isOpen}
        onClose={takeOrderDialogueClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={takeOrderDialogue.isOpen}>
          <div className={classes.orderModalSub}>
              { take.isBuy ?
                <Typography variant="h3">
                  You are about to sell {take.amount.toString()} {props.token.tokenName} at {take.price.toString()} Minima each. You will receive {take.total.toString()} Minima
                </Typography>
                : (
                  <Typography variant="h3">
                    You are about to buy {take.amount.toString()} {props.token.tokenName} at {take.price.toString()} Minima each. You will spend {take.total.toString()} Minima
                  </Typography>
                )
              }

            <br/>
            <div className={classes.orderModalSubIcons}>
              <IconButton
                onClick={takeOrderDialogueClose}
                color="primary"
                aria-label={Help.cancelTip}
                component="span"
                size="small">
                <img
                  src={cancelIcon}
                  className={classes.cancelIcon}
                />
              </IconButton>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <IconButton
                onClick={() => doTakeOrder()}
                color="primary"
                aria-label={Help.orderTip}
                component="span"
                size="small">
                <img
                  src={confirmIcon}
                  className={classes.confirmIcon}
                />
              </IconButton>
            </div>
          </div>
        </Fade>
      </Modal>

    </>
  )
}

const mapStateToProps = (state: ApplicationState): OrdersStateProps => {

  const orders = state.orderBook as OrderBookProps
  const balances = state.balance as BalanceProps
  const hasInitialised = state.appData.data.hasInitialised
  const buyOrdersDisabled = state.appData.data.buyOrderDisabled
  const sellOrdersDisabled = state.appData.data.sellOrderDisabled
  return {
    initialised: hasInitialised,
    orderData: orders,
    balanceData: balances,
    buyOrdersDisabled: buyOrdersDisabled,
    sellOrdersDisabled: sellOrdersDisabled
  }
}

const mapDispatchToProps = (dispatch: AppDispatch): OrdersDispatchProps => {
 return {
   setSellOrdersDisabled: (orders: boolean[]) => dispatch(setSellOrdersDisabled(orders)),
   setBuyOrdersDisabled: (orders: boolean[]) => dispatch(setBuyOrdersDisabled(orders)),
   takeOrder: (order: Order) => dispatch(takeOrder(order))
 }
}

export const TokenOrders = connect<OrdersStateProps, OrdersDispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(display)
