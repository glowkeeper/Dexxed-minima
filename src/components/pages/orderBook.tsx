import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { submitOrder } from '../../store/app/blockchain/tx/actions'
import { setActivePage } from '../../store/app/appData/actions'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import * as Yup from 'yup'
import { useFormik } from 'formik'
import Button from '@material-ui/core/Button'
import ReactTooltip from 'react-tooltip'
import TextField from '@material-ui/core/TextField'

import { Local, GeneralError, Help } from '../../config'

import { OrderBook as OrderBookConfig } from '../../config/strings'

import { themeStyles } from '../../styles'

import {
  ApplicationState,
  AppDispatch,
  OrderBookProps,
  Order,
  NewOrder
} from '../../store'

interface OrdersStateProps {
  orderData: OrderBookProps
}

interface OrdersDispatchProps {
  setActivePage: () => void
  submitOrder: (order: NewOrder) => void
}

type Props = OrdersStateProps & OrdersDispatchProps

const tradeSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError(`${GeneralError.number}`)
    .positive(`${OrderBookConfig.validAmount}`),
  price: Yup.number()
    .typeError(`${GeneralError.number}`)
    .positive(`${OrderBookConfig.validPrice}`)
})

const display = (props: Props) => {

  const [isBuy, setIsBuy] = useState(true)
  const [tradeColours, setTradeColours] = useState([`${OrderBookConfig.buyColour}`,`${OrderBookConfig.disabledColour}`])

  const [isBook, setIsBook] = useState(true)
  const [bookColours, setBookColours] = useState([`${OrderBookConfig.liveColour}`,`${OrderBookConfig.disabledColour}`])

  const classes = themeStyles()
  props.setActivePage()

  const minimaTokenId = "0x00"

  //console.log("ORDERS!: ", props.orderData)
  const formik = useFormik({
    initialValues: {
      amount: null,
      price: null
    },
    enableReinitialize: true,
    validationSchema: tradeSchema,
    onSubmit: (values: any) => {

      const orderInfo: NewOrder = {
          amount: values.amount,
          price: values.price,
          hasTokenId: minimaTokenId,
          wantsTokenId: minimaTokenId
      }
      props.submitOrder(orderInfo)
    },
  })

  const buy = (isBuy: boolean) => {

    setIsBuy(isBuy)
    if ( isBuy ) {
      setTradeColours([`${OrderBookConfig.buyColour}`,`${OrderBookConfig.disabledColour}`])
    } else {
      setTradeColours([`${OrderBookConfig.disabledColour}`,`${OrderBookConfig.sellColour}`])
    }
  }

  const book = (book: boolean) => {

    setIsBook(book)
    if ( book ) {
      setBookColours([`${OrderBookConfig.liveColour}`,`${OrderBookConfig.disabledColour}`])
    } else {
      setBookColours([`${OrderBookConfig.disabledColour}`,`${OrderBookConfig.liveColour}`])
    }
  }

  return (
    <Grid container alignItems="flex-start">

      <Grid item container className={classes.formLabel} xs={6}>
        <Button
          onClick={() => book(true)}
          color="primary"
          size='medium'
          variant="contained"
          disableElevation={true}
          data-for='orderBookButton'
          data-tip
          style={{
            textTransform: 'none',
            fontSize: "1em",
            backgroundColor: `${bookColours[0]}`,
            width: "100%",
            borderRadius: 0,
            justifyContent: "flex-start"
          }}
        >
          {OrderBookConfig.orderBookButton}
        </Button>
        <ReactTooltip
          id='orderBookButton'
          place="bottom"
          effect="solid"
        >
          {Help.orderBookTip}
        </ReactTooltip>
      </Grid>

      <Grid item container className={classes.formLabel} xs={6}>
        <Button
          onClick={() => book(false)}
          color="primary"
          size='medium'
          variant="contained"
          disableElevation={true}
          data-for='recentTradesButton'
          data-tip
          style={{
            textTransform: 'none',
            fontSize: "1em",
            backgroundColor: `${bookColours[1]}`,
            width: "100%",
            borderRadius: 0,
            justifyContent: "flex-end"
          }}
        >
          {OrderBookConfig.recentTradesButton}
        </Button>
        <ReactTooltip
          id='recentTradesButton'
          place="bottom"
          effect="solid"
        >
          {Help.recentTradesTip}
        </ReactTooltip>
      </Grid>

      <Grid item container className={classes.formLabel} xs={6}>
        <Button
          onClick={() => buy(true)}
          color="primary"
          size='medium'
          variant="contained"
          disableElevation={true}
          data-for='buyButton'
          data-tip
          style={{
            textTransform: 'none',
            fontSize: "1em",
            backgroundColor: `${tradeColours[0]}`,
            width: "100%",
            borderRadius: 0,
            justifyContent: "flex-start"
          }}
        >
          {OrderBookConfig.buyButton}
        </Button>
        <ReactTooltip
          id='buyButton'
          place="bottom"
          effect="solid"
        >
          {Help.buyTip}
        </ReactTooltip>
      </Grid>

      <Grid item container className={classes.formLabel} xs={6}>
        <Button
          onClick={() => buy(false)}
          color="primary"
          size='medium'
          variant="contained"
          disableElevation={true}
          data-for='sellButton'
          data-tip
          style={{
            textTransform: 'none',
            fontSize: "1em",
            backgroundColor: `${tradeColours[1]}`,
            width: "100%",
            borderRadius: 0,
            justifyContent: "flex-end"
          }}
        >
          {OrderBookConfig.sellButton}
        </Button>
        <ReactTooltip
          id='sellButton'
          place="bottom"
          effect="solid"
        >
          {Help.orderTip}
        </ReactTooltip>
      </Grid>

      <Grid item container className={classes.form} xs={12}>

        <form onSubmit={formik.handleSubmit} className={classes.formSubmit}>
          <Grid item container xs={12}>
            <Grid item container className={classes.formLabel} justify="flex-start" alignItems="center" xs={1}>
              <label htmlFor="amount">{OrderBookConfig.amount}</label>
            </Grid>
            <Grid item container className={classes.formInput} xs={11}>
              <TextField
                fullWidth
                variant="outlined"
                id="outlined-basic"
                name="amount"
                type="text"
                value={formik.values.amount}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item container className={classes.formError} xs={12}>
              {formik.errors.amount && formik.touched.amount ? (
                <div>{formik.errors.amount}</div>
              ) : null}
            </Grid>
          </Grid>
          <Grid item container xs={12}>
            <Grid item container className={classes.formLabel} justify="flex-start" alignItems="center" xs={1}>
              <label htmlFor="price">{OrderBookConfig.price}</label>
            </Grid>
            <Grid item container className={classes.formInput} xs={11}>
              <TextField
                fullWidth
                variant="outlined"
                id="outlined-basic"
                name="price"
                type="text"
                value={formik.values.price}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item container className={classes.formError} xs={12}>
              {formik.errors.price && formik.touched.price ? (
                <div>{formik.errors.price}</div>
              ) : null}
            </Grid>
          </Grid>
          <Grid item container className={classes.formButton} xs={12}>
            <Button
              type='submit'
              color="primary"
              size='medium'
              variant="contained"
              data-for='orderButton'
              data-tip
              style={{
                textTransform: 'none',
                fontSize: "1em",
                backgroundColor: isBuy ? `${OrderBookConfig.buyColour}` : `${OrderBookConfig.sellColour}`,
                width: "100%",
                borderRadius: 0,
                justifyContent: "center"
              }}
            >
              {OrderBookConfig.orderButton}
            </Button>
            <ReactTooltip
              id='orderButton'
              place="bottom"
              effect="solid"
            >
              { isBuy ? `${Help.placeBuyTip}` : `${Help.placeSellTip}` }
            </ReactTooltip>
          </Grid>
        </form>
      </Grid>

    </Grid>
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
   setActivePage: () => dispatch(setActivePage(Local.orderBook)),
   submitOrder: (order: NewOrder) => dispatch(submitOrder(order))
 }
}

export const OrderBook = connect<OrdersStateProps, OrdersDispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(display)
