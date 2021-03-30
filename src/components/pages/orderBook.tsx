import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { Decimal } from 'decimal.js'

import { submitOrder } from '../../store/app/blockchain/tx/actions'
import { setActivePage, setActiveToken } from '../../store/app/appData/actions'

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
import { useFormik } from 'formik'

import { Local, GeneralError, Help } from '../../config'

import { TokenOrders } from './tokenOrders'
import { TokenTrades } from './tokenTrades'

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
  ActiveToken,
  AllTradesProps,
  Trade
} from '../../store'

interface OrdersStateProps {
  activeToken: ActiveToken
  tokenData: TokenProps
}

interface OrdersDispatchProps {
  setActivePage: () => void
  setActiveToken: (token: ActiveToken) => void
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

  const [isBuy, setIsBuy] = useState(true)
  const [tradeColours, setTradeColours] = useState([OrderBookConfig.buyColour, OrderBookConfig.disabledColour])

  const [isOrder, setIsOrder] = useState(true)
  const [bookColours, setBookColours] = useState([OrderBookConfig.liveColour, OrderBookConfig.disabledColour])

  const [tokens, setTokens] = useState([] as ActiveToken[])
  const [token, setToken] = useState({} as ActiveToken)

  const classes = themeStyles()
  props.setActivePage()

  useEffect(() => {

    if ( props.tokenData ) {

      let options = [] as any
      props.tokenData.data.forEach(element => {

        const thisOption = {
          value: element.tokenId,
          name: element.tokenName,
          label: `${element.tokenName} (${element.tokenId})`
        }
        options.push(thisOption)

        if ( props.activeToken ) {
          if ( thisOption.value === props.activeToken.value ) {
            setToken(thisOption)
          }
        }
      })
      setTokens(options)
    }

  }, [props.tokenData, props.activeToken])

  const doSetToken = (token: ActiveToken | null) => {
    if ( token ) {
      setToken(token)
      props.setActiveToken(token)
    }
  }

  const getToken = () => token

  const formik = useFormik({
    initialValues: {
      token: token,
      amount: 0,
      price: 0
    },
    enableReinitialize: true,
    validationSchema: tradeSchema,
    onSubmit: (values: any) => {

      //console.log("Values: ", values)
      const decPrice = new Decimal(values.price)
      let decAmount = new Decimal(values.amount)
      let decTotal = decAmount.mul(decPrice)
      let hasTokenId = minimaTokenId
      let wantsTokenId = values.token.value
      if ( !isBuy ) {
        // swap everything :)
        hasTokenId = values.token.value
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

      setOrder(orderInfo)
      setOrderDialogue(true)
    },
  })

  const isBuyOrder = (isBuy: boolean) => {

    setIsBuy(isBuy)
    if ( isBuy ) {
      setTradeColours([OrderBookConfig.buyColour, OrderBookConfig.disabledColour])
    } else {
      setTradeColours([OrderBookConfig.disabledColour, OrderBookConfig.sellColour])
    }
  }

  const isOrderBook = (book: boolean) => {

    setIsOrder(book)
    if ( book ) {
      setBookColours([OrderBookConfig.liveColour, OrderBookConfig.disabledColour])
    } else {
      setBookColours([OrderBookConfig.disabledColour, OrderBookConfig.liveColour])
    }
  }

  const orderDialogueClose = () => {
    setOrderDialogue(false)
  }

  const doOrder = () => {
    setOrderDialogue(false)
    props.submitOrder(order)
  }

  return (
    <Grid container alignItems="flex-start">

      <Grid item container justify="flex-start" xs={12}>
        <Typography variant="h2">
          {OrderBookConfig.heading}
        </Typography>
      </Grid>

      <Grid item container className={classes.formLabel} xs={6}>
        <Button
          onClick={() => isBuyOrder(true)}
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
          onClick={() => isBuyOrder(false)}
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
                  value={token}
                  onChange={selectedOption => {
                    doSetToken(selectedOption)
                    const thisValue = selectedOption ? selectedOption.value : ""
                    formik.setFieldValue("token", thisValue)
                  }}
                  options={tokens}
                  name="token"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      '&:hover': {
                        border: '2px solid #001C32'
                      },
                      border: '2px solid #C8C8D4',
                      boxShadow: 'none'
                    }),
                  }}
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

            <Grid item container xs={6}>

              <Grid item container className={classes.formLabel} justify="flex-start" alignItems="center" xs={2}>
                <label htmlFor="amount">{OrderBookConfig.amount}</label>
              </Grid>
              <Grid item container xs={10}>
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

            <Grid item container xs={6}>

              <Grid item container className={classes.formLabel} justify="flex-end" alignItems="center" xs={2}>
                <label
                  htmlFor="price"
                  style={{
                    paddingRight: "8px"
                  }}
                >
                  {OrderBookConfig.price}
                </label>
              </Grid>
              <Grid item container xs={10}>
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
          onClick={() => isOrderBook(true)}
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
          onClick={() => isOrderBook(false)}
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

        <TokenOrders token={{
            tokenId: token.value,
            tokenName: token.name,
            scale: "",
            total: ""
          }}
        />

        : (

          <TokenTrades token={{
              tokenId: token.value,
              tokenName: token.name,
              scale: "",
              total: ""
            }}
          />

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

    </Grid>
  )
}

const mapStateToProps = (state: ApplicationState): OrdersStateProps => {

  const tokens = state.tokens as TokenProps
  const token = state.appData.data.activeToken
  return {
    activeToken: token,
    tokenData: tokens
  }
}

const mapDispatchToProps = (dispatch: AppDispatch): OrdersDispatchProps => {
 return {
   setActivePage: () => dispatch(setActivePage(Local.orderBook)),
   setActiveToken: (token: ActiveToken) => dispatch(setActiveToken(token)),
   submitOrder: (order: NewOrder) => dispatch(submitOrder(order))
 }
}

export const OrderBook = connect<OrdersStateProps, OrdersDispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(display)
