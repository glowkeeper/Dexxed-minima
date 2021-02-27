import React from 'react'
import { connect } from 'react-redux'

import { setActivePage } from '../../store/app/appData/actions'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { Local } from '../../config'
import { Orders as OrdersConfig } from '../../config/strings'

import { themeStyles } from '../../styles'

import {
  ApplicationState,
  AppDispatch,
  MyOrdersProps,
  Order
} from '../../store'

interface OrdersStateProps {
  orderData: MyOrdersProps
}

interface OrdersDispatchProps {
  setActivePage: () => void
}

type Props = OrdersStateProps & OrdersDispatchProps

const display = (props: Props) => {

  const classes = themeStyles()
  props.setActivePage()

  //console.log("ORDERS!: ", props.orderData)

  return (
    <Grid container alignItems="flex-start">

      <Grid item container justify="flex-start" xs={12}>
        <Typography variant="h2">
          {OrdersConfig.heading}
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
      <Grid item container justify="flex-end" xs={3}>
        <Typography variant="h3">
          {OrdersConfig.amount}
        </Typography>
      </Grid>
      <Grid item container justify="flex-end" xs={3}>
        <Typography variant="h3">
          {OrdersConfig.total}
        </Typography>
      </Grid>

      <Grid item container justify="flex-start" xs={12}>
        <svg
           xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 2000 4"
        >
          <line x2="2000" stroke="#00cccc" strokeWidth={4} />
        </svg>
      </Grid>

      {
        props.orderData.data.map( ( order: Order, index: number ) => {

          console.log(order)

          const type = order.isBuy ? `${OrdersConfig.buy}` : `${OrdersConfig.sell}`
          const color = order.isBuy ? `${OrdersConfig.buyColor}` : `${OrdersConfig.sellColor}`

          const amount = +order.amount
          const thisAmount = amount.toFixed(2)

          const price = +order.price
          const thisPrice = price.toFixed(2)

          const total = +order.total
          const thisTotal = total.toFixed(2)

          return (
            <React.Fragment key={index}>

              <Grid className={classes.details} item container justify="flex-start" xs={2}>
               <Typography style={{color: `${color}`}} variant="body1">
                 {type}
               </Typography>
              </Grid>
              <Grid className={classes.details} item container justify="flex-start" xs={2}>
               <Typography style={{ wordWrap: 'break-word' }} variant="body1">
                 {order.tokenName}
               </Typography>
              </Grid>
              <Grid className={classes.details} item container justify="flex-end" xs={2}>
               <Typography variant="body2">
                 {thisPrice}
               </Typography>
              </Grid>
              <Grid className={classes.details} item container justify="flex-end" xs={3}>
               <Typography variant="body2">
                 {thisAmount}
               </Typography>
              </Grid>
              <Grid className={classes.details} item container justify="flex-end" xs={3}>
               <Typography variant="body2">
                 {thisTotal}
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

            </React.Fragment>
          )
        })
      }

    </Grid>
  )
}

const mapStateToProps = (state: ApplicationState): OrdersStateProps => {

  const orders = state.myOrders as MyOrdersProps
  return {
    orderData: orders
  }
}

const mapDispatchToProps = (dispatch: AppDispatch): OrdersDispatchProps => {
 return {
   setActivePage: () => dispatch(setActivePage(Local.orders))
 }
}

export const Orders = connect<OrdersStateProps, OrdersDispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(display)
