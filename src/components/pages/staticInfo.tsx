import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { ApplicationState, AppDispatch, InfoProps, InfoTypes } from '../../store/types'

import { themeStyles } from '../../styles'

import { Local } from '../../config'
import { About, Help, Contact } from '../../config/strings'

import { setActivePage } from '../../store/app/appData/actions'

interface StaticInfoProps {
  type: InfoTypes
}

interface DispatchProps {
  setActivePage: (page: string) => void
}

type Props = StaticInfoProps & DispatchProps

const display = (props: Props) => {

    const [pageData, setPageData] = useState({title: About.heading,
    data: About.info})

    let classes = themeStyles()

    useEffect(() => {

      switch (props.type) {
        case InfoTypes.ABOUT:

          setPageData({ title: About.heading, data: About.info })
          props.setActivePage(Local.about)
          break

        case InfoTypes.HELP:

          setPageData({ title: Help.heading, data: Help.info })
          props.setActivePage(Local.help)
          break

        case InfoTypes.CONTACT:

          setPageData({ title: Contact.heading, data: Contact.info })
          props.setActivePage(Local.contact)
          break

        default:
        
          props.setActivePage(Local.home)
      }

    }, [props.type])

    return (
      <Grid container alignItems="flex-start">
        <Grid item container justify="flex-start" xs={12}>
          <Typography variant="h2">
            {pageData.title}
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

        { pageData.data.map( (data: string, i: number ) => {

          return (

            <React.Fragment key={i}>

              <Grid item container className={classes.details} xs={12}>
                <Typography variant="body1">
                  {data}
                </Typography>
              </Grid>
            </React.Fragment>
          )

        })}
      </Grid>
    )
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
 return {
   setActivePage: (page: string) => dispatch(setActivePage(page))
 }
}

export const Info = connect<DispatchProps, {}, {}, ApplicationState>(
  null,
  mapDispatchToProps
)(display)
