import React from 'react'
import { connect } from 'react-redux'

import { initBlockchain, initDexxed, getTokens } from '../../store/app/blockchain/actions'

import { ApplicationState, AppDispatch } from '../../store/types'

interface ChainInitDispatchProps {
    initBlockchain: () => void
    initDexxed: () => void
    getTokens: () => void
}

const defaultProps: ChainInitDispatchProps = {
    initBlockchain: () => {},
    initDexxed: () => {},
    getTokens: () => {}
}

const chainSet = ( props: ChainInitDispatchProps = defaultProps ) => {

    props.initBlockchain()
    props.initDexxed()
    props.getTokens()

    return null
 }

 const mapDispatchToProps = (dispatch: AppDispatch): ChainInitDispatchProps => {
   return {
     initBlockchain: () => dispatch(initBlockchain()),
     initDexxed: () => dispatch(initDexxed()),
     getTokens: () => dispatch(getTokens())
   }
 }

 export const ChainInit = connect<{}, ChainInitDispatchProps, {}, ApplicationState>(
   null,
   mapDispatchToProps
 )(chainSet)
