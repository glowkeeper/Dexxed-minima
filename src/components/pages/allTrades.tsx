import React from 'react'
import { Home as HomeConfig } from '../../config'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { Local } from '../../config'
import { Trades } from '../../config/strings'

import { themeStyles } from '../../styles'

export const AllTrades = () => {

  const classes = themeStyles()

  return (
    <Grid container alignItems="flex-start">
      <Grid container justify="flex-start">
        <Grid item container justify="flex-start" xs={12}>
          <Typography variant="h2">
            {Trades.allTradesHeading}
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

      </Grid>

      <Grid className={classes.details} item container justify="flex-start" xs={12}>
        <Typography variant="body1">
          Coming soon..
        </Typography>
      </Grid>
    </Grid>
  )
}
