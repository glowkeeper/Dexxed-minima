import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { NavLink, Redirect } from 'react-router-dom'

import GoogleFontLoader from 'react-google-font-loader'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import Fade from '@material-ui/core/Fade'

import { Home } from './home'
import { Content } from '../content'
import { AppInit } from '../appInit'
import { App } from '../../config/strings'

import {
  ApplicationState,
  AppDispatch,
  AppDataProps,
  AppData } from '../../store'

import IconButton from '@material-ui/core/IconButton'

import ReactTooltip from 'react-tooltip'

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

import { Paths, Local, Help } from '../../config'

interface MainStateProps {
  appData: AppData
}

type Props =  MainStateProps

const display = (props: Props) => {

  const [isLoading, setLoading] = useState(true)
  const [icons, setIcons] = useState([myBalancesActiveIcon, myOrdersIcon, myTradesIcon, allTradesIcon, orderBookIcon, helpIcon, infoIcon, contactIcon])

  const classes = themeStyles()

  useEffect(() => {

    //console.log("main with: ", props.appData.activePage)
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
  }, [props.appData])

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
                  <img className={classes.headerIcon} src={logoIcon}/>
                </Grid>

                <Grid item container justify="flex-end" xs={6}>

                  <div className={classes.subHeaderIconParent}>

                    <NavLink to={Local.help} className={classes.link}>
                      <IconButton
                        color="primary"
                        aria-label="Help"
                        component="span"
                        size="small">
                        <img
                          data-for={helpIcon}
                          data-tip
                          src={icons[5]}
                          className={classes.helpIcon}
                        />
                      </IconButton>
                      <ReactTooltip
                        id={helpIcon}
                        place="bottom"
                        effect="solid"
                      >
                        {Help.helpTip}
                      </ReactTooltip>
                    </NavLink>

                    <NavLink to={Local.contact} className={classes.link}>
                      <IconButton
                        color="primary"
                        aria-label="Contact"
                        component="span"
                        size="small">
                        <img
                          data-for={contactIcon}
                          data-tip
                          src={icons[7]}
                          className={classes.contactIcon}
                        />
                      </IconButton>
                      <ReactTooltip
                        id={contactIcon}
                        place="bottom"
                        effect="solid"
                      >
                        {Help.contactTip}
                      </ReactTooltip>
                    </NavLink>

                    <NavLink to={Local.about} className={classes.link}>
                      <IconButton
                        color="primary"
                        aria-label="Info"
                        component="span"
                        size="small">
                        <img
                          data-for={infoIcon}
                          data-tip
                          src={icons[6]}
                          className={classes.aboutIcon}
                        />
                      </IconButton>
                      <ReactTooltip
                        id={infoIcon}
                        place="bottom"
                        effect="solid"
                      >
                        {Help.aboutTip}
                      </ReactTooltip>
                    </NavLink>

                  </div>

                </Grid>

              </Grid>

              <Grid className={classes.content} alignItems="flex-start" item container xs={12}>
                <Content />
              </Grid>


              <Grid item container className={classes.footer} justify="space-between"  alignItems="flex-start" xs={12}>

                <Grid item container justify="center" xs={2}>

                 <NavLink to={Local.balances}>
                    <IconButton
                     color="primary"
                     aria-label={Help.balancesTip}
                     component="span"
                     size="small">
                     <img
                      data-for={myBalancesIcon}
                      data-tip
                      src={icons[0]}
                      className={classes.footerIcon}
                    />
                    </IconButton>
                    <ReactTooltip
                      id={myBalancesIcon}
                      place="top"
                      effect="solid"
                    >
                      {Help.balancesTip}
                    </ReactTooltip>
                 </NavLink>

                </Grid>

                <Grid item container justify="center" xs={2}>

                   <NavLink to={Local.orders}>
                     <IconButton
                       color="primary"
                       aria-label={Help.ordersTip}
                       component="span"
                       size="small">
                       <img
                        data-for={myOrdersIcon}
                        data-tip
                        src={icons[1]}
                        className={classes.footerIcon}
                      />
                      </IconButton>
                      <ReactTooltip
                        id={myOrdersIcon}
                        place="top"
                        effect="solid"
                      >
                        {Help.ordersTip}
                      </ReactTooltip>
                   </NavLink>

                </Grid>

                <Grid item container justify="center" xs={2}>

                  <NavLink to={Local.trades}>
                    <IconButton
                      color="primary"
                      aria-label={Help.tradesTip}
                      component="span"
                      size="small">
                      <img
                       data-for={myTradesIcon}
                       data-tip
                       src={icons[2]}
                       className={classes.footerIcon}
                     />
                     </IconButton>
                     <ReactTooltip
                       id={myTradesIcon}
                       place="top"
                       effect="solid"
                     >
                       {Help.tradesTip}
                     </ReactTooltip>
                  </NavLink>

                </Grid>

                <Grid item container justify="center" xs={2}>

                  <NavLink to={Local.allTrades}>
                    <IconButton
                      color="primary"
                      aria-label={Help.allTradesTip}
                      component="span"
                      size="small">
                      <img
                       data-for={allTradesIcon}
                       data-tip
                       src={icons[3]}
                       className={classes.footerIcon}
                     />
                     </IconButton>
                     <ReactTooltip
                       id={allTradesIcon}
                       place="top"
                       effect="solid"
                     >
                       {Help.allTradesTip}
                     </ReactTooltip>
                  </NavLink>

                </Grid>

                <Grid item container justify="center" xs={2}>

                  <NavLink to={Local.orderBook}>
                    <IconButton
                      color="primary"
                      aria-label={Help.orderBookTip}
                      component="span"
                      size="small">
                      <img
                       data-for={orderBookIcon}
                       data-tip
                       src={icons[4]}
                       className={classes.footerIcon}
                     />
                     </IconButton>
                     <ReactTooltip
                       id={orderBookIcon}
                       place="top"
                       effect="solid"
                     >
                       {Help.orderBookTip}
                     </ReactTooltip>
                  </NavLink>

                </Grid>

              </Grid>

            </Grid>
          </Fade>
        )
      }
    </>
  )
}

const mainNav = (props: Props) => {

  let path = window.location.href
  const indexOf = path.indexOf("index")
  if (indexOf > -1) {
      const redirect = path.substr(0, indexOf)
      window.location.href = redirect
  }

  return display(props)
}

const mapStateToProps = (state: ApplicationState): MainStateProps => {
  return { appData: state.appData.data }
}

export const Main = connect<MainStateProps, {}, {}, ApplicationState>(
  mapStateToProps
)(mainNav)
