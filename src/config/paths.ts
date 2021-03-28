class Local {

  static readonly home = '/'
  static readonly about = '/about'
  static readonly help = '/help'
  static readonly contact = '/contact'

  static readonly orders = '/orders'
  static readonly balances = '/balance'
  static readonly trades = '/trades'
  static readonly allTrades = '/all-trades'
  static readonly orderBook = '/order-book'

  static readonly orderBookIndex = `${Local.orderBook}/:token`
  static readonly recentTrades = `${Local.allTrades}/:token`
}

class Remote {

    static readonly secure = 'https://'
    static readonly insecure = 'http://'
}

export { Local, Remote }
