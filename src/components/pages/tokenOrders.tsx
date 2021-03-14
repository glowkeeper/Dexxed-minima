import React, { useEffect, useState } from 'react'
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

import * as Yup from 'yup'
import { useFormik, useField } from 'formik'

import { Local, GeneralError, Help } from '../../config'

import {
  OrderBook
} from '../../config/strings'

import { themeStyles } from '../../styles'

import {
  ApplicationState,
  AppDispatch,
  OrderBookProps,
  Order,
  NewOrder,
  Token
} from '../../store'

interface TokenOrderProps {
  token: Token
}

interface OrdersStateProps {
  orderData: OrderBookProps
}

interface OrdersDispatchProps {
  takeOrder: (order: Order) => void
}

type Props = TokenOrderProps & OrdersStateProps & OrdersDispatchProps

const display = (props: Props) => {

  const minimaTokenId = "0x00"

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

  useEffect(() => {

    // count orders

  }, [props.orderData])

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

  return (

    <>

      <Grid container alignItems="flex-start">

        <Grid item container justify="flex-start" xs={12}>
          <Typography variant="h3">
            {props.token.tokenName}
          </Typography>
        </Grid>

        <Grid item container justify="flex-start" xs={3}>
          <Typography style={{color: OrderBook.buyColour}} variant="h3">
            {OrderBook.total}
          </Typography>
        </Grid>
        <Grid item container justify="flex-start" xs={3}>
          <Typography style={{color: OrderBook.buyColour}} variant="h3">
            {OrderBook.price}
          </Typography>
        </Grid>
        <Grid item container justify="flex-end" xs={3}>
          <Typography style={{color: OrderBook.sellColour}} variant="h3">
            {OrderBook.price}
          </Typography>
        </Grid>
        <Grid item container justify="flex-end" xs={3}>
          <Typography style={{color: OrderBook.sellColour}} variant="h3">
            {OrderBook.total}
          </Typography>
        </Grid>

        {
          <>
            <Grid item container justify="flex-start" xs={6}>
              {props.orderData.data.map( ( order: Order, index: number ) => {

                if ( ( order.swapTokenId == props.token.tokenId ) &&
                     ( order.isBuy ) ) {

                  //console.log(order)
                  const type = OrderBook.buy
                  const colour = OrderBook.buyColour

                  const price = +order.price
                  const thisPrice = price.toFixed(2)

                  const total = +order.total
                  const thisTotal = total.toFixed(2)

                  return (

                    <React.Fragment key={index}>
                      <Grid item container xs={12}>
                        <Button
                          onClick={() => processTakeOrder(order)}
                          style={{
                            width: "100%",
                            textTransform: 'none',
                            fontSize: "1em",
                            lineHeight: "1",
                            borderRadius: 0,
                            padding: 0
                          }}
                        >
                          <Grid item container xs={6}>
                           <Typography style={{color: `${colour}`}} variant="body2">
                             {thisTotal}
                           </Typography>
                          </Grid>
                          <Grid item container xs={6}>
                            <Typography style={{color: `${colour}`}} variant="body2">
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
            <Grid item container justify="flex-end" xs={6}>
              {props.orderData.data.map( ( order: Order, index: number ) => {

                if ( ( order.tokenId == props.token.tokenId ) &&
                     ( !order.isBuy ) ) {

                  //console.log(order)
                  const type = OrderBook.sell
                  const colour = OrderBook.sellColour

                  const price = +order.price
                  const thisPrice = price.toFixed(2)

                  const total = +order.total
                  const thisTotal = total.toFixed(2)

                  return (

                    <React.Fragment key={index}>

                      <Grid item container xs={12}>
                        <Button
                          onClick={() => processTakeOrder(order)}
                          style={{
                            width: "100%",
                            textTransform: 'none',
                            fontSize: "1em",
                            lineHeight: "1",
                            borderRadius: 0,
                            padding: 0
                          }}
                        >
                          <Grid item container justify="flex-end" xs={6}>
                            <Typography style={{color: `${colour}`}} variant="body2">
                               {thisPrice}
                             </Typography>
                          </Grid>
                          <Grid item container justify="flex-end" xs={6}>
                           <Typography style={{color: `${colour}`}} variant="body2">
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
  return {
    orderData: orders
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
