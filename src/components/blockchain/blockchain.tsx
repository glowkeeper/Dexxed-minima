import React from 'react'
import { connect } from 'react-redux'

import { init } from '../../store/app/blockchain/actions'

import { ApplicationState, AppDispatch } from '../../store/types'

interface ChainInitDispatchProps {
    init: () => void
}

const defaultProps: ChainInitDispatchProps = {
    init: () => {}
}

const chainSet = ( props: ChainInitDispatchProps = defaultProps ) => {

    props.init()

    return null
 }

 const mapDispatchToProps = (dispatch: AppDispatch): ChainInitDispatchProps => {
   return {
     init: () => dispatch(init())
   }
 }

 export const ChainInit = connect<{}, ChainInitDispatchProps, {}, ApplicationState>(
   null,
   mapDispatchToProps
 )(chainSet)
