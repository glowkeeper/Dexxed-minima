import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Decimal } from 'decimal.js'

import { takeOrder } from '../../store/app/blockchain/tx/actions'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

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
  balanceData: BalanceProps
  orderData: OrderBookProps
}

interface OrdersDispatchProps {
  takeOrder: (order: Order) => void
}

type Props = TokenOrderProps & OrdersStateProps & OrdersDispatchProps

const display = (props: Props) => {

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
  const [takeOrderDialogue, setTakeOrderDialogue] = useState(false)

  const classes = themeStyles()

  const processTakeOrder = (order: Order) => {
    //console.log("Take! ", order)
    setTake(order)
    setTakeOrderDialogue(true)
  }

  const takeOrderDialogueClose = () => {
    setTakeOrderDialogue(false)
  }

  const doTakeOrder = () => {
    setTakeOrderDialogue(false)
    props.takeOrder(take)
  }

  let rowCounter = 0

  return (

    <>

      <Grid container alignItems="flex-start">

        <Grid item container justify="flex-end" xs={3}>
          <Typography variant="h3">
            &nbsp;
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
          props.balanceData.data.map( ( balance: Balance, index: number ) => {

            if ( balance.token == props.token.tokenName ) {

              //console.log(balance)
              const amount = +balance.confirmed
              const unconfirmed = +balance.unconfirmed
              const mempool = +balance.mempool
              const thisAmount = amount.toFixed(2)
              const thisUnconfirmed = unconfirmed.toFixed(2)
              const thisMempool = mempool.toFixed(2)

              const rowclass = index % 2 ? classes.evenRow : classes.oddRow

              return (
                <React.Fragment key={index}>

                  <Grid className={rowclass} item container xs={12}>

                    <Grid item container justify="flex-start" xs={3}>
                     <Typography variant="body1">
                       {balance.token}
                     </Typography>
                    </Grid>
                    <Grid item container justify="flex-end" xs={3}>
                     <Typography variant="body2">
                       {thisAmount}
                     </Typography>
                    </Grid>
                    <Grid item container justify="flex-end" xs={3}>
                      <Typography variant="body2">
                        {thisUnconfirmed}
                      </Typography>
                    </Grid>
                    <Grid item container justify="flex-end" xs={3}>
                      <Typography variant="body2">
                        {thisMempool}
                      </Typography>
                    </Grid>

                  </Grid>

                </React.Fragment>
              )
            }
          })
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

                  const rowColour = rowCounter % 2 ? '#FAFAFF' : '#F5F3F2'
                  rowCounter += 1

                  return (
                    <React.Fragment key={index}>

                      <Grid item container xs={12}>

                        <Button
                          onClick={() => processTakeOrder(order)}
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
            <Grid item container justify="space-evenly" xs={6}>

              {props.orderData.data.map( ( order: Order, index: number ) => {

                if ( !index ) {
                  rowCounter = 0
                }

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

                  const rowColour = rowCounter % 2 ? '#FAFAFF' : '#F5F3F2'
                  rowCounter += 1

                  return (

                    <React.Fragment key={index}>

                      <Grid item container xs={12}>
                        <Button
                          onClick={() => processTakeOrder(order)}
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

      <Modal
        aria-labelledby={Help.takeOrderSure}
        aria-describedby={Help.takeOrderSure}
        className={classes.orderModal}
        open={takeOrderDialogue}
        onClose={takeOrderDialogueClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={takeOrderDialogue}>
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
  return {
    orderData: orders,
    balanceData: balances
  }
}

const mapDispatchToProps = (dispatch: AppDispatch): OrdersDispatchProps => {
 return {
   takeOrder: (order: Order) => dispatch(takeOrder(order))
 }
}

export const TokenOrders = connect<OrdersStateProps, OrdersDispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(display)