import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { Decimal } from 'decimal.js'

import { submitOrder, takeOrder } from '../../store/app/blockchain/tx/actions'
import { setActivePage } from '../../store/app/appData/actions'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Select from 'react-select'

import confirmIcon from '../../images/tickIcon.svg'
import cancelIcon from '../../images/crossIcon.svg'

import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'

import * as Yup from 'yup'
import { useFormik, useField } from 'formik'

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
  takeOrder: (order: Order) => void
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

  const minimaTokenId = "0x00"

  const [order, setOrder] = useState({
    isBuy: true,
    amount: new Decimal(0),
    price: new Decimal(0),
    total: new Decimal(0),
    hasTokenId: minimaTokenId,
    wantsTokenId: minimaTokenId
  } as NewOrder)
  const [orderDialogue, setOrderDialogue] = useState(false)

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

  const [isBuy, setIsBuy] = useState(true)
  const [tradeColours, setTradeColours] = useState([`${OrderBookConfig.buyColour}`,`${OrderBookConfig.disabledColour}`])

  const [isOrder, setIsOrder] = useState(true)
  const [bookColours, setBookColours] = useState([`${OrderBookConfig.liveColour}`,`${OrderBookConfig.disabledColour}`])

  const [tokens, setTokens] = useState([] as any[])
  const [token, setToken] = useState({} as any)

  const classes = themeStyles()
  props.setActivePage()

  useEffect(() => {

    if ( props.tokenData ) {

      let options = [] as any
      props.tokenData.data.forEach(element => {

        const thisOption = {
          value: element.tokenId,
          name: element.tokenName,
          label: `${element.tokenName} (${element.tokenId})` }
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

      //console.log("Values: ", values)
      const decPrice = new Decimal(values.price)
      let decAmount = new Decimal(values.amount)
      let decTotal = decAmount.mul(decPrice)
      let hasTokenId = minimaTokenId
      let wantsTokenId = values.token
      if ( !isBuy ) {
        // swap everything :)
        hasTokenId = values.token
        wantsTokenId = minimaTokenId
        /*const swap  = decTotal
        decTotal  = decAmount
        decAmount = swap*/
      }

      const orderInfo: NewOrder = {
          isBuy: isBuy,
          amount: decAmount,
          price: decPrice,
          total: decTotal,
          hasTokenId: hasTokenId,
          wantsTokenId: wantsTokenId
      }

      //console.log("new values: ", orderInfo.amount.toString(), orderInfo.price.toString(), orderInfo.total.toString(), hasTokenId, wantsTokenId)

      setOrder(orderInfo)
      setOrderDialogue(true)
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

    setIsOrder(book)
    if ( book ) {
      setBookColours([`${OrderBookConfig.liveColour}`,`${OrderBookConfig.disabledColour}`])
    } else {
      setBookColours([`${OrderBookConfig.disabledColour}`,`${OrderBookConfig.liveColour}`])
    }
  }

  const orderDialogueClose = () => {
    setOrderDialogue(false)
  }

  const doOrder = () => {
    setOrderDialogue(false)
    props.submitOrder(order)
  }

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
          style={{
            textTransform: 'none',
            fontSize: "1em",
            lineHeight: "1",
            backgroundColor: `${tradeColours[0]}`,
            width: "100%",
            borderRadius: 0,
            justifyContent: "flex-start"
          }}
        >
          {OrderBookConfig.buyButton}
        </Button>
      </Grid>

      <Grid item container className={classes.formLabel} xs={6}>
        <Button
          onClick={() => buy(false)}
          color="primary"
          size='medium'
          variant="contained"
          disableElevation={true}
          style={{
            textTransform: 'none',
            fontSize: "1em",
            lineHeight: "1",
            backgroundColor: `${tradeColours[1]}`,
            width: "100%",
            borderRadius: 0,
            justifyContent: "flex-end"
          }}
        >
          {OrderBookConfig.sellButton}
        </Button>
      </Grid>

      <Grid item container xs={12}>

        <form onSubmit={formik.handleSubmit} className={classes.formSubmit}>

          <Grid item container xs={12}>
            <Grid item container className={classes.formLabel} justify="flex-start" alignItems="center" xs={1}>
              <label htmlFor="token">{OrderBookConfig.token}</label>
            </Grid>
            <Grid item container xs={11}>
              <div style={{width: '100%'}}>
                <Select
                  size="small"
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
            <Grid item container xs={11}>
              <TextField
                fullWidth
                size="small"
                name="amount"
                type="text"
                value={formik.values.amount}
                onChange={formik.handleChange}
                InputProps={{ disableUnderline: true }}
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
            <Grid item container xs={11}>
              <TextField
                fullWidth
                size="small"
                name="price"
                type="text"
                value={formik.values.price}
                onChange={formik.handleChange}
                InputProps={{ disableUnderline: true }}
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
              style={{
                textTransform: 'none',
                fontSize: "1em",
                lineHeight: "1",
                backgroundColor: isBuy ? `${OrderBookConfig.buyColour}` : `${OrderBookConfig.sellColour}`,
                width: "100%",
                borderRadius: 0,
                justifyContent: "center"
              }}
            >
              {OrderBookConfig.orderButton}
            </Button>
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
          style={{
            textTransform: 'none',
            fontSize: "1em",
            lineHeight: "1",
            backgroundColor: `${bookColours[0]}`,
            width: "100%",
            borderRadius: 0,
            justifyContent: "flex-start"
          }}
        >
          {OrderBookConfig.orderBookButton}
        </Button>
      </Grid>

      <Grid item container className={classes.formLabel} xs={6}>
        <Button
          onClick={() => book(false)}
          color="primary"
          size='medium'
          variant="contained"
          disableElevation={true}
          style={{
            textTransform: 'none',
            fontSize: "1em",
            lineHeight: "1",
            backgroundColor: `${bookColours[1]}`,
            width: "100%",
            borderRadius: 0,
            justifyContent: "flex-end"
          }}
        >
          {OrderBookConfig.recentTradesButton}
        </Button>
      </Grid>

      { isOrder?

        <Grid container alignItems="flex-start">

          <Grid item container justify="flex-start" xs={12}>
            <Typography variant="h3">
              {token.hasOwnProperty("label") ? token.name : ""}
            </Typography>
          </Grid>

          <Grid item container justify="flex-start" xs={3}>
            <Typography style={{color: TradesConfig.buyColour}} variant="h3">
              {TradesConfig.total}
            </Typography>
          </Grid>
          <Grid item container justify="flex-start" xs={3}>
            <Typography style={{color: TradesConfig.buyColour}} variant="h3">
              {TradesConfig.price}
            </Typography>
          </Grid>
          <Grid item container justify="flex-end" xs={3}>
            <Typography style={{color: TradesConfig.sellColour}} variant="h3">
              {TradesConfig.price}
            </Typography>
          </Grid>
          <Grid item container justify="flex-end" xs={3}>
            <Typography style={{color: TradesConfig.sellColour}} variant="h3">
              {TradesConfig.total}
            </Typography>
          </Grid>

          {
            <>
              <Grid item container justify="flex-start" xs={6}>
                {props.orderData.data.map( ( order: Order, index: number ) => {

                  //console.log("Order! ", order)
                  let selectedToken = ""
                  if ( token.hasOwnProperty("value") ) {
                    selectedToken = token.value
                  }

                  //console.log("TokenId: ", thisToken, order.tokenId )

                  const orderToken = order.swapTokenId

                  if ( ( orderToken == selectedToken ) &&
                       ( order.isBuy ) ) {

                    //console.log(order)
                    const type = OrderBookConfig.buy
                    const colour = OrderBookConfig.buyColour

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

                  //console.log("Order! ", order)
                  let selectedToken = ""
                  if ( token.hasOwnProperty("value") ) {
                    selectedToken = token.value
                  }

                  const orderToken = order.tokenId

                  if ( ( orderToken == selectedToken ) &&
                       ( !order.isBuy ) ) {

                    //console.log(order)
                    const type = OrderBookConfig.sell
                    const colour = OrderBookConfig.sellColour

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

        : (

          <Grid container alignItems="flex-start">

            <Grid item container justify="flex-start" xs={12}>
              <Typography variant="h3">
                {token.hasOwnProperty("label") ? token.name : ""}
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

                  const colour = trade.isBuy ? TradesConfig.buyColour : TradesConfig.sellColour

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

      <Modal
        aria-labelledby={Help.orderSure}
        aria-describedby={Help.orderSure}
        className={classes.orderModal}
        open={orderDialogue}
        onClose={orderDialogueClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={orderDialogue}>
          <div className={classes.orderModalSub}>
              { order.isBuy ?
                <Typography variant="h3">
                  You are about to place a buy order of {order.amount.toString()} {token.name} at {order.price.toString()} Minima each. Total order value is {order.total.toString()} Minima
                </Typography>
                : (
                  <Typography variant="h3">
                    You are about to place a sell order of {order.amount.toString()} {token.name} at {order.price.toString()} Minima each. Total order value is {order.total.toString()} Minima
                  </Typography>
                )
              }

            <br/>
            <div className={classes.orderModalSubIcons}>
              <IconButton
                onClick={orderDialogueClose}
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
                onClick={() => doOrder()}
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
                  You are about to sell {take.amount.toString()} {token.name} at {take.price.toString()} Minima each. You will receive {take.total.toString()} Minima
                </Typography>
                : (
                  <Typography variant="h3">
                    You are about to buy {take.amount.toString()} {token.name} at {take.price.toString()} Minima each. You will spend {take.total.toString()} Minima
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
   submitOrder: (order: NewOrder) => dispatch(submitOrder(order)),
   takeOrder: (order: Order) => dispatch(takeOrder(order))
 }
}

export const OrderBook = connect<OrdersStateProps, OrdersDispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(display)
