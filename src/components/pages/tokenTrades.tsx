import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Spinner from 'react-spinner-material'

import { TokenOrders } from './TokenOrders'

import {
  Trades as TradesConfig,
  Misc
} from '../../config'

import { themeStyles } from '../../styles'

import {
  ApplicationState,
  Token,
  AllTradesProps,
  Trade
} from '../../store'

interface TokenTradeProps {
  token: Token
}

interface OrdersStateProps {
  initialised: boolean
  tradeData: AllTradesProps
}

type Props = TokenTradeProps & OrdersStateProps

const display = (props: Props) => {

  const [isLoading, setIsLoading] = useState(true)

  const classes = themeStyles()

  useEffect(() => {

    if ( ( props.initialised ) &&
         ( isLoading ) ) {

      setIsLoading(false)
    }

  }, [props.initialised])

  return (
    <Grid container alignItems="flex-start">

      <Grid item container justify="flex-start" xs={12}>
        <Typography variant="h3">
          {props.token.tokenName}
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

      <Grid item container justify="flex-start" xs={12}>
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

          props.tradeData.data.map( ( trade: Trade, index: number ) => {

            if ( trade.tokenId == props.token.tokenId ) {

              const colour = trade.isBuy ? TradesConfig.buyColour : TradesConfig.sellColour

              const amount = +trade.amount
              const thisAmount = amount.toFixed(Misc.amountDecimals)

              const price = +trade.price
              const thisPrice = price.toFixed(Misc.priceDecimals)

              const total = +trade.total
              const thisTotal = total.toFixed(Misc.totalDecimals)

              //const rowclass = index % 2 ? classes.evenRow : classes.oddRow
              //<Grid className={rowclass} item container xs={12}>

              return (
                <React.Fragment key={index}>

                  <Grid item container xs={12}>

                    <Grid item container justify="flex-end" xs={3}>
                     <Typography style={{color: colour}} variant="body2">
                       {thisPrice}
                     </Typography>
                    </Grid>
                    <Grid item container justify="flex-end" xs={3}>
                     <Typography style={{color: colour}} variant="body2">
                       {thisAmount}
                     </Typography>
                    </Grid>
                    <Grid item container justify="flex-end" xs={3}>
                     <Typography style={{color: colour}} variant="body2">
                       {thisTotal}
                     </Typography>
                    </Grid>
                    <Grid item container justify="flex-end" xs={3}>
                     <Typography  style={{color: colour}} variant="body2">
                       {trade.block}
                     </Typography>
                    </Grid>

                  </Grid>

                </React.Fragment>
              )
            }
          })
        )
      }
    </Grid>
  )
}

const mapStateToProps = (state: ApplicationState): OrdersStateProps => {

  const trades = state.allTrades as AllTradesProps
  const hasInitialised = state.appData.data.hasInitialised
  return {
    initialised: hasInitialised,
    tradeData: trades
  }
}

export const TokenTrades = connect<OrdersStateProps, {}, {}, ApplicationState>(
  mapStateToProps
)(display)
