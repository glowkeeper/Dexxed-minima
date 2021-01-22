import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { InfoTypes } from '../store/types'

import { Home, Info, Orders, Balances, Trades, AllTrades, OrderBook } from '../components/pages'

import { Paths, Local } from '../config'

export const Content = () => {

    return (

      <Switch>

        <Route name={Paths.help} exact path={Local.help} render={() => <Info type={InfoTypes.HELP}/>} />
        <Route name={Paths.contact} exact path={Local.contact} render={() => <Info type={InfoTypes.CONTACT}/>} />
        <Route name={Paths.about} exact path={Local.about} render={() => <Info type={InfoTypes.ABOUT}/>} />

        <Route name={Paths.orders} exact path={Local.orders} render= {() => <Orders />} />
        <Route name={Paths.trades} exact path={Local.trades} render= {() => <Trades />} />
        <Route name={Paths.allTrades} exact path={Local.allTrades} render= {() => <AllTrades />} />

        <Route name={Paths.orderBookIndex} exact path={Local.orderBookIndex} render= {() => <OrderBook />} />
        <Route name={Paths.recentTrades} exact path={Local.recentTrades} render= {() => <AllTrades />} />

        <Route name={Paths.balances} path={Local.balances} render= {() => <Balances />} />

      </Switch>
    )
}
