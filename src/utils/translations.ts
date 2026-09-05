export type LanguageCode =
  | 'en'
  | 'zh-CN'
  | 'es'
  | 'fr'
  | 'de'
  | 'ja'
  | 'ko'
  | 'ru'
  | 'pt'
  | 'ar'
  | string;

export interface TranslationDict {
  // App Title & Header
  appTitle: string;
  appSubtitle: string;
  searchPlaceholder: string;
  marketOpen: string;
  marketClosed: string;
  preMarket: string;
  afterHours: string;
  paperWallet: string;
  riskLevel: string;
  riskLow: string;
  riskMedium: string;
  riskHigh: string;

  // Prediction Card
  corePrediction: string;
  probRising: string;
  probDipping: string;
  chanceOfRising: string;
  chanceOfDipping: string;
  targetTomorrow: string;
  estimatedWindow: string;
  positionSizeHint: string;
  bullish: string;
  bearish: string;
  neutral: string;
  testPrediction1000: string;
  testCustomTrade: string;

  // Technical Checklist
  technicalChecklist: string;
  technicalMathExplanation: string;
  ma10Crossover: string;
  rsiMomentum: string;
  volumeSurge: string;
  volatilityProfile: string;
  range52wTitle: string;
  viewAuto: string;
  viewRise: string;
  viewDip: string;
  autoTooltip: string;
  riseViewTooltip: string;
  dipViewTooltip: string;
  leanUpward: string;
  leanDownward: string;
  modeAutoToast: string;
  modeRiseToast: string;
  modeDipToast: string;
  ma10Expl: string;
  sma50Expl: string;
  rsiExpl: string;
  volumeExpl: string;
  volProfileExpl: string;
  range52wExpl: string;
  contributionTooltip: string;
  neutralTooltip: string;
  techMetricsTitle: string;
  techMetricsHint: string;
  lblMa10: string;
  lblSma50: string;
  lblRsi14: string;
  lblVolRatio: string;
  lblAtr14: string;
  lblDailyVol: string;
  lblAnnVol: string;
  momentumShort: string;
  momRising: string;
  momFading: string;
  momFlat: string;
  mom5Expl: string;
  formulaDetails: string;
  detected: string;
  notDetected: string;
  oversold: string;
  overbought: string;
  momentumPositive: string;
  momentumNegative: string;
  aboveMA10: string;
  belowMA10: string;
  sma50Trend: string;
  aboveSMA50: string;
  belowSMA50: string;
  modelDisclaimer: string;
  highVolume: string;
  lowVolume: string;

  // Chart & Timeframes
  livePriceGraph: string;
  timeframe1D: string;
  timeframe5D: string;
  timeframe1M: string;
  timeframe6M: string;
  timeframeYTD: string;
  timeframe1Y: string;
  timeframe5Y: string;
  timeframeALL: string;
  volume: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  closePrice: string;

  // AI Confidence & Backtesting
  modelDisclaimerNote: string;
  past30Days: string;
  backtestLog: string;
  day: string;
  predicted: string;
  actual: string;
  result: string;
  hit: string;
  miss: string;

  // Watchlist Sidebar
  watchlist: string;
  searchAddStock: string;
  noStocksInWatchlist: string;
  addStockToWatchlist: string;
  removeFromWatchlist: string;
  popularStocks: string;
  usStocks: string;
  chineseStocks: string;
  myListTab: string;
  tickersCount: string;
  browseTickers: string;
  rankingsTitle: string;
  rankingsSubtitle: string;
  scoringWatchlist: string;
  rankingsNeedsTwo: string;
  colTicker: string;
  colCompositeScore: string;
  colTechZ: string;
  colFundZ: string;
  colOptZ: string;
  rankActive: string;
  rankingsMethodology: string;
  fundamentalsTitle: string;
  fundamentalsUnavailable: string;
  sectionValuation: string;
  sectionProfitability: string;
  sectionGrowth: string;
  sectionHealth: string;
  sectionTargets: string;
  analystsWord: string;
  toMeanTarget: string;
  fundamentalsSourceNote: string;

  // Ownership & Insiders Panel (Yahoo data)
  ownershipTitle: string;
  ownershipUnavailable: string;
  institutionOwnership: string;
  institutionsWord: string;
  insidersWord: string;
  floatWord: string;
  sectionInstitutions: string;
  colInstitution: string;
  colShares: string;
  colPercent: string;
  colChangeQtr: string;
  noInstitutionData: string;
  sectionInsiders: string;
  insiderBuys: string;
  insiderSells: string;
  insiderBought: string;
  insiderSold: string;
  insiderNet: string;
  insiderHeld: string;
  noInsiderData: string;
  ownershipSourceNote: string;

  // Volume Profile overlay
  volumeProfile: string;
  stockNumber: string;

  // News Section
  marketNews: string;
  newsForTicker: string;
  removeAllNews: string;
  addCustomNews: string;
  generateNews: string;
  deleteNews: string;
  noNewsAvailable: string;
  sentimentImpact: string;
  confirmDeleteTitle: string;
  confirmDeleteMessage: string;
  confirmRemoveAllTitle: string;
  confirmRemoveAllMessage: string;
  cancel: string;
  yesDelete: string;
  yesRemoveAll: string;
  areYouSure: string;

  // Paper Trading Engine
  paperTradingPortfolio: string;
  activePositions: string;
  tradeHistory: string;
  buyLong: string;
  sellShort: string;
  shares: string;
  amountToInvest: string;
  entryPrice: string;
  currentValue: string;
  unrealizedPnL: string;
  realizedPnL: string;
  totalBalance: string;
  availableCash: string;
  whatWillHappen: string;
  estimatedReturn: string;
  maxStopLoss: string;
  executeTrade: string;
  closePosition: string;
  noActivePositions: string;
  editPosition: string;
  saveChanges: string;
  resetWallet: string;
  walletDeposit: string;

  // Settings
  settings: string;
  language: string;
  addLanguage: string;
  enterLanguageName: string;
  enterLanguageCode: string;
  addLanguageButton: string;
  customLanguages: string;
  currency: string;
  searchCurrency: string;
  noCurrencyResult: string;
  displayMode: string;
  displayModeAuto: string;
  displayModeRiseOnly: string;
  displayModeDipOnly: string;
  themeCyberDark: string;
  systemPreferences: string;
  close: string;
}

export const BUILT_IN_LANGUAGES: Record<string, { name: string; flag: string; translations: TranslationDict }> = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    translations: {
      appTitle: 'STOCK PREDICTOR AI',
      appSubtitle: 'Neural Mathematical Indicator Suite & Quantitative Forecasting',
      searchPlaceholder: 'Search ticker (e.g. NVDA, AAPL, 002230, 600276)...',
      marketOpen: 'MARKET OPEN',
      marketClosed: 'MARKET CLOSED',
      preMarket: 'PRE-MARKET',
      afterHours: 'AFTER-HOURS',
      paperWallet: 'Paper Wallet',
      riskLevel: 'Risk Level',
      riskLow: 'Low Risk',
      riskMedium: 'Medium Risk',
      riskHigh: 'High Risk',

      corePrediction: 'CORE PREDICTION MATRIX',
      probRising: 'Probability of Rising Tomorrow',
      probDipping: 'Probability of Dipping Tomorrow',
      chanceOfRising: 'CHANCE OF RISING',
      chanceOfDipping: 'CHANCE OF DIPPING',
      targetTomorrow: 'Target Tomorrow',
      estimatedWindow: 'Expected Daily Range (ATR-14)',
  positionSizeHint: 'Suggested Size',
      bullish: 'Bullish',
      bearish: 'Bearish',
      neutral: 'Neutral',
      testPrediction1000: 'Test Prediction with $1,000',
      testCustomTrade: 'Custom Paper Trade',

      technicalChecklist: 'TECHNICAL INDICATOR CHECKLIST',
      technicalMathExplanation: 'Mathematical Algorithm Drivers',
      ma10Crossover: '9 EMA Short-Term Trend',
      rsiMomentum: '14-Day RSI Oscillator',
      volumeSurge: 'Volume Relative Surge',
      volatilityProfile: 'Volatility Profile',
  range52wTitle: 'Price in 52W Range',
  viewAuto: 'Auto',
  viewRise: 'Rise View',
  viewDip: 'Dip View',
  autoTooltip: 'Auto: shows the prevailing higher probability',
  riseViewTooltip: 'Rise View: always show rise chance and targets',
  dipViewTooltip: 'Dip View: always show dip probability and targets',
  leanUpward: 'Technical factors currently lean toward upward momentum for the next session.',
  leanDownward: 'Technical factors currently lean toward downward pressure for the next session.',
  modeAutoToast: 'Display mode: Auto (Prevailing)',
  modeRiseToast: 'Display mode: Rise View',
  modeDipToast: 'Display mode: Dip View',
  ma10Expl: 'Compares the price with its 9-period Exponential Moving Average. Above it points to short-term upward momentum; below it, short-term weakness.',
  sma50Expl: 'Compares the price with its 50-day average — the medium-term trend institutional traders watch. Holding above keeps the broader uptrend intact.',
  rsiExpl: 'Rates recent buying vs selling pressure from 0 to 100. Extreme highs (>70) raise pullback risk; extreme lows (<30) hint at a possible bounce.',
  volumeExpl: 'Compares session volume against the 10-day average. Heavy volume on an up day confirms real buying interest; on a down day it signals selling pressure.',
  volProfileExpl: 'How much this stock typically moves in a day (ATR-14), plus daily and annualized volatility. Context only — it does not change the prediction.',
  range52wExpl: 'Where the price sits inside its 52-week high-low range. Near the top signals sustained strength; near the bottom, prolonged weakness.',
  contributionTooltip: 'Points this factor contributes toward the rise/dip probability. Bigger number = stronger influence on the result.',
  neutralTooltip: 'Context metric — shown for information only and does not affect the score.',
  techMetricsTitle: 'Technical Metrics',
  techMetricsHint: 'Hover any metric for its meaning',
  lblMa10: '9 EMA',
  lblSma50: 'SMA50',
  lblRsi14: 'RSI (14)',
  lblVolRatio: 'Volume vs 10D Avg',
  lblAtr14: 'ATR (14D)',
  lblDailyVol: 'Daily Volatility σd',
  lblAnnVol: 'Annualized Volatility σy',
  momentumShort: '5-Day Momentum',
  momRising: 'Pushing higher this week',
  momFading: 'Drifting lower this week',
  momFlat: 'Flat over the week',
  mom5Expl: 'Price change over the last five trading days. Short-term momentum often persists, but sharp runs can also fade — capped at ±5 points.',
      formulaDetails: 'Formula & Weight',
      detected: 'Active',
      notDetected: 'Inactive',
      oversold: 'Oversold (<30)',
      overbought: 'Overbought (>70)',
      momentumPositive: 'Momentum Positive',
      momentumNegative: 'Momentum Negative',
      aboveMA10: 'Price above 9 EMA',
      belowMA10: 'Price below 9 EMA',
      sma50Trend: '50-Day Moving Average',
      aboveSMA50: 'Price above 50-day MA',
      belowSMA50: 'Price below 50-day MA',
      modelDisclaimer: 'Heuristic technical score — not a calibrated probability.',
      highVolume: 'Volume surge vs 10-day average',
      lowVolume: 'No unusual volume',

      livePriceGraph: 'LIVE PRICE GRAPH & MOVEMENT',
      timeframe1D: '1D',
      timeframe5D: '5D',
      timeframe1M: '1M',
      timeframe6M: '6M',
      timeframeYTD: 'YTD',
      timeframe1Y: '1Y',
      timeframe5Y: '5Y',
      timeframeALL: 'ALL',
      volume: 'Volume',
  volumeProfile: 'Volume Profile',
      openPrice: 'Open',
      highPrice: 'High',
      lowPrice: 'Low',
      closePrice: 'Close',

  modelDisclaimerNote: 'Signal-agreement gauge of the technical model. Not a track record, guarantee, or calibrated probability.',
      past30Days: 'Past 30 Days',
      backtestLog: 'Historical Daily Verifications',
      day: 'Day',
      predicted: 'Predicted',
      actual: 'Actual',
      result: 'Result',
      hit: 'HIT',
      miss: 'MISS',

      watchlist: 'WATCHLIST & TICKERS',
      searchAddStock: 'Add ticker / symbol',
      noStocksInWatchlist: 'No stocks in watchlist. Search or pick below to add!',
      addStockToWatchlist: 'Add to Watchlist',
      removeFromWatchlist: 'Remove',
      popularStocks: 'Popular Tickers',
      usStocks: 'US Equities',
      chineseStocks: 'China A-Shares (A股)',
  myListTab: 'My List',
  tickersCount: 'Tickers',
  browseTickers: 'Browse Tickers',
  rankingsTitle: 'Watchlist Ranking',
  rankingsSubtitle: 'Cross-sectional z-score composite • technical / fundamental / options',
  scoringWatchlist: 'Scoring watchlist…',
  rankingsNeedsTwo: 'Add at least two stocks to the watchlist to compute rankings.',
  colTicker: 'Ticker',
  colCompositeScore: 'Composite Score',
  colTechZ: 'Tech z',
  colFundZ: 'Fund z',
  colOptZ: 'Opt z',
  rankActive: 'active',
  rankingsMethodology:
    'Each metric is standardized into a cross-sectional z-score across your current watchlist (mean 0, σ 1), sign-adjusted so higher always means stronger, then combined: technical 45% (3M momentum excluding the recent month, full 3M momentum, price vs SMA50, 52W-high distance, volume trend), fundamental 35% (revenue/earnings growth, profit margin, ROE, debt-to-equity), options 20% (put/call open-interest skew). Missing categories are excluded with weights renormalized — nothing imputed. Z-scores are relative to this list only, not the market.',
  fundamentalsTitle: 'Company Fundamentals',
  fundamentalsUnavailable:
    'Fundamental data is not available for this ticker right now. It may be an unsupported instrument type, or the data source could be temporarily unreachable.',
  sectionValuation: 'Valuation',
  sectionProfitability: 'Profitability',
  sectionGrowth: 'Growth',
  sectionHealth: 'Financial Health',
  sectionTargets: 'Price Targets',
  analystsWord: 'analysts',
  toMeanTarget: 'to mean target',
  fundamentalsSourceNote:
    'Source: Yahoo Finance quoteSummary • cached ~30 min • for reference only, not investment advice.',
  ownershipTitle: 'Ownership & Insiders',
  ownershipUnavailable:
    'Ownership data is not available for this ticker right now. It may be a listing without Yahoo coverage, or the data source is temporarily unreachable.',
  institutionOwnership: 'Institutional Ownership',
  institutionsWord: 'Institutions',
  insidersWord: 'Insiders',
  floatWord: 'Inst. Float',
  sectionInstitutions: 'Top Institutional Holders (13F)',
  colInstitution: 'Institution',
  colShares: 'Shares',
  colPercent: '% Out',
  colChangeQtr: 'Δ Qtr',
  noInstitutionData: 'No institutional holder data reported for this ticker.',
  sectionInsiders: 'Insider Activity (~6M)',
  insiderBuys: 'buys',
  insiderSells: 'sells',
  insiderBought: 'Bought',
  insiderSold: 'Sold',
  insiderNet: 'Net Δ',
  insiderHeld: 'Total Held',
  noInsiderData: 'No recent insider transactions reported.',
  ownershipSourceNote:
    'Source: Yahoo Finance ownership modules • cached ~1 h • for reference only.',
      stockNumber: 'Stock Code',

      marketNews: 'LIVE MARKET INTELLIGENCE & SENTIMENT',
      newsForTicker: 'News Impact for',
      removeAllNews: 'Remove All News',
      addCustomNews: 'Add Custom Headline',
      generateNews: 'Generate Fresh News',
      deleteNews: 'Delete News',
      noNewsAvailable: 'No news available. Click "Generate Fresh News" to fetch feeds.',
      sentimentImpact: 'Prediction Sentiment Weight',
      confirmDeleteTitle: 'Delete News Item',
      confirmDeleteMessage: 'Are you sure you want to delete this news article? This will remove its sentiment factor from the algorithm.',
      confirmRemoveAllTitle: 'Remove All News',
      confirmRemoveAllMessage: 'Are you sure you want to delete ALL news articles for this ticker? Sentiment weight will be reset to neutral.',
      cancel: 'Cancel',
      yesDelete: 'Yes, Delete',
      yesRemoveAll: 'Yes, Remove All',
      areYouSure: 'Are you sure?',

      paperTradingPortfolio: 'SIMULATED PAPER TRADING ENGINE',
      activePositions: 'Active Positions',
      tradeHistory: 'Trade History',
      buyLong: 'Buy / Long',
      sellShort: 'Sell / Short',
      shares: 'Shares',
      amountToInvest: 'Amount to Invest',
      entryPrice: 'Entry Price',
      currentValue: 'Current Value',
      unrealizedPnL: 'Unrealized P&L',
      realizedPnL: 'Realized P&L',
      totalBalance: 'Total Balance',
      availableCash: 'Available Cash',
      whatWillHappen: 'Simulation Preview: What Will Happen',
      estimatedReturn: 'Projected Target Profit',
      maxStopLoss: 'Suggested Stop Loss',
      executeTrade: 'Execute Paper Order',
      closePosition: 'Close Trade',
      noActivePositions: 'No active paper trades. Test the prediction above to open one!',
      editPosition: 'Edit Position',
      saveChanges: 'Save Changes',
      resetWallet: 'Reset Wallet to $10,000',
      walletDeposit: 'Deposit Cash',

      settings: 'SYSTEM SETTINGS',
      language: 'Interface Language',
      addLanguage: 'Add Custom Language',
      enterLanguageName: 'Language Name (e.g. Esperanto)',
      enterLanguageCode: 'Code (e.g. eo)',
      addLanguageButton: 'Add & Switch Language',
      customLanguages: 'Custom Languages',
      currency: 'Display Currency',
      searchCurrency: 'Search currency (e.g. USD, CNY, EUR, JPY)...',
      noCurrencyResult: 'No result found for currency',
      displayMode: 'Prediction Display Format',
      displayModeAuto: 'Auto Dynamic (Highest Direction)',
      displayModeRiseOnly: 'Always Show Probability of Rise',
      displayModeDipOnly: 'Always Show Probability of Dip',
      themeCyberDark: 'Theme: Cyber Terminal Dark (#0a0f1d)',
      systemPreferences: 'Preferences & Quantitative Parameters',
      close: 'Close',
    },
  },
  'zh-CN': {
    name: '简体中文 (Chinese)',
    flag: '🇨🇳',
    translations: {
      appTitle: 'AI 股票预测与量化分析仪',
      appSubtitle: '数学技术指标算法模型与次日涨跌概率预测系统',
      searchPlaceholder: '搜索美股代码或中国A股数字 (如 NVDA, AAPL, 002230, 600276)...',
      marketOpen: '市场交易中',
      marketClosed: '已休市',
      preMarket: '盘前交易',
      afterHours: '盘后交易',
      paperWallet: '模拟账户钱包',
      riskLevel: '风险偏好',
      riskLow: '低风险',
      riskMedium: '中等风险',
      riskHigh: '高风险',

      corePrediction: '核心预测矩阵面板',
      probRising: '明日上涨概率',
      probDipping: '明日下跌概率',
      chanceOfRising: '明日上涨概率',
      chanceOfDipping: '明日下跌概率',
      targetTomorrow: '明日目标价',
      estimatedWindow: '预期日内波幅 (ATR-14)',
  positionSizeHint: '建议仓位',
      bullish: '看涨',
      bearish: '看跌',
      neutral: '中性',
      testPrediction1000: '以 $1,000 模拟验证预测',
      testCustomTrade: '自定义模拟交易',

      technicalChecklist: '技术指标量化清单',
      technicalMathExplanation: '算法核心数学驱动因素',
      ma10Crossover: '9日指数均线趋势',
      rsiMomentum: '14日 RSI 动量指标',
      volumeSurge: '成交量异动放量比',
      volatilityProfile: '波动率概况',
  range52wTitle: '52周区间位置',
  viewAuto: '自动',
  viewRise: '看涨视图',
  viewDip: '看跌视图',
  autoTooltip: '自动：显示当前占优的更高概率',
  riseViewTooltip: '看涨视图：始终显示上涨概率与目标价',
  dipViewTooltip: '看跌视图：始终显示下跌概率与目标价',
  leanUpward: '技术面因素目前倾向于下一交易日的上行动能。',
  leanDownward: '技术面因素目前倾向于下一交易日的下行压力。',
  modeAutoToast: '显示模式：自动（跟随优势概率）',
  modeRiseToast: '显示模式：看涨视图',
  modeDipToast: '显示模式：看跌视图',
  ma10Expl: '比较当前价格与9周期指数移动平均线。高于均线代表短线动能向上，低于则代表短线走弱。',
  sma50Expl: '比较价格与50日均线——机构常看的中期趋势线。站稳其上说明中期升势完好。',
  rsiExpl: '用0到100衡量近期买卖力量。过高（>70）有回调风险，过低（<30）或存在反弹机会。',
  volumeExpl: '将当日成交量与10日均值对比。放量上涨确认买盘真实，放量下跌则提示抛压沉重。',
  volProfileExpl: '展示该股单日典型波动幅度（ATR-14）及日度与年化波动率。仅供参考，不影响预测得分。',
  range52wExpl: '标示当前股价处于52周高低区间中的位置。靠近高点代表持续强势，靠近低点代表长期疲弱。',
  contributionTooltip: '该因子对涨跌概率的贡献点数，数值越大对结果影响越强。',
  neutralTooltip: '背景参考指标——仅作信息展示，不影响得分。',
  techMetricsTitle: '技术指标数据',
  techMetricsHint: '悬停任意指标查看含义',
  lblMa10: '9 EMA',
  lblSma50: 'SMA50 均线',
  lblRsi14: 'RSI（14日）',
  lblVolRatio: '成交量 vs 10日均量',
  lblAtr14: 'ATR（14日）',
  lblDailyVol: '日波动率 σd',
  lblAnnVol: '年化波动率 σy',
  momentumShort: '5日动量',
  momRising: '本周持续走高',
  momFading: '本周走弱回落',
  momFlat: '本周横盘整理',
  mom5Expl: '衡量最近五个交易日的价格变化。短期动能往往延续，但急涨后也可能回吐（上限±5分）。',
      formulaDetails: '公式与权重贡献',
      detected: '已触发',
      notDetected: '未触发',
      oversold: '超卖区间 (<30)',
      overbought: '超买区间 (>70)',
      momentumPositive: '动能转强',
      momentumNegative: '动能转弱',
      aboveMA10: '股价高于9 EMA',
      belowMA10: '股价低于9 EMA',
      sma50Trend: '50日均线趋势',
      aboveSMA50: '股价高于50日均线',
      belowSMA50: '股价低于50日均线',
      modelDisclaimer: '启发式技术评分，并非校准后的概率。',
      highVolume: '成交量显著高于10日均值',
      lowVolume: '成交量无异动',

      livePriceGraph: '实时行情走势与技术走势图',
      timeframe1D: '1天',
      timeframe5D: '5天',
      timeframe1M: '1月',
      timeframe6M: '半年',
      timeframeYTD: '今年以来',
      timeframe1Y: '1年',
      timeframe5Y: '5年',
      timeframeALL: '全部',
      volume: '成交量',
  volumeProfile: '成交量分布图',
      openPrice: '开盘',
      highPrice: '最高',
      lowPrice: '最低',
      closePrice: '收盘',

  modelDisclaimerNote: '技术模型信号一致性指标，非历史业绩、保证或校准概率。',
      past30Days: '过去30天',
      backtestLog: '历史每日验证记录',
      day: '日期',
      predicted: '预测方向',
      actual: '实际涨跌',
      result: '验证结果',
      hit: '命中',
      miss: '失误',

      watchlist: '自选股票列表',
      searchAddStock: '搜索添加股票代码',
      noStocksInWatchlist: '自选股暂无股票，请在下方点击添加或直接搜索！',
      addStockToWatchlist: '加入自选',
      removeFromWatchlist: '删除',
      popularStocks: '热门标的',
      usStocks: '美股精选',
      chineseStocks: '中国A股精选',
  myListTab: '我的列表',
  tickersCount: '只股票',
  browseTickers: '浏览热门股',
  rankingsTitle: '自选股排名',
  rankingsSubtitle: '横截面Z分数综合评分 • 技术 / 基本面 / 期权',
  scoringWatchlist: '正在为自选列表评分…',
  rankingsNeedsTwo: '请至少添加两只股票以计算排名。',
  colTicker: '代码',
  colCompositeScore: '综合评分',
  colTechZ: '技术z',
  colFundZ: '基本面z',
  colOptZ: '期权z',
  rankActive: '当前',
  rankingsMethodology:
    '每项指标都会在当前自选列表内做横截面标准化（均值0，σ1），统一调整方向使数值越大越强后加权合成：技术45%（剔除近1月的3M动量、完整3M动量、价格vs SMA50、距52周高点、成交量趋势）、基本面35%（营收/盈利增长、利润率、ROE、资产负债率）、期权20%（看跌/看涨未平仓合约偏斜）。缺失类别将被剔除并重新归一化权重——不做任何填补。Z分数仅相对于本列表，而非整个市场。',
  fundamentalsTitle: '公司基本面',
  fundamentalsUnavailable:
    '该代码的基本面数据暂时不可用。可能是不支持的证券类型，或数据源暂时无法访问。',
  sectionValuation: '估值',
  sectionProfitability: '盈利能力',
  sectionGrowth: '成长性',
  sectionHealth: '财务健康',
  sectionTargets: '分析师目标价',
  analystsWord: '位分析师',
  toMeanTarget: '至平均目标价',
  fundamentalsSourceNote:
    '数据来源：Yahoo Finance quoteSummary • 缓存约30分钟 • 仅供参考，不构成投资建议。',
  ownershipTitle: '持股与内部人',
  ownershipUnavailable:
    '暂时无法获取该代码的持股数据。可能是 Yahoo 未覆盖该证券，或数据源暂时不可用。',
  institutionOwnership: '机构持股比例',
  institutionsWord: '家机构',
  insidersWord: '内部人',
  floatWord: '占流通盘',
  sectionInstitutions: '主要机构持仓 (13F)',
  colInstitution: '机构名称',
  colShares: '持股数',
  colPercent: '占比',
  colChangeQtr: '季度变动',
  noInstitutionData: '暂无该代码的机构持仓数据。',
  sectionInsiders: '内部人交易（约6个月）',
  insiderBuys: '笔买入',
  insiderSells: '笔卖出',
  insiderBought: '买入',
  insiderSold: '卖出',
  insiderNet: '净变动',
  insiderHeld: '内部人持股',
  noInsiderData: '近期无内部人交易记录。',
  ownershipSourceNote: '数据来源：Yahoo Finance 持股模块 • 缓存约1小时 • 仅供参考。',
      stockNumber: '股票代码',

      marketNews: '实时市场情报与个股新闻',
      newsForTicker: '当前标的情绪新闻：',
      removeAllNews: '清空全部新闻',
      addCustomNews: '添加自定义新闻',
      generateNews: '生成最新市场动态',
      deleteNews: '删除单条新闻',
      noNewsAvailable: '暂无新闻数据，点击右上角“生成最新市场动态”获取。',
      sentimentImpact: '新闻情绪预测权重',
      confirmDeleteTitle: '删除单条新闻确认',
      confirmDeleteMessage: '确定要删除这条新闻吗？该新闻的情绪权重将从计算模型中移除。',
      confirmRemoveAllTitle: '清空所有新闻确认',
      confirmRemoveAllMessage: '确定要清空该股票的所有新闻吗？新闻情绪权重将重置为中性。',
      cancel: '取消',
      yesDelete: '确定删除',
      yesRemoveAll: '确定清空全部',
      areYouSure: '您确定要继续吗？',

      paperTradingPortfolio: '模拟操盘与持仓管理系统',
      activePositions: '当前模拟持仓',
      tradeHistory: '历史交易流水',
      buyLong: '买入做多',
      sellShort: '融券做空',
      shares: '股数',
      amountToInvest: '投资金额',
      entryPrice: '买入成本价',
      currentValue: '当前市值',
      unrealizedPnL: '浮动盈亏',
      realizedPnL: '已实现盈亏',
      totalBalance: '总资产净值',
      availableCash: '可用虚拟现金',
      whatWillHappen: '模拟预期推演：接下来会发生什么',
      estimatedReturn: '预计目标收益',
      maxStopLoss: '建议止损防线',
      executeTrade: '立即下单模拟交易',
      closePosition: '平仓了结',
      noActivePositions: '暂无持仓，点击上方“以 $1,000 模拟验证预测”快速开仓！',
      editPosition: '编辑持仓参数',
      saveChanges: '保存更改',
      resetWallet: '重置模拟资金为 $10,000',
      walletDeposit: '充值虚拟资金',

      settings: '系统与参数设置',
      language: '界面语言切换',
      addLanguage: '添加自定义语言',
      enterLanguageName: '语言名称 (例如 粤语 / 繁体中文)',
      enterLanguageCode: '语言代码 (例如 yue / zh-HK)',
      addLanguageButton: '添加并切换语言',
      customLanguages: '自定义语言库',
      currency: '货币单位换算',
      searchCurrency: '搜索货币 (例如 USD, CNY, EUR, JPY, HKD)...',
      noCurrencyResult: '未找到该货币',
      displayMode: '预测展示模式',
      displayModeAuto: '动态自适应 (展示概率最高方向)',
      displayModeRiseOnly: '固定展示上涨概率 (Chance of Rise)',
      displayModeDipOnly: '固定展示下跌概率 (Chance of Dip)',
      themeCyberDark: '主题：赛博金融深黑 (#0a0f1d)',
      systemPreferences: '量化模型与偏好参数',
      close: '关闭设置',
    },
  },
  es: {
    name: 'Español (Spanish)',
    flag: '🇪🇸',
    translations: {
      appTitle: 'PREDICTOR DE ACCIONES IA',
      appSubtitle: 'Suite de Indicadores Cuantitativos y Pronóstico Matemático',
      searchPlaceholder: 'Buscar ticker (ej. NVDA, AAPL, 002230, 600276)...',
      marketOpen: 'MERCADO ABIERTO',
      marketClosed: 'MERCADO CERRADO',
      preMarket: 'PRE-MERCADO',
      afterHours: 'POST-CIERRE',
      paperWallet: 'Billetera Virtual',
      riskLevel: 'Nivel de Riesgo',
      riskLow: 'Riesgo Bajo',
      riskMedium: 'Riesgo Medio',
      riskHigh: 'Riesgo Alto',

      corePrediction: 'MATRIZ DE PREDICCIÓN PRINCIPAL',
      probRising: 'Probabilidad de Subida Mañana',
      probDipping: 'Probabilidad de Caída Mañana',
      chanceOfRising: 'PROBABILIDAD DE SUBIDA',
      chanceOfDipping: 'PROBABILIDAD DE CAÍDA',
      targetTomorrow: 'Precio Objetivo Mañana',
      estimatedWindow: 'Rango Diario Esperado (ATR-14)',
  positionSizeHint: 'Tamaño Sugerido',
      bullish: 'Alcista',
      bearish: 'Bajista',
      neutral: 'Neutral',
      testPrediction1000: 'Probar Predicción con $1,000',
      testCustomTrade: 'Operación Simulada',

      technicalChecklist: 'LISTA DE INDICADORES TÉCNICOS',
      technicalMathExplanation: 'Factores Matemáticos del Algoritmo',
      ma10Crossover: 'Tendencia EMA de 9 Periodos',
      rsiMomentum: 'Oscilador RSI de 14 Días',
      volumeSurge: 'Incremento Relativo de Volumen',
      volatilityProfile: 'Perfil de Volatilidad',
  range52wTitle: 'Precio en Rango 52S',
  viewAuto: 'Auto',
  viewRise: 'Vista Alcista',
  viewDip: 'Vista Bajista',
  autoTooltip: 'Auto: muestra la probabilidad dominante',
  riseViewTooltip: 'Vista Alcista: siempre muestra probabilidad y objetivos de subida',
  dipViewTooltip: 'Vista Bajista: siempre muestra probabilidad y objetivos de bajada',
  leanUpward: 'Los factores técnicos actualmente favorecen un impulso alcista para la próxima sesión.',
  leanDownward: 'Los factores técnicos actualmente favorecen una presión bajista para la próxima sesión.',
  modeAutoToast: 'Modo de vista: Auto (prevaleciente)',
  modeRiseToast: 'Modo de vista: Vista Alcista',
  modeDipToast: 'Modo de vista: Vista Bajista',
  ma10Expl: 'Compara el precio actual con su Media Móvil Exponencial de 9 periodos. Por encima sugiere impulso alcista a corto plazo; por debajo, debilidad.',
  sma50Expl: 'Compara el precio con su media de 50 días, la tendencia intermedia que vigilan los institucionales. Mantenerse arriba conserva la tendencia alcista.',
  rsiExpl: 'Mide la presión compradora frente a la vendedora de 0 a 100. Muy alto (>70) aumenta el riesgo de corrección; muy bajo (<30) apunta a un posible rebote.',
  volumeExpl: 'Compara el volumen de hoy con la media de 10 días. Volumen alto al alza confirma interés comprador; a la baja, presión vendedora.',
  volProfileExpl: 'Cuánto se mueve normalmente este valor al día (ATR-14), más la volatilidad diaria y anualizada. Solo informativo: no altera la predicción.',
  range52wExpl: 'Sitúa el precio dentro de su rango de 52 semanas. Cerca del máximo indica fuerza sostenida; cerca del mínimo, debilidad prolongada.',
  contributionTooltip: 'Puntos que este factor aporta a la probabilidad de subida o bajada. Cuanto mayor, más influye en el resultado.',
  neutralTooltip: 'Métrica contextual: solo informativa y no afecta a la puntuación.',
  techMetricsTitle: 'Métricas Técnicas',
  techMetricsHint: 'Pasa el cursor sobre cualquier métrica para ver su significado',
  lblMa10: 'EMA 9',
  lblSma50: 'SMA50',
  lblRsi14: 'RSI (14)',
  lblVolRatio: 'Volumen vs Media 10D',
  lblAtr14: 'ATR (14 días)',
  lblDailyVol: 'Volatilidad Diaria σd',
  lblAnnVol: 'Volatilidad Anualizada σy',
  momentumShort: 'Momento de 5 Días',
  momRising: 'Subiendo esta semana',
  momFading: 'Cediendo esta semana',
  momFlat: 'Plano durante la semana',
  mom5Expl: 'Cambio del precio en los últimos cinco días. El momento reciente suele persistir, pero las subidas bruscas pueden desvanecerse (máx. ±5 puntos).',
      formulaDetails: 'Fórmula y Ponderación',
      detected: 'Activo',
      notDetected: 'Inactivo',
      oversold: 'Sobrevendido (<30)',
      overbought: 'Sobrecomprado (>70)',
      momentumPositive: 'Momento Positivo',
      momentumNegative: 'Momento Negativo',
      aboveMA10: 'Precio sobre la EMA 9',
      belowMA10: 'Precio bajo la EMA 9',
      sma50Trend: 'Media Móvil de 50 Días',
      aboveSMA50: 'Precio sobre la media de 50 días',
      belowSMA50: 'Precio bajo la media de 50 días',
      modelDisclaimer: 'Puntuación técnica heurística; no es una probabilidad calibrada.',
      highVolume: 'Volumen alto frente a la media de 10 días',
      lowVolume: 'Sin volumen inusual',
  modelDisclaimerNote: 'Indicador de concordancia de señales del modelo técnico. No es un historial, garantía ni probabilidad calibrada.',

      livePriceGraph: 'GRÁFICO DE PRECIO EN VIVO Y TENDENCIA',
      timeframe1D: '1D',
      timeframe5D: '5D',
      timeframe1M: '1M',
      timeframe6M: '6M',
      timeframeYTD: 'YTD',
      timeframe1Y: '1A',
      timeframe5Y: '5A',
      timeframeALL: 'TODO',
      volume: 'Volumen',
  volumeProfile: 'Perfil de volumen',
      openPrice: 'Apertura',
      highPrice: 'Máximo',
      lowPrice: 'Mínimo',
      closePrice: 'Cierre',

      past30Days: 'Últimos 30 Días',
      backtestLog: 'Registro Histórico de Pruebas',
      day: 'Día',
      predicted: 'Predicho',
      actual: 'Real',
      result: 'Resultado',
      hit: 'ACIERTO',
      miss: 'FALLO',

      watchlist: 'LISTA DE SEGUIMIENTO',
      searchAddStock: 'Añadir acción / símbolo',
      noStocksInWatchlist: 'No hay acciones en la lista. ¡Busca o añade abajo!',
      addStockToWatchlist: 'Añadir a Lista',
      removeFromWatchlist: 'Eliminar',
      popularStocks: 'Acciones Populares',
      usStocks: 'Acciones de EE.UU.',
      chineseStocks: 'Acciones de China (A-Shares)',
  myListTab: 'Mi lista',
  tickersCount: 'Valores',
  browseTickers: 'Explorar valores',
  rankingsTitle: 'Ranking de la watchlist',
  rankingsSubtitle: 'Compuesto de puntuaciones z transversales • técnico / fundamental / opciones',
  scoringWatchlist: 'Puntuando la watchlist…',
  rankingsNeedsTwo: 'Añade al menos dos valores para calcular el ranking.',
  colTicker: 'Símbolo',
  colCompositeScore: 'Puntuación compuesta',
  colTechZ: 'z téc',
  colFundZ: 'z fund',
  colOptZ: 'z opc',
  rankActive: 'activo',
  rankingsMethodology:
    'Cada métrica se estandariza en una puntuación z transversal dentro de tu watchlist actual (media 0, σ 1), se ajusta su signo para que mayor siempre signifique más fuerte, y luego se combinan: técnico 45% (momento 3M excluyendo el último mes, momento 3M completo, precio vs SMA50, distancia del máximo 52S, tendencia de volumen), fundamental 35% (crecimiento de ingresos/beneficios, margen, ROE, deuda/capital), opciones 20% (sesgo de interés abierto put/call). Las categorías ausentes se excluyen renormalizando los pesos — nada se imputa. Las puntuaciones z son relativas solo a esta lista, no al mercado.',
  fundamentalsTitle: 'Fundamentos de la empresa',
  fundamentalsUnavailable:
    'Los datos fundamentales no están disponibles ahora mismo para este valor. Puede ser un tipo de instrumento no soportado o la fuente de datos podría no estar accesible temporalmente.',
  sectionValuation: 'Valoración',
  sectionProfitability: 'Rentabilidad',
  sectionGrowth: 'Crecimiento',
  sectionHealth: 'Salud financiera',
  sectionTargets: 'Precios objetivo',
  analystsWord: 'analistas',
  toMeanTarget: 'hasta el objetivo medio',
  fundamentalsSourceNote:
    'Fuente: Yahoo Finance quoteSummary • caché ~30 min • solo como referencia, no es asesoramiento de inversión.',
  ownershipTitle: 'Propiedad e internos',
  ownershipUnavailable:
    'Los datos de propiedad no están disponibles ahora para este valor. Puede que Yahoo no lo cubra o que la fuente de datos esté temporalmente inaccesible.',
  institutionOwnership: 'Propiedad institucional',
  institutionsWord: 'Instituciones',
  insidersWord: 'Internos',
  floatWord: '% flotante',
  sectionInstitutions: 'Principales tenedores institucionales (13F)',
  colInstitution: 'Institución',
  colShares: 'Acciones',
  colPercent: '% Cap.',
  colChangeQtr: 'Δ Trim.',
  noInstitutionData: 'No hay datos de tenedores institucionales para este valor.',
  sectionInsiders: 'Actividad interna (~6M)',
  insiderBuys: 'compras',
  insiderSells: 'ventas',
  insiderBought: 'Comprado',
  insiderSold: 'Vendido',
  insiderNet: 'Neto',
  insiderHeld: 'Total en manos de internos',
  noInsiderData: 'No hay transacciones internas recientes.',
  ownershipSourceNote:
    'Fuente: módulos de propiedad de Yahoo Finance • caché ~1 h • solo como referencia.',
      stockNumber: 'Código Bursátil',

      marketNews: 'INTELIGENCIA DE MERCADO Y NOTICIAS',
      newsForTicker: 'Noticias para',
      removeAllNews: 'Eliminar Todas las Noticias',
      addCustomNews: 'Añadir Noticia Personalizada',
      generateNews: 'Generar Noticias Nuevas',
      deleteNews: 'Eliminar Noticia',
      noNewsAvailable: 'Sin noticias disponibles. Haz clic en Generar Noticias.',
      sentimentImpact: 'Impacto de Sentimiento en Predicción',
      confirmDeleteTitle: 'Eliminar Noticia',
      confirmDeleteMessage: '¿Estás seguro de eliminar esta noticia? Su factor de sentimiento se eliminará del algoritmo.',
      confirmRemoveAllTitle: 'Eliminar Todas las Noticias',
      confirmRemoveAllMessage: '¿Estás seguro de eliminar TODAS las noticias para este ticker? El impacto se restablecerá a neutral.',
      cancel: 'Cancelar',
      yesDelete: 'Sí, Eliminar',
      yesRemoveAll: 'Sí, Eliminar Todo',
      areYouSure: '¿Estás seguro?',

      paperTradingPortfolio: 'SIMULADOR DE TRADING Y PORTAFOLIO',
      activePositions: 'Posiciones Activas',
      tradeHistory: 'Historial de Operaciones',
      buyLong: 'Comprar / Largo',
      sellShort: 'Vender / Corto',
      shares: 'Acciones',
      amountToInvest: 'Monto a Invertir',
      entryPrice: 'Precio de Entrada',
      currentValue: 'Valor Actual',
      unrealizedPnL: 'P&L No Realizado',
      realizedPnL: 'P&L Realizado',
      totalBalance: 'Balance Total',
      availableCash: 'Efectivo Disponible',
      whatWillHappen: 'Simulación: Qué Pasará',
      estimatedReturn: 'Ganancia Estimada',
      maxStopLoss: 'Stop Loss Recomendado',
      executeTrade: 'Ejecutar Orden Simulada',
      closePosition: 'Cerrar Operación',
      noActivePositions: 'Sin posiciones activas. ¡Prueba la predicción arriba para abrir una!',
      editPosition: 'Editar Posición',
      saveChanges: 'Guardar Cambios',
      resetWallet: 'Reiniciar Billetera a $10,000',
      walletDeposit: 'Depositar Fondos',

      settings: 'CONFIGURACIÓN DEL SISTEMA',
      language: 'Idioma de Interfaz',
      addLanguage: 'Añadir Idioma Personalizado',
      enterLanguageName: 'Nombre de Idioma (ej. Italiano)',
      enterLanguageCode: 'Código (ej. it)',
      addLanguageButton: 'Añadir y Cambiar Idioma',
      customLanguages: 'Idiomas Personalizados',
      currency: 'Moneda de Visualización',
      searchCurrency: 'Buscar moneda (ej. USD, EUR, CNY, MXN)...',
      noCurrencyResult: 'Sin resultados para la moneda',
      displayMode: 'Formato de Visualización',
      displayModeAuto: 'Automático Dinámico (Mayor Probabilidad)',
      displayModeRiseOnly: 'Mostrar Siempre Probabilidad de Subida',
      displayModeDipOnly: 'Mostrar Siempre Probabilidad de Caída',
      themeCyberDark: 'Tema: Terminal Cyber Dark (#0a0f1d)',
      systemPreferences: 'Preferencias y Parámetros Cuantitativos',
      close: 'Cerrar',
    },
  },
  ja: {
    name: '日本語 (Japanese)',
    flag: '🇯🇵',
    translations: {
      appTitle: 'AI 株価予測 & クオンツ分析ダッシュボード',
      appSubtitle: '数学的テクニカル指標アルゴリズムと翌日騰落確率予測',
      searchPlaceholder: 'ティッカーまたは中国株番号を検索 (例: NVDA, 002230)...',
      marketOpen: '取引中 (開場)',
      marketClosed: '閉場',
      preMarket: 'プレマーケット',
      afterHours: 'アフターアワーズ',
      paperWallet: '仮想トレード資金',
      riskLevel: 'リスクレベル',
      riskLow: '低リスク',
      riskMedium: '中リスク',
      riskHigh: '高リスク',

      corePrediction: 'コア予測マトリックス',
      probRising: '明日の上昇確率',
      probDipping: '明日の下落確率',
      chanceOfRising: '明日の上昇確率',
      chanceOfDipping: '明日の下落確率',
      targetTomorrow: '明日の目標株価',
      estimatedWindow: '想定レンジ (ATR-14)',
  positionSizeHint: '推奨サイズ',
      bullish: '強気 (上昇)',
      bearish: '弱気 (下落)',
      neutral: '中立',
      testPrediction1000: '$1,000でシミュレーション検証',
      testCustomTrade: 'カスタム模擬トレード',

      technicalChecklist: 'テクニカル指標チェックリスト',
      technicalMathExplanation: '数理アルゴリズム要因分析',
      ma10Crossover: '9日指数移動平均線',
      rsiMomentum: '14日 RSI オシレーター',
      volumeSurge: '出来高急増比率',
      volatilityProfile: 'ボラティリティ概要',
  range52wTitle: '52週レンジ内の位置',
  viewAuto: 'オート',
  viewRise: '上昇ビュー',
  viewDip: '下落ビュー',
  autoTooltip: 'オート：優勢側の確率を表示',
  riseViewTooltip: '上昇ビュー：常に上昇確率と目標を表示',
  dipViewTooltip: '下落ビュー：常に下落確率と目標を表示',
  leanUpward: 'テクニカル要因は現在、翌営業日の上昇モメンタムに傾いています。',
  leanDownward: 'テクニカル要因は現在、翌営業日の下落圧力に傾いています。',
  modeAutoToast: '表示モード：オート（優勢側）',
  modeRiseToast: '表示モード：上昇ビュー',
  modeDipToast: '表示モード：下落ビュー',
  ma10Expl: '現在価格と9期間の指数移動平均線を比較。平均を上回れば短期的な上昇モメンタム、下回れば弱気のサインです。',
  sma50Expl: '価格と50日移動平均（機関投資家が注目する中期トレンド線）を比較。上で推移していれば中期上昇トレンドが維持されています。',
  rsiExpl: '直近の買圧と売圧を0〜100で評価。極端に高い（>70）と調整リスクが、極端に低い（<30）と反発の可能性が高まります。',
  volumeExpl: '当日の出来高を10日平均と比較。陽線での急増は買いの本気を、陰線での急増は売り圧力を示します。',
  volProfileExpl: 'この銘柄の1日あたりの典型的な変動幅（ATR-14）と日次・年化ボラティリティを表示。参考情報であり予測スコアには影響しません。',
  range52wExpl: '52週高値・安値レンジの中で現在価格の位置を示します。高値付近は持続的な強さ、安値付近は長期的な弱さを意味します。',
  contributionTooltip: 'このファクターが騰落確率に加算するポイント。数値が大きいほど結果への影響が強いです。',
  neutralTooltip: '参考指標——スコアには影響しません。',
  techMetricsTitle: 'テクニカル指標データ',
  techMetricsHint: '各指標にカーソルを合わせると意味が表示されます',
  lblMa10: '9 EMA',
  lblSma50: 'SMA50 移動平均',
  lblRsi14: 'RSI（14日）',
  lblVolRatio: '出来高 vs 10日平均',
  lblAtr14: 'ATR（14日）',
  lblDailyVol: '日次ボラティリティ σd',
  lblAnnVol: '年化ボラティリティ σy',
  momentumShort: '5日間のモメンタム',
  momRising: '今週は上昇基調',
  momFading: '今週は下押し気味',
  momFlat: '今週は横ばい',
  mom5Expl: '直近5営業日の価格変化。短期的な勢いは続きやすい一方、急騰後は失速することもあります（上限±5点）。',
      formulaDetails: '計算式と寄与度',
      detected: '点灯',
      notDetected: '未達',
      oversold: '売られすぎ (<30)',
      overbought: '買われすぎ (>70)',
      momentumPositive: 'モメンタム好転',
      momentumNegative: 'モメンタム悪化',
      aboveMA10: '株価は9 EMAを上回る',
      belowMA10: '株価は9 EMAを下回る',
      sma50Trend: '50日移動平均',
      aboveSMA50: '株価は50日MAを上回る',
      belowSMA50: '株価は50日MAを下回る',
      modelDisclaimer: 'ヒューリスティックなテクニカルスコアであり、校正された確率ではありません。',
      highVolume: '出来高が10日平均を显著に上回る',
      lowVolume: '出来高に変動なし',
  modelDisclaimerNote: 'テクニカルモデルのシグナル一致度の指標です。実績・保証・校正済み確率ではありません。',

      livePriceGraph: 'リアルタイム株価チャート & トレンド',
      timeframe1D: '1日',
      timeframe5D: '5日',
      timeframe1M: '1ヶ月',
      timeframe6M: '6ヶ月',
      timeframeYTD: '年初来',
      timeframe1Y: '1年',
      timeframe5Y: '5年',
      timeframeALL: '全期間',
      volume: '出来高',
  volumeProfile: '出来高プロファイル',
      openPrice: '始値',
      highPrice: '高値',
      lowPrice: '安値',
      closePrice: '終値',

      past30Days: '過去30日間',
      backtestLog: '日次検証ログ',
      day: '日',
      predicted: '予測',
      actual: '実際',
      result: '結果',
      hit: '的中',
      miss: '不的中',

      watchlist: 'ウォッチリスト',
      searchAddStock: '銘柄を追加',
      noStocksInWatchlist: 'ウォッチリストは空です。銘柄を検索して追加してください。',
      addStockToWatchlist: 'リストに追加',
      removeFromWatchlist: '削除',
      popularStocks: '人気銘柄',
      usStocks: '米国株',
      chineseStocks: '中国株 (A株)',
  myListTab: 'マイリスト',
  tickersCount: '銘柄',
  browseTickers: '人気銘柄を見る',
  rankingsTitle: 'ウォッチリスト順位',
  rankingsSubtitle: '横断面Zスコア複合 • テクニカル / ファンダメンタル / オプション',
  scoringWatchlist: 'ウォッチリストを評価中…',
  rankingsNeedsTwo: 'ランキング計算には銘柄を2つ以上追加してください。',
  colTicker: 'ティッカー',
  colCompositeScore: '総合スコア',
  colTechZ: 'テクz',
  colFundZ: 'ファンz',
  colOptZ: 'オプz',
  rankActive: '表示中',
  rankingsMethodology:
    '各指標は現在のウォッチリスト内で横断面標準化（平均0、σ1）され、大きいほど強い向きに符号調整した上で合成されます：テクニカル45%（直近1ヶ月を除く3Mモメンタム、通常の3Mモメンタム、価格vs SMA50、52週高値からの距離、出来高トレンド）、ファンダメンタル35%（売上/利益成長、利益率、ROE、負債比率）、オプション20%（プット/コール残高スキュー）。欠損カテゴリは重みを再正規化して除外し、補完は行いません。Zスコアはこのリスト内の相対値であり市場全体との比較ではありません。',
  fundamentalsTitle: '企業ファンダメンタル',
  fundamentalsUnavailable:
    'このティッカーのファンダメンタルデータは現在利用できません。サポート外の銘柄タイプか、データソースに一時的に接続できない可能性があります。',
  sectionValuation: 'バリュエーション',
  sectionProfitability: '収益性',
  sectionGrowth: '成長性',
  sectionHealth: '財務健全性',
  sectionTargets: '目標株価',
  analystsWord: '人のアナリスト',
  toMeanTarget: '平均目標まで',
  fundamentalsSourceNote:
    '出典：Yahoo Finance quoteSummary • 約30分キャッシュ • 参考情報であり投資助言ではありません。',
  ownershipTitle: '保有状況と内部者',
  ownershipUnavailable:
    'このティッカーの保有データは現在取得できません。Yahooが対象外の銘柄か、データソースに一時的に接続できない可能性があります。',
  institutionOwnership: '機関投資家の保有比率',
  institutionsWord: '機関数',
  insidersWord: '内部者',
  floatWord: '流通株比率',
  sectionInstitutions: '主要機関投資家 (13F)',
  colInstitution: '機関名',
  colShares: '保有株数',
  colPercent: '比率',
  colChangeQtr: '四半期変化',
  noInstitutionData: 'このティッカーの機関投資家データはありません。',
  sectionInsiders: '内部者取引（約6か月）',
  insiderBuys: '件の買い',
  insiderSells: '件の売り',
  insiderBought: '買い株数',
  insiderSold: '売り株数',
  insiderNet: '純変動',
  insiderHeld: '内部者保有株',
  noInsiderData: '最近の内部者取引はありません。',
  ownershipSourceNote:
    '出典：Yahoo Finance 保有モジュール • 約1時間キャッシュ • 参考情報。',
      stockNumber: '銘柄コード',

      marketNews: '市場ニュース & センチメント分析',
      newsForTicker: '銘柄関連ニュース:',
      removeAllNews: 'すべてのニュースを削除',
      addCustomNews: 'カスタムニュースを追加',
      generateNews: '最新ニュースを再取得',
      deleteNews: 'ニュース削除',
      noNewsAvailable: 'ニュースがありません。「最新ニュースを再取得」をクリックしてください。',
      sentimentImpact: 'センチメント寄与度',
      confirmDeleteTitle: 'ニュースの削除確認',
      confirmDeleteMessage: 'このニュースを削除しますか？アルゴリズムのセンチメント要因が再計算されます。',
      confirmRemoveAllTitle: '全ニュース削除確認',
      confirmRemoveAllMessage: 'この銘柄のすべてのニュースを削除しますか？センチメントは中立にリセットされます。',
      cancel: 'キャンセル',
      yesDelete: '削除する',
      yesRemoveAll: 'すべて削除',
      areYouSure: 'よろしいですか？',

      paperTradingPortfolio: '模擬ペーパートレード口座',
      activePositions: '保有ポジション',
      tradeHistory: '約定履歴',
      buyLong: '買い (ロング)',
      sellShort: '空売り (ショート)',
      shares: '株数',
      amountToInvest: '投資金額',
      entryPrice: '取得単価',
      currentValue: '現在価値',
      unrealizedPnL: '評価損益',
      realizedPnL: '確定損益',
      totalBalance: '総資産額',
      availableCash: '買付余力',
      whatWillHappen: 'シミュレーション結果予測 (何が起こるか)',
      estimatedReturn: '予想利益目標',
      maxStopLoss: '推奨損切りライン',
      executeTrade: '模擬注文を発注',
      closePosition: 'ポジション決済',
      noActivePositions: '保有ポジションがありません。上の予測カードから検証注文を出してみましょう！',
      editPosition: 'ポジション編集',
      saveChanges: '保存',
      resetWallet: '資金を$10,000にリセット',
      walletDeposit: '資金を追加',

      settings: 'システム設定',
      language: '表示言語',
      addLanguage: 'カスタム言語を追加',
      enterLanguageName: '言語名 (例: ドイツ語)',
      enterLanguageCode: '言語コード (例: de)',
      addLanguageButton: '言語を追加して切り替え',
      customLanguages: '追加した言語',
      currency: '表示通貨',
      searchCurrency: '通貨を検索 (例: JPY, USD, EUR, CNY)...',
      noCurrencyResult: '該当する通貨が見つかりません',
      displayMode: '予測の表示形式',
      displayModeAuto: '自動 (最も確率の高い方向を表示)',
      displayModeRiseOnly: '常に上昇確率 (Chance of Rise) を表示',
      displayModeDipOnly: '常に下落確率 (Chance of Dip) を表示',
      themeCyberDark: 'テーマ: サイバーダーク (#0a0f1d)',
      systemPreferences: 'パラメータ設定',
      close: '閉じる',
    },
  },
  fr: {
    name: 'Français (French)',
    flag: '🇫🇷',
    translations: {
      appTitle: 'PRÉDICTEUR D\'ACTIONS IA',
      appSubtitle: 'Suite d\'Indicateurs Mathématiques et Prévisions Quantitatives',
      searchPlaceholder: 'Rechercher un ticker (ex: NVDA, AAPL, 002230)...',
      marketOpen: 'MARCHÉ OUVERT',
      marketClosed: 'MARCHÉ FERMÉ',
      preMarket: 'PRÉ-MARCHÉ',
      afterHours: 'APRÈS-CLÔTURE',
      paperWallet: 'Portefeuille Virtuel',
      riskLevel: 'Niveau de Risque',
      riskLow: 'Risque Faible',
      riskMedium: 'Risque Moyen',
      riskHigh: 'Risque Élevé',

      corePrediction: 'MATRICE DE PRÉDICTION PRINCIPALE',
      probRising: 'Probabilité de Hausse Demain',
      probDipping: 'Probabilité de Baisse Demain',
      chanceOfRising: 'CHANCE DE HAUSSE',
      chanceOfDipping: 'CHANCE DE BAISSE',
      targetTomorrow: 'Objectif de Prix Demain',
      estimatedWindow: 'Fourchette Quotidienne Attendue (ATR-14)',
  positionSizeHint: 'Taille Suggérée',
      bullish: 'Haussier',
      bearish: 'Baissier',
      neutral: 'Neutre',
      testPrediction1000: 'Tester la Prédiction avec 1 000 $',
      testCustomTrade: 'Simulation Personnalisée',

      technicalChecklist: 'LISTE DES INDICATEURS TECHNIQUES',
      technicalMathExplanation: 'Facteurs Mathématiques de l\'Algorithme',
      ma10Crossover: 'Tendance EMA 9 périodes',
      rsiMomentum: 'Oscillateur RSI 14 Jours',
      volumeSurge: 'Pic Relatif de Volume',
      volatilityProfile: 'Profil de Volatilité',
  range52wTitle: 'Position dans le Range 52S',
  viewAuto: 'Auto',
  viewRise: 'Vue Hausse',
  viewDip: 'Vue Baisse',
  autoTooltip: 'Auto : affiche la probabilité dominante',
  riseViewTooltip: 'Vue Hausse : affiche toujours chance et objectifs de hausse',
  dipViewTooltip: 'Vue Baisse : affiche toujours probabilité et objectifs de baisse',
  leanUpward: 'Les facteurs techniques penchent actuellement vers une dynamique haussière pour la prochaine séance.',
  leanDownward: 'Les facteurs techniques penchent actuellement vers une pression baissière pour la prochaine séance.',
  modeAutoToast: 'Mode d\'affichage : Auto (dominant)',
  modeRiseToast: 'Mode d\'affichage : Vue Hausse',
  modeDipToast: 'Mode d\'affichage : Vue Baisse',
  ma10Expl: 'Compare le prix actuel à sa moyenne mobile exponentielle sur 9 périodes. Au-dessus, momentum haussier court terme ; en dessous, faiblesse.',
  sma50Expl: 'Compare le prix à sa moyenne 50 jours, la tendance intermédiaire suivie par les institutionnels. Rester au-dessus préserve la tendance haussière.',
  rsiExpl: 'Évalue la pression acheteuse contre vendeuse de 0 à 100. Très haut (>70), risque de repli ; très bas (<30), rebond possible.',
  volumeExpl: 'Compare le volume du jour à la moyenne 10 jours. Un volume élevé à la hausse confirme les achats ; à la baisse, il signale une pression vendeuse.',
  volProfileExpl: 'Amplitude typique quotidienne (ATR-14) et volatilité journalière et annualisée. Informatif uniquement — sans effet sur la prédiction.',
  range52wExpl: 'Situe le prix dans son range annuel (52 semaines). Près du plus-haut, force durable ; près du plus-bas, faiblesse prolongée.',
  contributionTooltip: 'Points apportés par ce facteur à la probabilité de hausse ou baisse. Plus c\'est grand, plus l\'influence est forte.',
  neutralTooltip: 'Indicateur de contexte — purement informatif, sans effet sur le score.',
  techMetricsTitle: 'Métriques Techniques',
  techMetricsHint: 'Survolez une métrique pour voir sa signification',
  lblMa10: 'MME 9',
  lblSma50: 'MMS50',
  lblRsi14: 'RSI (14)',
  lblVolRatio: 'Volume vs Moyenne 10J',
  lblAtr14: 'ATR (14 jours)',
  lblDailyVol: 'Volatilité Quotidienne σd',
  lblAnnVol: 'Volatilité Annualisée σy',
  momentumShort: 'Momentum 5 Jours',
  momRising: 'En hausse cette semaine',
  momFading: 'En repli cette semaine',
  momFlat: 'Stable sur la semaine',
  mom5Expl: 'Variation du prix sur les cinq derniers jours. L\'élan récent persiste souvent, mais les fortes hausses peuvent s\'essouffler (plafonné à ±5 points).',
      formulaDetails: 'Formule & Pondération',
      detected: 'Actif',
      notDetected: 'Inactif',
      oversold: 'Survendu (<30)',
      overbought: 'Suracheté (>70)',
      momentumPositive: 'Momentum Positif',
      momentumNegative: 'Momentum Négatif',
      aboveMA10: 'Prix au-dessus de la MME 9',
      belowMA10: 'Prix sous la MME 9',
      sma50Trend: 'Moyenne Mobile 50 Jours',
      aboveSMA50: 'Prix au-dessus du MM50',
      belowSMA50: 'Prix sous le MM50',
      modelDisclaimer: 'Score technique heuristique — pas une probabilité calibrée.',
      highVolume: 'Volume élevé vs moyenne 10 jours',
      lowVolume: 'Volume normal',
  modelDisclaimerNote: 'Indicateur de cohérence des signaux du modèle technique. Ce n\'est ni un historique, ni une garantie, ni une probabilité calibrée.',

      livePriceGraph: 'GRAPHIQUE DU COURS EN DIRECT',
      timeframe1D: '1J',
      timeframe5D: '5J',
      timeframe1M: '1M',
      timeframe6M: '6M',
      timeframeYTD: 'YTD',
      timeframe1Y: '1A',
      timeframe5Y: '5A',
      timeframeALL: 'TOUT',
      volume: 'Volume',
  volumeProfile: 'Profil de volume',
      openPrice: 'Ouverture',
      highPrice: 'Plus Haut',
      lowPrice: 'Plus Bas',
      closePrice: 'Clôture',

      past30Days: '30 Derniers Jours',
      backtestLog: 'Historique des Vérifications',
      day: 'Jour',
      predicted: 'Prédit',
      actual: 'Réel',
      result: 'Résultat',
      hit: 'RÉUSSI',
      miss: 'MANQUÉ',

      watchlist: 'LISTE DE SURVEILLANCE',
      searchAddStock: 'Ajouter une action',
      noStocksInWatchlist: 'Aucune action dans la liste. Recherchez ou ajoutez ci-dessous !',
      addStockToWatchlist: 'Ajouter',
      removeFromWatchlist: 'Supprimer',
      popularStocks: 'Actions Populaires',
      usStocks: 'Actions US',
      chineseStocks: 'Actions Chinoises (A-Shares)',
  myListTab: 'Ma liste',
  tickersCount: 'Valeurs',
  browseTickers: 'Parcourir les valeurs',
  rankingsTitle: 'Classement de la watchlist',
  rankingsSubtitle: 'Composite de z-scores transversaux • technique / fondamental / options',
  scoringWatchlist: 'Notation de la watchlist…',
  rankingsNeedsTwo: 'Ajoutez au moins deux valeurs pour calculer le classement.',
  colTicker: 'Ticker',
  colCompositeScore: 'Score composite',
  colTechZ: 'z tech',
  colFundZ: 'z fond',
  colOptZ: 'z opt',
  rankActive: 'actif',
  rankingsMethodology:
    'Chaque indicateur est standardisé en un z-score transversal dans votre watchlist actuelle (moyenne 0, σ 1), ajusté en signe afin que plus haut signifie toujours plus fort, puis combiné : technique 45% (momentum 3M hors dernier mois, momentum 3M complet, prix vs SMA50, distance du plus-haut 52S, tendance de volume), fondamental 35% (croissance revenus/bénéfices, marge, ROE, dette/fonds propres), options 20% (biais des intérêts ouverts put/call). Les catégories manquantes sont exclues avec renormalisation des poids — aucune imputation. Les z-scores sont relatifs à cette liste uniquement, pas au marché.',
  fundamentalsTitle: 'Fondamentaux de l\'entreprise',
  fundamentalsUnavailable:
    'Les données fondamentales ne sont pas disponibles actuellement pour ce ticker. Il peut s\'agir d\'un type d\'instrument non pris en charge, ou la source de données est temporairement injoignable.',
  sectionValuation: 'Valorisation',
  sectionProfitability: 'Rentabilité',
  sectionGrowth: 'Croissance',
  sectionHealth: 'Santé financière',
  sectionTargets: 'Objectifs de cours',
  analystsWord: 'analystes',
  toMeanTarget: 'vers l\'objectif moyen',
  fundamentalsSourceNote:
    'Source : Yahoo Finance quoteSummary • cache ~30 min • à titre informatif seulement, pas un conseil en investissement.',
  ownershipTitle: 'Détention et initiés',
  ownershipUnavailable:
    "Les données de détention ne sont pas disponibles pour ce ticker. Yahoo peut ne pas le couvrir, ou la source de données est temporairement injoignable.",
  institutionOwnership: 'Détention institutionnelle',
  institutionsWord: 'Institutions',
  insidersWord: 'Initiés',
  floatWord: '% flottant',
  sectionInstitutions: 'Principaux actionnaires institutionnels (13F)',
  colInstitution: 'Institution',
  colShares: 'Actions',
  colPercent: '% Cap.',
  colChangeQtr: 'Δ Trim.',
  noInstitutionData: 'Aucune donnée de détention institutionnelle pour ce ticker.',
  sectionInsiders: 'Activité des initiés (~6M)',
  insiderBuys: 'achats',
  insiderSells: 'ventes',
  insiderBought: 'Achetées',
  insiderSold: 'Vendues',
  insiderNet: 'Net',
  insiderHeld: 'Total initiés',
  noInsiderData: 'Aucune transaction d’initiés récente.',
  ownershipSourceNote:
    'Source : modules de détention Yahoo Finance • cache ~1 h • à titre informatif seulement.',
      stockNumber: 'Code Action',

      marketNews: 'ACTUALITÉS & SENTIMENT DU MARCHÉ',
      newsForTicker: 'Actualités pour',
      removeAllNews: 'Supprimer Toutes les Nouvelles',
      addCustomNews: 'Ajouter une Actualité',
      generateNews: 'Générer de Nouvelles Actualités',
      deleteNews: 'Supprimer l\'Actualité',
      noNewsAvailable: 'Aucune actualité. Cliquez sur Générer pour en charger.',
      sentimentImpact: 'Impact du Sentiment',
      confirmDeleteTitle: 'Supprimer l\'Actualité',
      confirmDeleteMessage: 'Êtes-vous sûr de vouloir supprimer cette actualité ?',
      confirmRemoveAllTitle: 'Supprimer Toutes les Actualités',
      confirmRemoveAllMessage: 'Êtes-vous sûr de vouloir supprimer TOUTES les actualités ?',
      cancel: 'Annuler',
      yesDelete: 'Oui, Supprimer',
      yesRemoveAll: 'Oui, Tout Supprimer',
      areYouSure: 'Êtes-vous sûr ?',

      paperTradingPortfolio: 'SIMULATEUR DE TRADING & PORTEFEUILLE',
      activePositions: 'Positions Actives',
      tradeHistory: 'Historique des Ordres',
      buyLong: 'Acheter / Long',
      sellShort: 'Vendre / Short',
      shares: 'Actions',
      amountToInvest: 'Montant à Investir',
      entryPrice: 'Prix d\'Entrée',
      currentValue: 'Valeur Actuelle',
      unrealizedPnL: 'P&L Non Réalisé',
      realizedPnL: 'P&L Réalisé',
      totalBalance: 'Solde Total',
      availableCash: 'Liquidités Disponibles',
      whatWillHappen: 'Aperçu : Ce qui va se passer',
      estimatedReturn: 'Gain Objectif Estimé',
      maxStopLoss: 'Stop Loss Conseillé',
      executeTrade: 'Exécuter l\'Ordre',
      closePosition: 'Clôturer la Position',
      noActivePositions: 'Aucune position active. Testez la prédiction ci-dessus !',
      editPosition: 'Modifier la Position',
      saveChanges: 'Enregistrer',
      resetWallet: 'Réinitialiser à 10 000 $',
      walletDeposit: 'Déposer des Fonds',

      settings: 'PARAMÈTRES DU SYSTÈME',
      language: 'Langue de l\'Interface',
      addLanguage: 'Ajouter une Langue',
      enterLanguageName: 'Nom de la langue (ex: Arabe)',
      enterLanguageCode: 'Code (ex: ar)',
      addLanguageButton: 'Ajouter et Appliquer',
      customLanguages: 'Langues Personnalisées',
      currency: 'Devise d\'Affichage',
      searchCurrency: 'Rechercher une devise...',
      noCurrencyResult: 'Aucun résultat trouvé',
      displayMode: 'Mode d\'Affichage de Prédiction',
      displayModeAuto: 'Dynamique (Direction la Plus Forte)',
      displayModeRiseOnly: 'Toujours Afficher la Probabilité de Hausse',
      displayModeDipOnly: 'Toujours Afficher la Probabilité de Baisse',
      themeCyberDark: 'Thème : Cyber Dark (#0a0f1d)',
      systemPreferences: 'Préférences & Modèles',
      close: 'Fermer',
    },
  },
  de: {
    name: 'Deutsch (German)',
    flag: '🇩🇪',
    translations: {
      appTitle: 'AI AKTIEN-PROGNOSE & ANALYTIK',
      appSubtitle: 'Mathematische Indikatoren-Suite & Quantitative Vorhersage',
      searchPlaceholder: 'Ticker suchen (z.B. NVDA, AAPL, 002230)...',
      marketOpen: 'MARKT GEÖFFNET',
      marketClosed: 'MARKT GESCHLOSSEN',
      preMarket: 'VORBÖRSLICH',
      afterHours: 'NACHBÖRSLICH',
      paperWallet: 'Musterdepot-Guthaben',
      riskLevel: 'Risikolevel',
      riskLow: 'Geringes Risiko',
      riskMedium: 'Mittleres Risiko',
      riskHigh: 'Hohes Risiko',

      corePrediction: 'KERN-PROGNOSE-MATRIX',
      probRising: 'Wahrscheinlichkeit für Kursanstieg Morgen',
      probDipping: 'Wahrscheinlichkeit für Kursrückgang Morgen',
      chanceOfRising: 'CHANCE AUF ANSTIEG',
      chanceOfDipping: 'CHANCE AUF RÜCKGANG',
      targetTomorrow: 'Kursziel Morgen',
      estimatedWindow: 'Erwartete Tagesspanne (ATR-14)',
      positionSizeHint: 'Empfohlene Größe',
      bullish: 'Bullisch',
      bearish: 'Bärisch',
      neutral: 'Neutral',
      testPrediction1000: 'Mit $1.000 simulieren',
      testCustomTrade: 'Individueller Test-Trade',

      technicalChecklist: 'TECHNISCHE INDIKATOREN-CHECKLISTE',
      technicalMathExplanation: 'Mathematische Algorithmus-Treiber',
      ma10Crossover: '9-Perioden-EMA-Trend',
      rsiMomentum: '14-Tage RSI Oszillator',
      volumeSurge: 'Relatives Volumen-Wachstum',
      volatilityProfile: 'Volatilitätsprofil',
      range52wTitle: 'Kurs im 52W-Bereich',
      viewAuto: 'Auto',
      viewRise: 'Ansicht Steigung',
      viewDip: 'Ansicht Rückgang',
      autoTooltip: 'Auto: zeigt die vorherrschende höhere Wahrscheinlichkeit',
      riseViewTooltip: 'Ansicht Steigung: immer Steigenschance und Ziele anzeigen',
      dipViewTooltip: 'Ansicht Rückgang: immer Rückgangswahrscheinlichkeit und Ziele anzeigen',
      leanUpward: 'Technische Faktoren tendieren derzeit zu Aufwärtsmomentum für die nächste Handelssession.',
      leanDownward: 'Technische Faktoren tendieren derzeit zu Abwärtsdruck für die nächste Handelssession.',
      modeAutoToast: 'Anzeigemodus: Auto (vorherrschend)',
      modeRiseToast: 'Anzeigemodus: Ansicht Steigung',
      modeDipToast: 'Anzeigemodus: Ansicht Rückgang',
      ma10Expl: 'Vergleicht den Kurs mit seiner exponentiellen 9-Perioden-Gleitlinie. Darüber: kurzfristiges Aufwärtsmomentum; darunter: Schwäche.',
      sma50Expl: 'Vergleicht den Kurs mit dem 50-Tage-Durchschnitt, dem mittelfristigen Trend, den Institutionen beachten. Darüber bleibt der Aufwärtstrend intakt.',
      rsiExpl: 'Bewertet Kauf- gegen Verkaufsdruck von 0 bis 100. Sehr hoch (>70) erhöht das Korrekturrisiko, sehr niedrig (<30) deutet auf mögliche Erholung.',
      volumeExpl: 'Setzt das heutige Volumen ins Verhältnis zum 10-Tage-Durchschnitt. Hohes Volumen im Aufwärtslauf bestätigt Käufe, im Abwärtslauf signalisiert es Verkaufsdruck.',
      volProfileExpl: 'Typische Tagesspanne (ATR-14) sowie tägliche und annualisierte Volatilität. Nur zur Info — ohne Einfluss auf die Prognose.',
      range52wExpl: 'Position des Kurses innerhalb der 52-Wochen-Spanne. Nahe am Hoch: anhaltende Stärke; nahe am Tief: anhaltende Schwäche.',
      contributionTooltip: 'Punkte, die dieser Faktor zur Steigungs-/Rückgangswahrscheinlichkeit beiträgt. Je größer, desto stärker der Einfluss.',
      neutralTooltip: 'Kontextkennzahl — nur informativ, ohne Einfluss auf den Score.',
      techMetricsTitle: 'Technische Kennzahlen',
      techMetricsHint: 'Für Bedeutung über eine Kennzahl fahren',
      lblMa10: 'EMA 9',
      lblSma50: 'SMA50',
      lblRsi14: 'RSI (14)',
      lblVolRatio: 'Volumen vs 10T-Durchschn.',
      lblAtr14: 'ATR (14 Tage)',
      lblDailyVol: 'Tagesvolatilität σd',
      lblAnnVol: 'Annualisierte Volatilität σy',
      momentumShort: '5-Tage-Momentum',
      momRising: 'Zieht diese Woche an',
      momFading: 'Ebbt diese Woche ab',
      momFlat: 'Flach über die Woche',
      mom5Expl: 'Kursveränderung der letzten fünf Handelstage. Kurzfristige Dynamik hält oft an, starke Anläufe können jedoch verebben (max. ±5 Punkte).',
      formulaDetails: 'Formel & Gewichtung',
      detected: 'Aktiv',
      notDetected: 'Inaktiv',
      oversold: 'Überverkauft (<30)',
      overbought: 'Überkauft (>70)',
      momentumPositive: 'Positives Momentum',
      momentumNegative: 'Negatives Momentum',
      aboveMA10: 'Kurs über dem EMA 9',
      belowMA10: 'Kurs unter dem EMA 9',
      sma50Trend: '50-Tage Gleitender Durchschnitt',
      aboveSMA50: 'Kurs über dem SMA50',
      belowSMA50: 'Kurs unter dem SMA50',
      modelDisclaimer: 'Heuristischer technischer Score — keine kalibrierte Wahrscheinlichkeit.',
      highVolume: 'Überdurchschnittliches Volumen (10T)',
      lowVolume: 'Kein ungewöhnliches Volumen',
      modelDisclaimerNote: 'Signalübereinstimmungs-Anzeige des technischen Modells. Keine Track-Record-, Garantie- oder kalibrierte Wahrscheinlichkeit.',

      livePriceGraph: 'LIVE-KURSVERLAUF & BEWEGUNG',
      timeframe1D: '1T',
      timeframe5D: '5T',
      timeframe1M: '1M',
      timeframe6M: '6M',
      timeframeYTD: 'YTD',
      timeframe1Y: '1J',
      timeframe5Y: '5J',
      timeframeALL: 'ALLE',
      volume: 'Volumen',
      volumeProfile: 'Volumenprofil',
      openPrice: 'Eröffnung',
      highPrice: 'Hoch',
      lowPrice: 'Tief',
      closePrice: 'Schluss',

      past30Days: 'Letzte 30 Tage',
      backtestLog: 'Historische Prüfungsdaten',
      day: 'Tag',
      predicted: 'Prognose',
      actual: 'Tatsächlich',
      result: 'Ergebnis',
      hit: 'TREFFER',
      miss: 'FEHLTRITT',

      watchlist: 'BEOBACHTUNGSLISTE',
      searchAddStock: 'Aktie / Symbol hinzufügen',
      noStocksInWatchlist: 'Keine Aktien in der Liste. Suchen oder unten auswählen!',
      addStockToWatchlist: 'Zur Liste hinzufügen',
      removeFromWatchlist: 'Entfernen',
      popularStocks: 'Beliebte Aktien',
      usStocks: 'US-Aktien',
      chineseStocks: 'China A-Shares',
  myListTab: 'Meine Liste',
  tickersCount: 'Werte',
  browseTickers: 'Werte durchsuchen',
  rankingsTitle: 'Watchlist-Ranking',
  rankingsSubtitle: 'Querschnitts-Z-Score-Composite • technisch / fundamental / Optionen',
  scoringWatchlist: 'Watchlist wird bewertet…',
  rankingsNeedsTwo: 'Fügen Sie mindestens zwei Werte hinzu, um das Ranking zu berechnen.',
  colTicker: 'Ticker',
  colCompositeScore: 'Gesamtscore',
  colTechZ: 'Tech-z',
  colFundZ: 'Fund-z',
  colOptZ: 'Opt-z',
  rankActive: 'aktiv',
  rankingsMethodology:
    'Jede Kennzahl wird innerhalb Ihrer aktuellen Watchlist querschnittsstandardisiert (Mittelwert 0, σ 1), im Vorzeichen so angepasst, dass höher immer stärker bedeutet, und dann kombiniert: technisch 45% (3M-Momentum ohne letzten Monat, volles 3M-Momentum, Kurs vs. SMA50, Abstand zum 52W-Hoch, Volumenstrend), fundamental 35% (Umsatz-/Gewinnwachstum, Marge, ROE, Verschuldungsgrad), Optionen 20% (Put/Call-Open-Interest-Skew). Fehlende Kategorien werden mit renormalisierten Gewichten ausgeschlossen — nichts wird interpoliert. Z-Scores beziehen sich nur auf diese Liste, nicht auf den Markt.',
  fundamentalsTitle: 'Unternehmensfundamente',
  fundamentalsUnavailable:
    'Für diesen Ticker sind derzeit keine Fundamentaldaten verfügbar. Möglicherweise ist der Instrumententyp nicht unterstützt oder die Datenquelle ist vorübergehend nicht erreichbar.',
  sectionValuation: 'Bewertung',
  sectionProfitability: 'Profitabilität',
  sectionGrowth: 'Wachstum',
  sectionHealth: 'Finanzielle Gesundheit',
  sectionTargets: 'Kursziele',
  analystsWord: 'Analysten',
  toMeanTarget: 'bis zum mittleren Kursziel',
  fundamentalsSourceNote:
    'Quelle: Yahoo Finance quoteSummary • Cache ~30 Min • nur zur Referenz, keine Anlageberatung.',
  ownershipTitle: 'Eigentümer & Insider',
  ownershipUnavailable:
    'Für diesen Ticker sind derzeit keine Eigentümerdaten verfügbar. Möglicherweise wird der Wert von Yahoo nicht abgedeckt, oder die Datenquelle ist vorübergehend nicht erreichbar.',
  institutionOwnership: 'Institutioneller Besitz',
  institutionsWord: 'Institutionen',
  insidersWord: 'Insider',
  floatWord: 'Streubesitz',
  sectionInstitutions: 'Größte institutionelle Halter (13F)',
  colInstitution: 'Institution',
  colShares: 'Aktien',
  colPercent: '% Kap.',
  colChangeQtr: 'Δ Quartal',
  noInstitutionData: 'Keine Daten zu institutionellen Haltern für diesen Ticker.',
  sectionInsiders: 'Insider-Aktivität (~6M)',
  insiderBuys: 'Käufe',
  insiderSells: 'Verkäufe',
  insiderBought: 'Gekauft',
  insiderSold: 'Verkauft',
  insiderNet: 'Netto',
  insiderHeld: 'Insider-Bestand',
  noInsiderData: 'Keine aktuellen Insider-Transaktionen gemeldet.',
  ownershipSourceNote:
    'Quelle: Yahoo-Finance-Eigentumsmodule • Cache ~1 Std. • nur zur Referenz.',
      stockNumber: 'Aktien-Code',

      marketNews: 'MARKT-NACHRICHTEN & SENTIMENT',
      newsForTicker: 'Nachrichten für',
      removeAllNews: 'Alle Nachrichten löschen',
      addCustomNews: 'Eigene Nachricht erstellen',
      generateNews: 'Aktuelle News generieren',
      deleteNews: 'Nachricht löschen',
      noNewsAvailable: 'Keine Nachrichten. Klicken Sie auf "Aktuelle News generieren".',
      sentimentImpact: 'Sentiment-Einfluss',
      confirmDeleteTitle: 'Nachricht löschen',
      confirmDeleteMessage: 'Möchten Sie diese Nachricht wirklich löschen?',
      confirmRemoveAllTitle: 'Alle Nachrichten löschen',
      confirmRemoveAllMessage: 'Möchten Sie wirklich ALLE Nachrichten für dieses Ticker-Symbol löschen?',
      cancel: 'Abbrechen',
      yesDelete: 'Ja, Löschen',
      yesRemoveAll: 'Ja, Alle Löschen',
      areYouSure: 'Sind Sie sicher?',

      paperTradingPortfolio: 'MUSTERDEPOT & TRADING-SIMULATOR',
      activePositions: 'Aktive Positionen',
      tradeHistory: 'Trade-Historie',
      buyLong: 'Kaufen / Long',
      sellShort: 'Verkaufen / Short',
      shares: 'Anteile',
      amountToInvest: 'Investitionsbetrag',
      entryPrice: 'Kaufkurs',
      currentValue: 'Aktueller Wert',
      unrealizedPnL: 'Buchgewinn/-verlust',
      realizedPnL: 'Realisierter P&L',
      totalBalance: 'Gesamtvermögen',
      availableCash: 'Freies Kapital',
      whatWillHappen: 'Simulation: Was wird passieren?',
      estimatedReturn: 'Erwarteter Zielgewinn',
      maxStopLoss: 'Empfohlener Stop Loss',
      executeTrade: 'Order Ausführen',
      closePosition: 'Position Schließen',
      noActivePositions: 'Keine offenen Positionen. Testen Sie die Vorhersage oben!',
      editPosition: 'Position Bearbeiten',
      saveChanges: 'Speichern',
      resetWallet: 'Guthaben auf $10.000 zurücksetzen',
      walletDeposit: 'Guthaben Einzahlen',

      settings: 'SYSTEM-EINSTELLUNGEN',
      language: 'Sprache der Oberfläche',
      addLanguage: 'Eigene Sprache hinzufügen',
      enterLanguageName: 'Sprachname (z.B. Polnisch)',
      enterLanguageCode: 'Code (z.B. pl)',
      addLanguageButton: 'Hinzufügen & Aktivieren',
      customLanguages: 'Benutzerdefinierte Sprachen',
      currency: 'Währung',
      searchCurrency: 'Währung suchen...',
      noCurrencyResult: 'Keine Währung gefunden',
      displayMode: 'Anzeigeformat der Vorhersage',
      displayModeAuto: 'Dynamisch (Höchste Wahrscheinlichkeit)',
      displayModeRiseOnly: 'Immer Wahrscheinlichkeit für Anstieg anzeigen',
      displayModeDipOnly: 'Immer Wahrscheinlichkeit für Rückgang anzeigen',
      themeCyberDark: 'Design: Cyber Dark (#0a0f1d)',
      systemPreferences: 'Parameter & Einstellungen',
      close: 'Schließen',
    },
  },
};

export function getTranslation(langCode: string, customLanguages: Record<string, CustomLanguage> = {}): TranslationDict {
  if (BUILT_IN_LANGUAGES[langCode]) {
    return BUILT_IN_LANGUAGES[langCode].translations;
  }
  
  if (customLanguages[langCode] && customLanguages[langCode].translations) {
    // Merge with English fallback
    return {
      ...BUILT_IN_LANGUAGES['en'].translations,
      ...customLanguages[langCode].translations,
    };
  }

  // Fallback to English
  return BUILT_IN_LANGUAGES['en'].translations;
}

export interface CustomLanguage {
  code: string;
  name: string;
  flag?: string;
  translations?: Partial<TranslationDict>;
}
