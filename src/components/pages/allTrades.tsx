import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { setActivePage } from '../../store/app/appData/actions'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Spinner from 'react-spinner-material'

import { Local } from '../../config'
import { Trades as TradesConfig } from '../../config/strings'

import { themeStyles } from '../../styles'

import {
  ApplicationState,
  AppDispatch,
  AllTradesProps,
  Trade
} from '../../store'

interface TradesStateProps {
  initialised: boolean
  tradeData: AllTradesProps
}

interface TradesDispatchProps {
  setActivePage: () => void
}

type Props = TradesStateProps & TradesDispatchProps

const display = (props: Props) => {

  const [isLoading, setIsLoading] = useState(true)

  const classes = themeStyles()
  props.setActivePage()

  useEffect(() => {

    if ( ( props.initialised ) &&
         ( isLoading ) ) {

      setIsLoading(false)
    }

  }, [props.initialised])

  return (
    <Grid container alignItems="flex-start">

      <Grid item container justify="flex-start" xs={12}>
        <Typography variant="h2">
          {TradesConfig.allTradesHeading}
        </Typography>
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
      <Grid item container justify="flex-end" xs={2}>
        <Typography variant="h3">
          {TradesConfig.amount}
        </Typography>
      </Grid>
      <Grid item container justify="flex-end" xs={2}>
        <Typography variant="h3">
          {TradesConfig.total}
        </Typography>
      </Grid>
      <Grid item container justify="flex-end" xs={2}>
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

            //console.log(trade)

            const type = trade.isBuy ? TradesConfig.buy : TradesConfig.sell
            const colour = trade.isBuy ? TradesConfig.buyColour : TradesConfig.sellColour

            const amount = +trade.amount
            const thisAmount = amount.toFixed(2)

            const price = +trade.price
            const thisPrice = price.toFixed(2)

            const total = +trade.total
            const thisTotal = total.toFixed(2)

            const rowclass = index % 2 ? classes.evenRow : classes.oddRow

            return (
              <React.Fragment key={index}>

                <Grid className={rowclass} item container xs={12}>

                  <Grid item container justify="flex-start" xs={2}>
                   <Typography style={{color: `${colour}`}} variant="body1">
                     {type}
                   </Typography>
                  </Grid>
                  <Grid item container justify="flex-start" xs={2}>
                   <Typography style={{ wordWrap: 'break-word' }} variant="body1">
                     {trade.tokenName}
                   </Typography>
                  </Grid>
                  <Grid item container justify="flex-end" xs={2}>
                   <Typography variant="body2">
                     {thisPrice}
                   </Typography>
                  </Grid>
                  <Grid item container justify="flex-end" xs={2}>
                   <Typography variant="body2">
                     {thisAmount}
                   </Typography>
                  </Grid>
                  <Grid item container justify="flex-end" xs={2}>
                   <Typography variant="body2">
                     {thisTotal}
                   </Typography>
                  </Grid>
                  <Grid item container justify="flex-end" xs={2}>
                   <Typography variant="body2">
                     {trade.block}
                   </Typography>
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

const mapStateToProps = (state: ApplicationState): TradesStateProps => {

  const trades = state.allTrades as AllTradesProps
  const hasInitialised = state.appData.data.hasInitialised
  return {
    initialised: hasInitialised,
    tradeData: trades
  }
}

const mapDispatchToProps = (dispatch: AppDispatch): TradesDispatchProps => {
 return {
   setActivePage: () => dispatch(setActivePage(Local.allTrades))
 }
}

export const AllTrades = connect<TradesStateProps, TradesDispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(display)
