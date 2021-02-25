import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { connect } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Fade from '@material-ui/core/Fade'

import { ApplicationState, AppDispatch } from '../../store/types'

import { themeStyles } from '../../styles'

import { Local } from '../../config'
import { Home as HomeConfig, App } from '../../config/strings'

import logoIcon from '../../images/logo.svg'
import appNameIcon from '../../images/minimaLogo.png'
//import minimaIcon from '../../images/minimaIcon.svg'

import { setActivePage } from '../../store/app/appData/actions'

interface HomeDispatchProps {
  setActivePage: (page: string) => void
}

type Props = HomeDispatchProps

const landing = (props: Props) => {

  const [loadLogo, setLoadLogo] = useState(true)
  const [loadAppName, setLoadAppName] = useState(false)
  const [exit, setExit] = useState(false)

  let history = useHistory()

  const classes = themeStyles()

  useEffect(() => {

    /*let appTimeout = setTimeout(() => {
      setLoadAppName(true)
    }, 1000)*/

    let exitTimeout = setTimeout(() => {
      setExit(true)
    }, 2000)

    let pageTimeout = setTimeout(() => {
      props.setActivePage(Local.balances)
      history.push(Local.balances)
    }, 2500)

    return () => {
      //clearTimeout(appTimeout)
      clearTimeout(exitTimeout)
      clearTimeout(pageTimeout)
    }

  }, [])

  return (
    <>
      {exit ?

          <Grid container className={classes.landingExit}>

            <Grid item container className={classes.landingDisplay}>

              <Grid item container justify="center" xs={12}>
                <img className={classes.landingLogoIcon} src={logoIcon}/>
              </Grid>

            </Grid>

          </Grid> : (

          <Grid container className={classes.landing}>

            <Grid item container className={classes.landingDisplay}>

                <Fade in={loadLogo} timeout={1000}>
                  <Grid item container justify="center" xs={12}>
                    <img className={classes.landingLogoIcon} src={logoIcon}/>
                  </Grid>
                </Fade>

            </Grid>

          </Grid>
        )
      }
    </>
  )
}

/*
<div>
  <Grid item container justify="center" xs={12}>
    <img className={classes.landingLogoIcon} src={logoIcon}/>
  </Grid>
  <br/>
  <br/>
  <Fade in={loadAppName} timeout={1000}>
    <Grid item container justify="center" xs={12}>
      <img className={classes.landingAppNameIcon} src={appNameIcon}/>
    </Grid>
  </Fade>
</div>
*/

const mapDispatchToProps = (dispatch: AppDispatch): HomeDispatchProps => {
 return {
   setActivePage: (page: string) => dispatch(setActivePage(page))
 }
}

export const Home = connect<HomeDispatchProps, {}, {}, ApplicationState>(
  null,
  mapDispatchToProps
)(landing)
