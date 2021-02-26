import React from 'react'
import { connect } from 'react-redux'

import { setActivePage } from '../../store/app/appData/actions'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { Local } from '../../config'
import { Balances as BalancesConfig } from '../../config/strings'


import { themeStyles } from '../../styles'

import {
  ApplicationState,
  AppDispatch,
  BalanceProps,
  Balance
} from '../../store'

interface BalanceStateProps {
  balanceData: BalanceProps
}

interface BalanceDispatchProps {
  setActivePage: () => void
}

type Props = BalanceStateProps & BalanceDispatchProps

export const display = (props: Props) => {

  const classes = themeStyles()
  props.setActivePage()

  //console.log(props.balanceData)

  return (
    <Grid container alignItems="flex-start">

      <Grid item container justify="flex-start" xs={12}>
        <Typography variant="h2">
          {BalancesConfig.heading}
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

      <Grid item container justify="flex-start" xs={6}>
        <Typography variant="h3">
          {BalancesConfig.token}
        </Typography>
      </Grid>
      <Grid item container justify="flex-end" xs={6}>
        <Typography variant="h3">
          {BalancesConfig.amount}
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
        props.balanceData.data.map( ( balance: Balance, index: number ) => {

          //console.log(balance)
          const amount = +balance.confirmed
          const thisAmount = amount.toFixed(2)

          return (
            <React.Fragment key={index}>

              <Grid className={classes.details} item container justify="flex-start" xs={6}>
               <Typography variant="body1">
                 {balance.token}
               </Typography>
              </Grid>
              <Grid className={classes.details} item container justify="flex-end" xs={6}>
               <Typography variant="body1">
                 {thisAmount}
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


const mapStateToProps = (state: ApplicationState): BalanceStateProps => {

  const balances = state.balance as BalanceProps
  return {
    balanceData: balances
  }
}

const mapDispatchToProps = (dispatch: AppDispatch): BalanceDispatchProps => {
 return {
   setActivePage: () => dispatch(setActivePage(Local.balances))
 }
}

export const Balances = connect<BalanceStateProps, BalanceDispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(display)
