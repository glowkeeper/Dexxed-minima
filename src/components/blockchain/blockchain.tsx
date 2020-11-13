import React from 'react'
import { connect } from 'react-redux'

import { initBlockchain, initDexxed } from '../../store/app/blockchain/actions'

import { ApplicationState, AppDispatch } from '../../store/types'

interface ChainInitDispatchProps {
    initBlockchain: () => void
    initDexxed: () => void
}

const defaultProps: ChainInitDispatchProps = {
    initBlockchain: () => {},
    initDexxed: () => {}
}

const chainSet = ( props: ChainInitDispatchProps = defaultProps ) => {

    props.initBlockchain()
    props.initDexxed()
    return null
 }

 const mapDispatchToProps = (dispatch: AppDispatch): ChainInitDispatchProps => {
   return {
     initBlockchain: () => dispatch(initBlockchain()),
     initDexxed: () => dispatch(initDexxed()),
   }
 }

 export const ChainInit = connect<{}, ChainInitDispatchProps, {}, ApplicationState>(
   null,
   mapDispatchToProps
 )(chainSet)
