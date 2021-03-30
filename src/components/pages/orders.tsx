import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'

import { setActivePage, setOrdersDisabled } from '../../store/app/appData/actions'
import { cancelOrder } from '../../store/app/blockchain/tx/actions'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Spinner from 'react-spinner-material'

import { Local, Misc, Orders as OrdersConfig, Help } from '../../config'

import { themeStyles } from '../../styles'

import {
  ApplicationState,
  AppDispatch,
  AppData,
  MyOrdersProps,
  Order,
  CancelOrder
} from '../../store'

interface StateProps {
  initialised: boolean,
  ordersDisabled: boolean[],
  orderData: MyOrdersProps
}

interface DispatchProps {
  setActivePage: () => void
  setOrdersDisabled: (orders: boolean[]) => void
  cancelOrder: (order: CancelOrder) => void
}

type Props = StateProps & DispatchProps

const display = (props: Props) => {

  const [isLoading, setIsLoading] = useState(true)
  let [isDisabled, setIsDisabled] = useState([] as boolean[])
  let isFirstRun = useRef(true)

  const classes = themeStyles()

  useEffect(() => {

    if ( ( props.initialised ) &&
         ( isLoading ) ) {

      setIsLoading(false)
    }

    if ( isFirstRun.current ) {

      props.setActivePage()
      isFirstRun.current = false

    }

    //console.log("disabled: ", props.ordersDisabled.length, isDisabled.length)

    if ( ( props.orderData.data ) &&
         ( props.orderData.data.length ) &&
         ( props.orderData.data.length == props.ordersDisabled.length ) ) {

       for (let i = 0; i < props.orderData.data.length; i++ ) {
         isDisabled[i] = props.ordersDisabled[i]
       }

    } else if ( props.orderData.data.length != isDisabled.length ) {

      for (let i = 0; i < props.orderData.data.length; i++ ) {
        isDisabled[i] = false
      }
      props.setOrdersDisabled(isDisabled)
    }

  }, [props.orderData, props.initialised, props.ordersDisabled])

  const cancel = (order: Order, index: number) => {

    isDisabled[index] = true;
    const cancelOrder: CancelOrder = {
      coinId: order.coinId,
      owner: order.owner,
      address: order.address,
      coinAmount: order.coinAmount,
      tokenId: order.tokenId
    }
    props.setOrdersDisabled(isDisabled)
    props.cancelOrder(cancelOrder)
  }

  return (
    <Grid container alignItems="flex-start">

      <Grid item container justify="flex-start" xs={12}>
        <Typography variant="h2">
          {OrdersConfig.heading}
        </Typography>
      </Grid>

      <Grid item container justify="flex-start" xs={2}>
        <Typography variant="h3">
          {OrdersConfig.type}
        </Typography>
      </Grid>
      <Grid item container justify="flex-start" xs={2}>
        <Typography variant="h3">
          {OrdersConfig.tokenName}
        </Typography>
      </Grid>
      <Grid item container justify="flex-end" xs={2}>
        <Typography variant="h3">
          {OrdersConfig.price}
        </Typography>
      </Grid>
      <Grid item container justify="flex-end" xs={2}>
        <Typography variant="h3">
          {OrdersConfig.amount}
        </Typography>
      </Grid>
      <Grid item container justify="flex-end" xs={2}>
        <Typography variant="h3">
          {OrdersConfig.total}
        </Typography>
      </Grid><Grid item container justify="flex-end" xs={2}>
        <Typography variant="h3">
          &nbsp;
        </Typography>
      </Grid>

      <Grid item container justify="center" xs={12}>
        <svg
           xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 2000 4"
        >
          <line x2="2000" stroke="#001c32" strokeWidth={4} />
        </svg>
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
          props.orderData.data.map( ( order: Order, index: number ) => {

            //console.log("Order!", order)

            const orderToken = order.isBuy ? order.swapTokenName : order.tokenName
            const type = order.isBuy ? OrdersConfig.buy : OrdersConfig.sell
            let colour = order.isBuy ? OrdersConfig.buyColour : OrdersConfig.sellColour

            const amount = +order.amount
            const thisAmount = amount.toFixed(Misc.amountDecimals)

            const price = +order.price
            const thisPrice = price.toFixed(Misc.priceDecimals)

            const total =  +order.total
            const thisTotal = total.toFixed(Misc.totalDecimals)

            let rowclass = index % 2 ? classes.evenRow : classes.oddRow
            if ( isDisabled[index] ) {
              rowclass = classes.disabledRow
            }

            return (
              <React.Fragment key={index}>

                <Grid className={rowclass} item container xs={12}>

                  <Grid item container alignItems="center" justify="flex-start" xs={2}>
                   <Typography style={{color: colour}} variant="body1">
                     {type}
                   </Typography>
                  </Grid>
                  <Grid item container alignItems="center" justify="flex-start" xs={2}>
                   <Typography style={{ wordWrap: 'break-word' }} variant="body1">
                     {orderToken}
                   </Typography>
                  </Grid>
                  <Grid item container alignItems="center" justify="flex-end" xs={2}>
                   <Typography variant="body2">
                     {thisPrice}
                   </Typography>
                  </Grid>
                  <Grid item container alignItems="center" justify="flex-end" xs={2}>
                   <Typography variant="body2">
                     {thisAmount}
                   </Typography>
                  </Grid>
                  <Grid item container alignItems="center" justify="flex-end" xs={2}>
                   <Typography variant="body2">
                     {thisTotal}
                   </Typography>
                  </Grid>
                  <Grid item container alignItems="center" justify="center" xs={2}>
                    <Button
                      onClick={() => cancel(order, index)}
                      disabled={isDisabled[index]}
                      style={{
                        textTransform: 'none',
                        fontSize: "1em",
                        lineHeight: "1",
                        color: colour
                      }}
                    >
                      {OrdersConfig.cancelButton}
                    </Button>
                  </Grid>

                </Grid>

              </React.Fragment>
            )
          })
        )
      }
    </Grid>
  )
}

const mapStateToProps = (state: ApplicationState): StateProps => {

  const orders = state.myOrders as MyOrdersProps
  const initialised = state.appData.data.hasInitialised
  const ordersDisabled = state.appData.data.orderDisabled
  return {
    initialised: initialised,
    ordersDisabled: ordersDisabled,
    orderData: orders
  }
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
 return {
   setActivePage: () => dispatch(setActivePage(Local.orders)),
   setOrdersDisabled: (orders: boolean[]) => dispatch(setOrdersDisabled(orders)),
   cancelOrder: (order: CancelOrder) => dispatch(cancelOrder(order))
 }
}

export const Orders = connect<StateProps, DispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(display)
