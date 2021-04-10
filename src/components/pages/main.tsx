import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { NavLink, Redirect } from 'react-router-dom'

import GoogleFontLoader from 'react-google-font-loader'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Fade from '@material-ui/core/Fade'

import { Home } from './home'
import { Content } from '../content'
import { AppInit } from '../appInit'
import { App } from '../../config/strings'

import {
  ApplicationState,
  AppDispatch,
  AppDataProps,
  AppData,
  TxData
} from '../../store'

import { initialise } from '../../store/app/blockchain/tx/actions'

import IconButton from '@material-ui/core/IconButton'

import helpIcon from '../../images/helpIcon.svg'
import helpActiveIcon from '../../images/helpActiveIcon.svg'
import infoIcon from '../../images/infoIcon.svg'
import infoActiveIcon from '../../images/infoActiveIcon.svg'
import contactIcon from '../../images/contactIcon.svg'
import contactActiveIcon from '../../images/contactActiveIcon.svg'

import myBalancesIcon from '../../images/myBalancesIcon.svg'
import myBalancesActiveIcon from '../../images/myBalancesActiveIcon.svg'
import myOrdersIcon from '../../images/myOrdersIcon.svg'
import myOrdersActiveIcon from '../../images/myOrdersActiveIcon.svg'
import myTradesIcon from '../../images/myTradesIcon.svg'
import myTradesActiveIcon from '../../images/myTradesActiveIcon.svg'
import allTradesIcon from '../../images/allTradesIcon.svg'
import allTradesActiveIcon from '../../images/allTradesActiveIcon.svg'
import orderBookIcon from '../../images/orderBookIcon.svg'
import orderBookActiveIcon from '../../images/orderBookActiveIcon.svg'

import logoIcon from '../../images/logo.svg'

import { themeStyles } from '../../styles'

import { Paths, Local, Help, Transaction } from '../../config'

interface StateProps {
  appData: AppData
  tx: TxData
  block: number
}

interface DispatchProps {
  initialise: () => void
}

type Props =  StateProps & DispatchProps

const display = (props: Props) => {

  const [isLoading, setLoading] = useState(true)
  const [summary, setSummary] = useState("")
  const [block, setBlock] = useState(1)
  let isFirstRun = useRef(true)

  const [icons, setIcons] = useState([myBalancesActiveIcon, myOrdersIcon, myTradesIcon, allTradesIcon, orderBookIcon, helpIcon, infoIcon, contactIcon])

  const classes = themeStyles()

  useEffect(() => {

    let summaryTimeout: any

    if ( props.appData.activePage === Local.balances ) {

      setLoading(false)
      setIcons([myBalancesActiveIcon, myOrdersIcon, myTradesIcon, allTradesIcon, orderBookIcon, helpIcon, infoIcon, contactIcon])

    } else if ( props.appData.activePage === Local.orders ) {

      setLoading(false)
      setIcons([myBalancesIcon, myOrdersActiveIcon, myTradesIcon, allTradesIcon, orderBookIcon, helpIcon, infoIcon, contactIcon])

    } else if ( props.appData.activePage === Local.trades ) {

      setLoading(false)
      setIcons([myBalancesIcon, myOrdersIcon, myTradesActiveIcon, allTradesIcon, orderBookIcon, helpIcon, infoIcon, contactIcon])

    } else if ( props.appData.activePage === Local.allTrades ) {

      setLoading(false)
      setIcons([myBalancesIcon, myOrdersIcon, myTradesIcon, allTradesActiveIcon, orderBookIcon, helpIcon, infoIcon, contactIcon])

    } else if ( props.appData.activePage === Local.orderBook ) {

      setLoading(false)
      setIcons([myBalancesIcon, myOrdersIcon, myTradesIcon, allTradesIcon, orderBookActiveIcon, helpIcon, infoIcon, contactIcon])

    }  else if ( props.appData.activePage === Local.help ) {

      setLoading(false)
      setIcons([myBalancesIcon, myOrdersIcon, myTradesIcon, allTradesIcon, orderBookIcon, helpActiveIcon, infoIcon, contactIcon])

    } else if ( props.appData.activePage === Local.about ) {

      setLoading(false)
      setIcons([myBalancesIcon, myOrdersIcon, myTradesIcon, allTradesIcon, orderBookIcon, helpIcon, infoActiveIcon, contactIcon])

    } else if ( props.appData.activePage === Local.contact ) {

      setLoading(false)
      setIcons([myBalancesIcon, myOrdersIcon, myTradesIcon, allTradesIcon, orderBookIcon, helpIcon, infoIcon, contactActiveIcon])
    }

    if ( props.tx.summary.length ) {

      setSummary(props.tx.summary)
      summaryTimeout = setTimeout(() => {
        props.initialise()
        setSummary("")
     }, 3000)
    }

    if ( props.block != block ) {
      setBlock(props.block)
    }

    return () => {
      clearTimeout(summaryTimeout)
    }

  }, [props.appData, props.tx, props.block])

  return (
    <>
      {isLoading ?
        <div>
          <AppInit />
          <Home />
        </div> : (

          <Fade in={!isLoading} timeout={500}>

            <Grid className={classes.root}>

              <GoogleFontLoader
                fonts={[
                  {
                    font: 'Manrope',
                    weights: [300, 400, 500, 600, 700],
                  },
                  {
                    font: 'Roboto',
                    weights: [300, 400, 500, 600, 700],
                  }
                ]}
              />

              <Grid item container alignItems="center" className={classes.header} xs={12}>

                <Grid item container justify="flex-start" xs={6}>
                  <img className={classes.appNameIcon} src={logoIcon}/>
                </Grid>

                <Grid item container justify="flex-end" xs={6}>

                  <div className={classes.subHeaderIconParent}>

                    <NavLink to={Local.help} className={classes.link}>
                      <IconButton
                        aria-label="Help"
                        size="small"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="27"
                          height="auto"
                          viewBox="0 0 27 27"
                        >
                          <g
                            className={ props.appData.activePage === Local.help ? classes.headerActiveIcon : classes.headerIcon }
                            transform="translate(8.691 6.018)"
                          >
                            <rect
                              width="2.407"
                              height="2.52"
                              transform="translate(2.882 11.443)"
                            />
                            <path
                              d="M98.461,91.111a6.7,6.7,0,0,1-1.07,1.494c-.2.215-.4.406-.581.57s-.354.326-.509.481a2.452,2.452,0,0,0-.385.49,2.206,2.206,0,0,0-.314.756,5.962,5.962,0,0,0-.047.86H93.129a6.221,6.221,0,0,1,.128-1.269,3.951,3.951,0,0,1,.424-1.137,2.96,2.96,0,0,1,.57-.8,8.786,8.786,0,0,1,.7-.6,7.575,7.575,0,0,0,.866-.8,2.225,2.225,0,0,0,.514-.852,3.242,3.242,0,0,0,.123-.909,2.525,2.525,0,0,0-.066-.589,1.138,1.138,0,0,0-.238-.476,1.452,1.452,0,0,0-.685-.5,2.68,2.68,0,0,0-.9-.148,2.768,2.768,0,0,0-.745.1,1.584,1.584,0,0,0-.605.31,1.346,1.346,0,0,0-.418.56,1.845,1.845,0,0,0-.124.733H90.266a4.817,4.817,0,0,1,.518-1.764,3.565,3.565,0,0,1,1.118-1.3,3.868,3.868,0,0,1,1.222-.6,4.835,4.835,0,0,1,1.365-.2,5.94,5.94,0,0,1,1.974.324,3.446,3.446,0,0,1,1.546,1.065,3.383,3.383,0,0,1,.652,1.122,3.914,3.914,0,0,1,.223,1.294A3.8,3.8,0,0,1,98.461,91.111Z"
                              transform="translate(-90.266 -85.518)"
                            />
                          </g>
                        </svg>
                      </IconButton>
                    </NavLink>

                    <NavLink to={Local.contact} className={classes.link}>
                      <IconButton
                        aria-label="Contact"
                        size="small"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                            width="36"
                            height="36"
                            viewBox="0 0 36 36"
                          >
                            <g
                              className={props.appData.activePage === Local.contact ? classes.headerActiveIcon : classes.headerIcon}
                              transform="translate(-1847.553 -521.581)"
                            >
                              <path
                                d="M1869.09,539.558l6.968,5.942V533.66Zm-14.036-5.894V545.5l6.966-5.9Zm13.009,6.763-2.225,1.884a.5.5,0,0,1-.323.118.5.5,0,0,1-.325-.119l-2.146-1.831-.253-.216-6.873,5.818H1875.2l-6.88-5.869Zm-4.884-1.147.615.524,1.722,1.468,1.8-1.524.616-.521.387-.327,6.874-5.819h-19.282l6.882,5.87Z"
                              />
                            </g>
                          </svg>
                        </IconButton>
                    </NavLink>

                    <NavLink to={Local.about} className={classes.link}>
                      <IconButton
                        aria-label="Info"
                        size="small"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="27"
                          height="27"
                          viewBox="0 0 27 27"
                        >
                          <g
                            className={props.appData.activePage === Local.about ? classes.headerActiveIcon : classes.headerIcon}
                            transform="translate(11.45 5.678)"
                          >
                            <rect
                              width="3.099"
                              height="9.757"
                              transform="translate(0 4.98)"
                            />
                            <rect
                              width="3.099"
                              height="2.842"
                            />
                          </g>
                        </svg>
                      </IconButton>
                    </NavLink>

                  </div>

                </Grid>

              </Grid>

              <Grid className={classes.content} alignItems="flex-start" item container xs={12}>
                <Content />
              </Grid>


              <Grid item container className={classes.footer} alignItems="flex-start" xs={12}>

                <Grid item container  justify="space-between" xs={12}>

                  <Grid item container justify="center" xs={2}>

                   <NavLink to={Local.balances}>
                    <IconButton
                     aria-label={Help.balancesTip}
                     size="small"
                    >
                       <img
                        src={icons[0]}
                        className={classes.footerIcon}
                       />
                      </IconButton>
                   </NavLink>

                  </Grid>

                  <Grid item container justify="center" xs={2}>

                     <NavLink to={Local.orders}>
                       <IconButton
                         aria-label={Help.ordersTip}
                         size="small">
                         <img
                          src={icons[1]}
                          className={classes.footerIcon}
                        />
                        </IconButton>
                     </NavLink>

                  </Grid>

                  <Grid item container justify="center" xs={2}>

                    <NavLink to={Local.trades}>
                      <IconButton
                        aria-label={Help.tradesTip}
                        size="small">
                        <img
                         src={icons[2]}
                         className={classes.footerIcon}
                       />
                       </IconButton>
                    </NavLink>

                  </Grid>

                  <Grid item container justify="center" xs={2}>

                    <NavLink to={Local.allTrades}>
                      <IconButton
                        aria-label={Help.allTradesTip}
                        size="small">
                        <img
                         src={icons[3]}
                         className={classes.footerIcon}
                       />
                       </IconButton>
                    </NavLink>

                  </Grid>

                  <Grid item container justify="center" xs={2}>

                    <NavLink to={Local.orderBook}>
                      <IconButton
                        aria-label={Help.orderBookTip}
                        size="small">
                        <img
                         src={icons[4]}
                         className={classes.footerIcon}
                       />
                       </IconButton>
                    </NavLink>

                  </Grid>

                </Grid>

                <Grid item container xs={6} justify="flex-start">
                  <Typography variant="h5">
                    {summary}
                  </Typography>
                </Grid>

                <Grid item container xs={6} justify="flex-end">
                  <Typography variant="h5">
                    {Transaction.block}: {block}
                  </Typography>
                </Grid>

              </Grid>

            </Grid>
          </Fade>
        )
      }
    </>
  )
}

const mapStateToProps = (state: ApplicationState): StateProps => {
  return {
    appData: state.appData.data,
    tx: state.tx.data as TxData,
    block: state.chainInfo.data.block
  }
}


const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
 return {
   initialise: () => dispatch(initialise())
 }
}

export const Main = connect<StateProps, DispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(display)
