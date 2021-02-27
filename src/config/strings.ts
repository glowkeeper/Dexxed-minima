class App {

  static readonly title = 'Minima'
  static readonly appName = 'Dexxed'
  static readonly catchLine = `Powered by ${App.title}`
  static readonly tagline = ''
  static readonly copyright = '© Copyright 2021 Minima GmbH'
  static readonly author = 'Minima'
  static readonly email = 'info@minima.global'
  static readonly bugEmail = 'minima-global@fire.fundersclub.com'
  static readonly version = '0.9.0'
  static readonly release = 'Testnet'
}

class Paths {

  static readonly home = 'Home'
  static readonly about = 'About'
  static readonly help = 'Help'
  static readonly contact = 'Contact'

  static readonly orders = 'My Orders'
  static readonly balances = 'My Balances'
  static readonly trades = 'My Trades'
  static readonly allTrades = 'All Trades'
  static readonly orderBook = 'Order Book'
  static readonly orderBookIndex = 'Order Book'
  static readonly recentTrades = 'Trades'
}

class GeneralError {

    static readonly required = "Required"
    static readonly number = "Must Be a Number"
}

class Transaction {

    static readonly pending = "Please wait - transaction is pending"
    static readonly success = "Added successfully"
    static readonly failure = 'Addition Failed'

    static readonly errorGettingData = "Error getting data"
}

class Home {

  static readonly heading = 'Home'
}

class About {

  static readonly heading = `About ${App.appName}`

  static readonly info = [`Version ${App.version}.`,`${App.catchLine}.`,`${App.release}.`,`Created by ${App.author}.`,`${App.copyright}.`]
}

class Help {

  static readonly heading = `${App.appName} Help`

  static readonly info = [`Coming soon.`]

  static readonly helpTip = 'Help'
  static readonly contactTip = 'Contact'
  static readonly aboutTip = 'About'
  static readonly sortTip = "Sort"

  static readonly ordersTip = 'My Orders'
  static readonly balancesTip = 'My Balances'
  static readonly tradesTip = 'My Trades'
  static readonly allTradesTip = 'All Trades'
  static readonly orderBookTip = 'Order Book'
  static readonly recentTradesTip = 'Recent Trades'

  static readonly orderTip = 'Place Order'
  static readonly buyTip = 'Buy Order'
  static readonly sellTip = 'Sell Order'
  static readonly placeBuyTip = 'Place a Buy Order'
  static readonly placeSellTip = 'Place a Sell Order'

  static readonly deleteSure = "Are you sure you want to delete"
}

class Contact {

  static readonly heading = 'Contact'

  static readonly info = [`To report a technical problem, please email a brief description of the issue to ${App.bugEmail}.`,`For all other enquires, please email ${App.author} at ${App.email}.`]
}

class Orders {

  static readonly heading = 'My Orders'
  static readonly allHeading = 'Order Book'

  static readonly statusLive = 'Live'
  static readonly statusOld = 'Too Old'
  static readonly statusWaiting = 'Waiting'

  static readonly type = 'Type'
  static readonly tokenName = 'Token'
  static readonly buy = 'Buy'
  static readonly buyColour = 'green'
  static readonly sell = 'Sell'
  static readonly sellColour = 'red'
  static readonly token = 'Token'
  static readonly amount = 'Amount'
  static readonly price = 'Price'
  static readonly total = 'Total'
}

class Balances {

  static readonly heading = 'My Balances'

  static readonly token = 'Token'
  static readonly amount = 'Amount Confirmed'
}

class Trades {

  static readonly heading = 'My Trades'
  static readonly allTradesHeading = 'All Trades'

  static readonly type = 'Type'
  static readonly tokenName = 'Token'
  static readonly buy = 'Buy'
  static readonly buyColour = 'green'
  static readonly sell = 'Sell'
  static readonly sellColour = 'red'
  static readonly token = 'Token'
  static readonly amount = 'Amount'
  static readonly price = 'Price'
  static readonly total = 'Total'
  static readonly block = 'Block'
}

class OrderBook {

  static readonly orderHeading = 'Order Book'
  static readonly tradesHeading = 'Order Book'

  static readonly amount = 'Amount'
  static readonly price = 'Price'
  static readonly buy = 'Buy'
  static readonly buyColour = 'green'
  static readonly liveColour = '#000000'
  static readonly disabledColour = '#C8C8D4'
  static readonly sell = 'Sell'
  static readonly sellColour = 'red'


  static readonly orderBookButton = 'Order Book'
  static readonly recentTradesButton = 'Recent Trades'
  static readonly buyButton = 'Buy'
  static readonly sellButton = 'Sell'
  static readonly orderButton = 'Place Order'

  static readonly validAmount = 'Please Input a Valid Amount'
  static readonly validPrice = 'Please Input a Valid Price'
}

class RecentTrades {

  static readonly heading = 'Recent Trades'
}

class AllTrades {

  static readonly heading = 'All Trades'
}

export { App,
         Paths,
         GeneralError,
         Transaction,
         Home,
         About,
         Help,
         Contact,
         Orders,
         Balances,
         Trades,
         OrderBook,
         RecentTrades,
         AllTrades
       }
