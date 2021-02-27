import React from 'react'
import { connect } from 'react-redux'

import { setActivePage } from '../../store/app/appData/actions'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { Local } from '../../config'
import { Trades as TradesConfig } from '../../config/strings'

import { themeStyles } from '../../styles'

import {
  ApplicationState,
  AppDispatch,
  MyTradesProps,
  Trade
} from '../../store'

interface TradesStateProps {
  tradeData: MyTradesProps
}

interface TradesDispatchProps {
  setActivePage: () => void
}

type Props = TradesStateProps & TradesDispatchProps

const display = (props: Props) => {

  const classes = themeStyles()
  props.setActivePage()

  //console.log("ORDERS!: ", props.tradeData)

  return (
    <Grid container alignItems="flex-start">

      <Grid item container justify="flex-start" xs={12}>
        <Typography variant="h2">
          {TradesConfig.heading}
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
          {TradesConfig.type}
        </Typography>
      </Grid>
      <Grid item container justify="flex-start" xs={2}>
        <Typography variant="h3">
          {TradesConfig.tokenName}
        </Typography>
      </Grid>
      <Grid item container justify="flex-end" xs={2}>
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

      <Grid item container justify="flex-start" xs={12}>
        <svg
           xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 2000 4"
        >
          <line x2="2000" stroke="#00cccc" strokeWidth={4} />
        </svg>
      </Grid>

      {
        props.tradeData.data.map( ( trade: Trade, index: number ) => {

          console.log(trade)

          const type = trade.isBuy ? `${TradesConfig.buy}` : `${TradesConfig.sell}`
          const color = trade.isBuy ? `${TradesConfig.buyColor}` : `${TradesConfig.sellColor}`

          const amount = +trade.amount
          const thisAmount = amount.toFixed(2)

          const price = +trade.price
          const thisPrice = price.toFixed(2)

          const total = +trade.total
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
                 {trade.tokenName}
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

const mapStateToProps = (state: ApplicationState): TradesStateProps => {

  const trades = state.myTrades as MyTradesProps
  return {
    tradeData: trades
  }
}

const mapDispatchToProps = (dispatch: AppDispatch): TradesDispatchProps => {
 return {
   setActivePage: () => dispatch(setActivePage(Local.trades))
 }
}

export const Trades = connect<TradesStateProps, TradesDispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(display)
