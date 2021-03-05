import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { submitOrder } from '../../store/app/blockchain/tx/actions'
import { setActivePage } from '../../store/app/appData/actions'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import * as Yup from 'yup'
import { useFormik, useField } from 'formik'
import Button from '@material-ui/core/Button'
import ReactTooltip from 'react-tooltip'
import TextField from '@material-ui/core/TextField'
import Select from 'react-select'

import { Local, GeneralError, Help } from '../../config'

import {
  OrderBook as OrderBookConfig,
  Trades as TradesConfig
} from '../../config/strings'

import { themeStyles } from '../../styles'

import {
  ApplicationState,
  AppDispatch,
  OrderBookProps,
  Order,
  NewOrder,
  TokenProps,
  Token,
  AllTradesProps,
  Trade
} from '../../store'

interface OrdersStateProps {
  orderData: OrderBookProps
  tradeData: AllTradesProps
  tokenData: TokenProps
}

interface OrdersDispatchProps {
  setActivePage: () => void
  submitOrder: (order: NewOrder) => void
}

type Props = OrdersStateProps & OrdersDispatchProps

const tradeSchema = Yup.object().shape({
  token: Yup.string()
    .typeError(`${OrderBookConfig.validToken}`)
    .required(`${GeneralError.required}`),
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

  const [tokens, setTokens] = useState([] as any[])
  const [token, setToken] = useState({} as any)

  const classes = themeStyles()
  props.setActivePage()

  useEffect(() => {

    if ( props.tokenData ) {

      let options = [] as any
      props.tokenData.data.forEach(element => {

        const thisOption = { value: element.tokenId, label: element.tokenName }
        options.push(thisOption)
      })
      setTokens(options)
    }

  }, [props.tokenData])

  //console.log("ORDERS!: ", props.orderData)
  const formik = useFormik({
    initialValues: {
      token: null,
      amount: null,
      price: null
    },
    enableReinitialize: true,
    validationSchema: tradeSchema,
    onSubmit: (values: any) => {

      //console.log("values: ", values)
      const orderInfo: NewOrder = {
          isBuy: isBuy,
          amount: values.amount,
          price: values.price,
          tokenId: values.token
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

      <Grid item container justify="flex-start" xs={12}>
        <Typography variant="h2">
          {OrderBookConfig.heading}
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
              <label htmlFor="token">{OrderBookConfig.token}</label>
            </Grid>
            <Grid item container xs={11}>
              <div style={{width: '100%'}}>
                <Select
                  defaultValue={token}
                  onChange={selectedOption => {
                    setToken(selectedOption)
                    formik.setFieldValue("token", selectedOption.value)
                  }}
                  options={tokens}
                  name="token"
                />
              </div>
            </Grid>
            <Grid item container className={classes.formError} xs={12}>
              {formik.errors.token && formik.touched.token ? (
                <div>{formik.errors.token}</div>
              ) : null}
            </Grid>
          </Grid>

          <Grid item container xs={12}>
            <Grid item container className={classes.formLabel} justify="flex-start" alignItems="center" xs={1}>
              <label htmlFor="amount">{OrderBookConfig.amount}</label>
            </Grid>
            <Grid item container className={classes.formInput} xs={11}>
              <TextField
                fullWidth
                variant="outlined"
                id="amount"
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
                id="price"
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

      { isBook?

        <Grid container alignItems="flex-start">

          <Grid item container justify="flex-start" xs={12}>
            <Typography style={{color: 'blue'}} variant="h3">
              {token.hasOwnProperty("label") ? token.label : ""}
            </Typography>
          </Grid>

          <Grid item container justify="flex-end" xs={4}>
            <Typography variant="h3">
              {TradesConfig.price}
            </Typography>
          </Grid>
          <Grid item container justify="flex-end" xs={4}>
            <Typography variant="h3">
              {TradesConfig.amount}
            </Typography>
          </Grid>
          <Grid item container justify="flex-end" xs={4}>
            <Typography variant="h3">
              {TradesConfig.total}
            </Typography>
          </Grid>

          {
            props.orderData.data.map( ( order: Order, index: number ) => {

              //console.log("Order! ", order)
              let selectedToken = ""
              if ( token.hasOwnProperty("value") ) {
                selectedToken = token.value
              }

              //console.log("TokenId: ", thisToken, order.tokenId )

              const orderToken = order.isBuy ? order.swapTokenId :  order.tokenId

              if ( orderToken == selectedToken ) {

                //console.log(order)

                const tokenName = order.isBuy ? order.swapTokenName : order.tokenName
                const type = order.isBuy ? `${OrderBookConfig.buy}` : `${OrderBookConfig.sell}`
                const colour = order.isBuy ? `${OrderBookConfig.buyColour}` : `${OrderBookConfig.sellColour}`

                const amount = +order.amount
                const thisAmount = amount.toFixed(2)

                const price = +order.price
                const thisPrice = price.toFixed(2)

                const total = +order.total
                const thisTotal = total.toFixed(2)

                return (

                  <React.Fragment key={index}>

                    <Grid className={classes.details} item container justify="flex-end" xs={4}>
                     <Typography style={{color: `${colour}`}} variant="body2">
                       {thisPrice}
                     </Typography>
                    </Grid>
                    <Grid className={classes.details} item container justify="flex-end" xs={4}>
                     <Typography style={{color: `${colour}`}} variant="body2">
                       {thisAmount}
                     </Typography>
                    </Grid>
                    <Grid className={classes.details} item container justify="flex-end" xs={4}>
                     <Typography style={{color: `${colour}`}} variant="body2">
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

              }
            })
          }

        </Grid>

        : (

          <Grid container alignItems="flex-start">

            <Grid item container justify="flex-start" xs={12}>
              <Typography style={{color: 'blue'}} variant="h3">
                {token.hasOwnProperty("label") ? token.label : ""}
              </Typography>
            </Grid>

            <Grid item container justify="flex-end" xs={3}>
              <Typography variant="h3">
                {TradesConfig.price}
              </Typography>
            </Grid>
            <Grid item container justify="flex-end" xs={3}>
              <Typography variant="h3">
                {TradesConfig.amount}
              </Typography>
            </Grid>
            <Grid item container justify="flex-end" xs={3}>
              <Typography variant="h3">
                {TradesConfig.total}
              </Typography>
            </Grid>
            <Grid item container justify="flex-end" xs={3}>
              <Typography variant="h3">
                {TradesConfig.block}
              </Typography>
            </Grid>

            {
              props.tradeData.data.map( ( trade: Trade, index: number ) => {

                //console.log(trade)

                let selectedToken = ""
                if ( token.hasOwnProperty("value") ) {
                  selectedToken = token.value
                }

                if ( trade.tokenId == selectedToken ) {

                  const colour = trade.isBuy ? `${TradesConfig.buyColour}` : `${TradesConfig.sellColour}`

                  const amount = +trade.amount
                  const thisAmount = amount.toFixed(2)

                  const price = +trade.price
                  const thisPrice = price.toFixed(2)

                  const total = +trade.total
                  const thisTotal = total.toFixed(2)

                  return (
                    <React.Fragment key={index}>

                      <Grid className={classes.details} item container justify="flex-end" xs={3}>
                       <Typography style={{color: `${colour}`}} variant="body2">
                         {thisPrice}
                       </Typography>
                      </Grid>
                      <Grid className={classes.details} item container justify="flex-end" xs={3}>
                       <Typography style={{color: `${colour}`}} variant="body2">
                         {thisAmount}
                       </Typography>
                      </Grid>
                      <Grid className={classes.details} item container justify="flex-end" xs={3}>
                       <Typography style={{color: `${colour}`}} variant="body2">
                         {thisTotal}
                       </Typography>
                      </Grid>
                      <Grid className={classes.details} item container justify="flex-end" xs={3}>
                       <Typography  style={{color: `${colour}`}} variant="body2">
                         {trade.block}
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
                }
              })
            }
          </Grid>
         )
      }

    </Grid>
  )
}

const mapStateToProps = (state: ApplicationState): OrdersStateProps => {

  const orders = state.orderBook as OrderBookProps
  const trades = state.allTrades as AllTradesProps
  const tokens = state.tokens as TokenProps
  return {
    orderData: orders,
    tradeData: trades,
    tokenData: tokens
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
