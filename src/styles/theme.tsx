import React from 'react'

import { createMuiTheme, responsiveFontSizes, makeStyles } from '@material-ui/core/styles'
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import red from '@material-ui/core/colors/red'
import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/blue'
import indigo from '@material-ui/core/colors/indigo'
import orange from '@material-ui/core/colors/orange'
import yellow from '@material-ui/core/colors/yellow'

/*
xs, extra-small: 0px
sm, small: 600px
md, medium: 960px
lg, large: 1280px
xl, extra-large: 1920px
*/

const breakpoints = createBreakpoints({})
let theme = createMuiTheme ({
  spacing: 8,
  typography: {
    fontFamily: [
      'Manrope',
      'Roboto',
      'Arial',
      'sans-serif',
      '-apple-system',
    ].join(','),
    fontSize: 1,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      [breakpoints.up('xs')]: {
        lineHeight: "1.5",
        fontSize:  "2.5em",
        fontWeight: 700,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#001C32',
      },
      [breakpoints.up('lg')]: {
        lineHeight: "1.5",
        fontSize:  "2em",
        fontWeight: 700,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#001C32'
      }
    },
    h2: {
      [breakpoints.up('xs')]: {
        lineHeight: "1.5",
        fontSize: "2em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#91919D'
      },
      [breakpoints.up('lg')]: {
        lineHeight: "1.5",
        fontSize:  "1.5em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#91919D'
      }
    },
    h3: {
      [breakpoints.up('xs')]: {
        lineHeight: '1.5',
        fontSize: "1.25em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#91919D'
      },
      [breakpoints.up('lg')]: {
        lineHeight: '1.5',
        fontSize: "1em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#91919D'
      }
    },
    h4: {
      [breakpoints.up('xs')]: {
        lineHeight: '1.5',
        fontSize: "1em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#91919D'
      },
      [breakpoints.up('lg')]: {
        lineHeight: '1.5',
        fontSize: "0.9em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#91919D'
      }
    },
    h5: {
      [breakpoints.up('xs')]: {
        lineHeight: "1",
        fontSize: "0.9em",
        fontWeight: 700,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#FFFFFF'
      },
      [breakpoints.up('lg')]: {
        lineHeight: '1.5',
        fontSize: "0.8em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#FFFFFF'
      }
    },
    h6: {
      [breakpoints.up('xs')]: {
        lineHeight: "1.2",
        fontSize: "0.9em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#FFFFFF'
      },
      [breakpoints.up('lg')]: {
        lineHeight: '1.5',
        fontSize: "0.7em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#FFFFFF'
      }
    },
    subtitle1: {
      lineHeight: "2.5",
      fontSize: "1em",
      fontWeight: 600,
      fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
      color: '#FFFFFF'
    },
    subtitle2: {
      fontSize: "0.8em",
      fontWeight: 400,
      fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
      color: '#F0F0FA'
    },
    body1: {
      [breakpoints.up('xs')]: {
        lineHeight: '1.1',
        fontSize: "1em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#001C32'
      },
      [breakpoints.up('lg')]: {
        lineHeight: '1.1',
        fontSize: "1em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        color: '#001C32'
      }
    },
    body2: {
      [breakpoints.up('xs')]: {
        lineHeight: '1',
        fontSize: "1em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        fontFeatureSettings: `'tnum' on`,
        color: '#001C32'
      },
      [breakpoints.up('lg')]: {
        lineHeight: '1',
        fontSize: "1em",
        fontWeight: 400,
        fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
        fontFeatureSettings: `'tnum' on`,
        color: '#001C32'
      }
    },
    caption: {
      fontSize: "1.1em",
      fontWeight: 700,
      fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
      color: '#F0F0FA',
    },
    button: {
      fontSize: "1.8em",
      lineHeight: "1.5",
      textTransform: "none",
      fontWeight: 500,
      fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
      color: '#001C32'
    }
  },
  palette: {
    type: 'dark',
    background: {
      default: '#edefef',
    },
    text: {
      primary: "#001C32",
      secondary: "#001C32"
    },
    primary: {
      main: '#929396'
    },
    secondary: {
      main: '#ff671e'
    },
    error: red,
    warning: orange,
    info: yellow,
    success: green,
  }
})

theme = responsiveFontSizes(theme)

const themeStyles = makeStyles({
  landing: {
    margin: "0",
    padding: "0",
    height: "100vh",
    width: "100vw",
    background: 'linear-gradient(#001C32, #001C32)'
  },
  landingExit: {
    margin: "0",
    padding: "0",
    height: "100vh",
    width: "100vw",
    background: 'linear-gradient(#001C32, #001C32)',
    visibility: "hidden",
    opacity: "0",
    transition: "visibility 0s 0.5s, opacity 0.5s linear"
  },
  landingDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  landingLogoIcon: {
    height: "200px",
    width: '200px'
  },
  landingAppNameIcon: {
    height: "50px",
    width: '336px'
  },
  root: {
    [breakpoints.up('xs')]: {
      background: 'linear-gradient(#000000, #000000)',
      height: "100vh",
      width: "100%",
      position: 'relative'
    },
    [breakpoints.up('lg')]: {
      background: 'linear-gradient(#000000, #000000)',
      marginTop: "2vh",
      marginBottom: "2vh",
      marginLeft: "auto",
      marginRight: "auto",
      height: "96vh",
      width: "60%",
      position: 'relative'
    },
    "& .MuiInputBase-input": {
      border: '2px solid #C8C8D4',
      borderRadius: '5px',
      background: 'linear-gradient(#FFFFFF, #FFFFFF)',
      color: "#001C32",
      padding: theme.spacing(0.5)
    },
    "& .MuiInputBase-input:focus": {
      border: '2px solid #001C32',
      borderRadius: '5px'
    }
  },
  header: {
    [breakpoints.up('xs')]: {
      background: 'linear-gradient(#001C32, #001C32)',
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      margin: "0",
      height: "60px",
      width: "100%",
      position: 'absolute',
      top: '0'
    },
    [breakpoints.up('lg')]: {
      background: 'linear-gradient(#001C32, #001C32)',
      paddingRight: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      margin: "0",
      height: "40px",
      width: "100%",
      position: 'absolute',
      top: '0'
    }
  },
  content: {
    [breakpoints.up('xs')]: {
      background: 'linear-gradient(#FAFAFF, #FAFAFF)',
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      margin: "0",
      overflow: 'auto',
      width: "100%",
      position: 'absolute',
      bottom: '107px',
      top: '60px'
    },
    [breakpoints.up('lg')]: {
      background: 'linear-gradient(#FAFAFF, #FAFAFF)',
      paddingRight: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      margin: "0",
      overflow: 'auto',
      width: "100%",
      position: 'absolute',
      bottom: '80px',
      top: '40px'
    }
  },
  footer: {
    [breakpoints.up('xs')]: {
      background: 'linear-gradient(#001C32, #001C32)',
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingTop: theme.spacing(1),
      margin: "0",
      height: "107px",
      width: "100%",
      position: 'absolute',
      bottom: '0'
    },
    [breakpoints.up('lg')]: {
      background: 'linear-gradient(#001C32, #001C32)',
      paddingRight: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      paddingTop: theme.spacing(1),
      margin: "0",
      height: "80px",
      width: "100%",
      position: 'absolute',
      bottom: '0'
    }
  },
  details: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    margin: "0",
  },
  spinner: {
     position: 'relative',
     top: "50%",
     bottom: "50%"
  },
  orderModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderModalSub: {
    [breakpoints.up('xs')]: {
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.shadows[3],
      padding: theme.spacing(1),
      outline: "none",
      width: "50%"
    }
  },
  orderModalSubIcons: {
    textAlign: "center"
  },
  appIcon: {
    [breakpoints.up('xs')]: {
      height: "50px",
      width: '50px'
    }
  },
  downloadIcon: {
    [breakpoints.up('xs')]: {
      height: "25px",
      width: '20px'
    }
  },
  cancelIcon: {
    [breakpoints.up('xs')]: {
      height: "20px",
      width: '20px'
    }
  },
  confirmIcon: {
    [breakpoints.up('xs')]: {
      height: "20px",
      width: '25px'
    }
  },
  subHeaderIconParent: {
    [breakpoints.up('xs')]: {
      position: "relative",
      height: "100%"
    }
  },
  helpIcon: {
    [breakpoints.up('xs')]: {
      display: 'flex',
      justifyContent: 'flex-start',
      height: "40px",
      width: '40px'
    },
    [breakpoints.up('lg')]: {
      display: 'flex',
      justifyContent: 'flex-start',
      height: "26px",
      width: '26px'
    }
  },
  contactIcon: {
    [breakpoints.up('xs')]: {
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
      height: "40px",
      width: '40px'
    },
    [breakpoints.up('lg')]: {
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
      height: "26px",
      width: '26px'
    }
  },
  aboutIcon: {
    [breakpoints.up('xs')]: {
      display: 'flex',
      justifyContent: 'flex-end',
      height: "40px",
      width: '40px'
    },
    [breakpoints.up('lg')]: {
      display: 'flex',
      justifyContent: 'flex-end',
      height: "26px",
      width: '26px'
    }
  },
  userIcon: {
    [breakpoints.up('xs')]: {
      height: "35px",
      width: '35px'
    }
  },
  footerIcon: {
    [breakpoints.up('xs')]: {
      height: "45px",
      width: '45px'
    },
    [breakpoints.up('lg')]: {
      height: "30px",
      width: '30px'
    }
  },
  headerIcon: {
    [breakpoints.up('xs')]: {
      height: "15px",
      width: '120px'
    },
    [breakpoints.up('lg')]: {
      height: "10px",
      width: '80px'
    }
  },
  sortIcon: {
    [breakpoints.up('xs')]: {
      height: "25px",
      width: '25px'
    }
  },
  appNameIconContainer: {
    [breakpoints.up('xs')]: {
      position: "relative",
      top: "0",
      left: "0",
      height: "50px",
      width: '208px'
    }
  },
  appNameIcon: {
    [breakpoints.up('xs')]: {
      position: "absolute",
      bottom: "0",
      left: "0",
      height: "25px",
      width: '168px'
    }
  },
  linkIcon: {
    [breakpoints.up('xs')]: {
      margin: 'auto',
      height: "15px",
      width: '15px'
    },
    [breakpoints.up('md')]: {
      margin: 'auto',
      height: "30px",
      width: '30px'
    }
  },
  formSubmit: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    width: '100%'
  },
  formLabel: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  formError: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    color: 'red'
  },
  formButton: {
    paddingTop: theme.spacing(0.5)
  },
  oddRow: {
    backgroundColor: '#F5F3F2'
  },
  evenRow: {
    backgroundColor: '#FAFAFF'
  },
  activeLink: {
    lineHeight: "2",
    fontSize: "1.6em",
    fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
    color: '#001C32',
    textDecoration: 'none',
    '&:active': {
      textDecoration: 'none',
      fontWeight: 900
    },
    '&:hover': {
      textDecoration: 'none',
      color: '#a1c8ff'
    }
  },
  inactiveLink: {
    lineHeight: "2",
    fontSize: "1.6em",
    fontFamily: "\"Manrope\", \"Roboto\", \"Arial\", \"sans-serif\"",
    color: '#c7cdd7',
    textDecoration: 'none',
    '&:active': {
      textDecoration: 'none',
      fontWeight: 900
    },
    '&:hover': {
      textDecoration: 'none',
      color: '#a1c8ff'
    }
  },
  iconLink: {
    textDecoration: 'none',
  },
  link: {
    textDecoration: 'none'
  },
  hr: {
    height: "1px",
    width: "100%"
  },
  hrBlue: {
    backgroundColor: "#317aff",
    width: "100%"
  },
  hrGrey: {
    backgroundColor: "#C8C8D4",
    width: "100%"
  }
})

export { theme, themeStyles }
