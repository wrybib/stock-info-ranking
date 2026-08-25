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
  volatilitySentiment: string;
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
  ma10Line: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  closePrice: string;

  // AI Confidence & Backtesting
  aiConfidenceMeter: string;
  modelDisclaimerNote: string;
  backtestingAccuracy: string;
  past30Days: string;
  algorithmSuccessRate: string;
  confidenceExtreme: string;
  confidenceHigh: string;
  confidenceModerate: string;
  confidenceLow: string;
  correctPredictions: string;
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
      estimatedWindow: 'Volatility Corridor (95% CI)',
      bullish: 'Bullish',
      bearish: 'Bearish',
      neutral: 'Neutral',
      testPrediction1000: 'Test Prediction with $1,000',
      testCustomTrade: 'Custom Paper Trade',

      technicalChecklist: 'TECHNICAL INDICATOR CHECKLIST',
      technicalMathExplanation: 'Mathematical Algorithm Drivers',
      ma10Crossover: '10-Day Moving Average',
      rsiMomentum: '14-Day RSI Oscillator',
      volumeSurge: 'Volume Relative Surge',
      volatilitySentiment: 'Volatility & News Sentiment',
      formulaDetails: 'Formula & Weight',
      detected: 'Active',
      notDetected: 'Inactive',
      oversold: 'Oversold (<30)',
      overbought: 'Overbought (>70)',
      momentumPositive: 'Momentum Positive',
      momentumNegative: 'Momentum Negative',
      aboveMA10: 'Price above 10-day MA',
      belowMA10: 'Price below 10-day MA',
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
      ma10Line: 'MA10 Overlay',
      openPrice: 'Open',
      highPrice: 'High',
      lowPrice: 'Low',
      closePrice: 'Close',

      aiConfidenceMeter: 'AI CONFIDENCE METER',
  modelDisclaimerNote: 'Signal-agreement gauge of the technical model. Not a track record, guarantee, or calibrated probability.',
      backtestingAccuracy: 'BACKTESTING ACCURACY',
      past30Days: 'Past 30 Days',
      algorithmSuccessRate: 'Algorithm Success Rate',
      confidenceExtreme: 'EXTREME',
      confidenceHigh: 'HIGH',
      confidenceModerate: 'MODERATE',
      confidenceLow: 'LOW',
      correctPredictions: '30-Day Accuracy',
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
    'Each metric is standardized into a cross-sectional z-score across your current watchlist (mean 0, σ 1), sign-adjusted so higher always means stronger, then combined: technical 45% (momentum 1M/3M, price vs SMA50, 52W-high distance, volume trend), fundamental 35% (revenue/earnings growth, profit margin, ROE, debt-to-equity), options 20% (put/call open-interest skew). Missing categories are excluded with weights renormalized — nothing imputed. Z-scores are relative to this list only, not the market.',
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
      estimatedWindow: '波动率区间 (95% 置信度)',
      bullish: '看涨',
      bearish: '看跌',
      neutral: '中性',
      testPrediction1000: '以 $1,000 模拟验证预测',
      testCustomTrade: '自定义模拟交易',

      technicalChecklist: '技术指标量化清单',
      technicalMathExplanation: '算法核心数学驱动因素',
      ma10Crossover: '10日均线 (MA10) 交叉状态',
      rsiMomentum: '14日 RSI 动量指标',
      volumeSurge: '成交量异动放量比',
      volatilitySentiment: '波动率与新闻情绪因子',
      formulaDetails: '公式与权重贡献',
      detected: '已触发',
      notDetected: '未触发',
      oversold: '超卖区间 (<30)',
      overbought: '超买区间 (>70)',
      momentumPositive: '动能转强',
      momentumNegative: '动能转弱',
      aboveMA10: '股价高于10日均线',
      belowMA10: '股价低于10日均线',
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
      ma10Line: '10日均线',
      openPrice: '开盘',
      highPrice: '最高',
      lowPrice: '最低',
      closePrice: '收盘',

      aiConfidenceMeter: 'AI 算法置信度',
  modelDisclaimerNote: '技术模型信号一致性指标，非历史业绩、保证或校准概率。',
      backtestingAccuracy: '过去30天回测准确率',
      past30Days: '过去30天',
      algorithmSuccessRate: '算法命中率',
      confidenceExtreme: '极高',
      confidenceHigh: '高',
      confidenceModerate: '中等',
      confidenceLow: '低',
      correctPredictions: '30日预测胜率',
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
    '每项指标都会在当前自选列表内做横截面标准化（均值0，σ1），统一调整方向使数值越大越强后加权合成：技术45%（1M/3M动量、价格vs SMA50、距52周高点、成交量趋势）、基本面35%（营收/盈利增长、利润率、ROE、资产负债率）、期权20%（看跌/看涨未平仓合约偏斜）。缺失类别将被剔除并重新归一化权重——不做任何填补。Z分数仅相对于本列表，而非整个市场。',
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
      estimatedWindow: 'Corredor de Volatilidad (95% IC)',
      bullish: 'Alcista',
      bearish: 'Bajista',
      neutral: 'Neutral',
      testPrediction1000: 'Probar Predicción con $1,000',
      testCustomTrade: 'Operación Simulada',

      technicalChecklist: 'LISTA DE INDICADORES TÉCNICOS',
      technicalMathExplanation: 'Factores Matemáticos del Algoritmo',
      ma10Crossover: 'Media Móvil de 10 Días (MA10)',
      rsiMomentum: 'Oscilador RSI de 14 Días',
      volumeSurge: 'Incremento Relativo de Volumen',
      volatilitySentiment: 'Volatilidad y Sentimiento de Noticias',
      formulaDetails: 'Fórmula y Ponderación',
      detected: 'Activo',
      notDetected: 'Inactivo',
      oversold: 'Sobrevendido (<30)',
      overbought: 'Sobrecomprado (>70)',
      momentumPositive: 'Momento Positivo',
      momentumNegative: 'Momento Negativo',
      aboveMA10: 'Precio sobre la media de 10 días',
      belowMA10: 'Precio bajo la media de 10 días',
      sma50Trend: 'Media Móvil de 50 Días',
      aboveSMA50: 'Precio sobre la media de 50 días',
      belowSMA50: 'Precio bajo la media de 50 días',
      modelDisclaimer: 'Puntuación técnica heurística; no es una probabilidad calibrada.',
      highVolume: 'Volumen alto frente a la media de 10 días',
      lowVolume: 'Sin volumen inusual',
  aiConfidenceMeter: 'MEDIDOR DE CONFIANZA IA',
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
      ma10Line: 'Línea MA10',
      openPrice: 'Apertura',
      highPrice: 'Máximo',
      lowPrice: 'Mínimo',
      closePrice: 'Cierre',

      backtestingAccuracy: 'PRECISIÓN DE BACKTESTING (30 DÍAS)',
      past30Days: 'Últimos 30 Días',
      algorithmSuccessRate: 'Tasa de Éxito del Algoritmo',
      confidenceExtreme: 'EXTREMO',
      confidenceHigh: 'ALTO',
      confidenceModerate: 'MODERADO',
      confidenceLow: 'BAJO',
      correctPredictions: 'Aciertos en 30 Días',
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
    'Cada métrica se estandariza en una puntuación z transversal dentro de tu watchlist actual (media 0, σ 1), se ajusta su signo para que mayor siempre signifique más fuerte, y luego se combinan: técnico 45% (momento 1M/3M, precio vs SMA50, distancia del máximo 52S, tendencia de volumen), fundamental 35% (crecimiento de ingresos/beneficios, margen, ROE, deuda/capital), opciones 20% (sesgo de interés abierto put/call). Las categorías ausentes se excluyen renormalizando los pesos — nada se imputa. Las puntuaciones z son relativas solo a esta lista, no al mercado.',
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
      estimatedWindow: 'ボラティリティ予測帯 (95%信頼区間)',
      bullish: '強気 (上昇)',
      bearish: '弱気 (下落)',
      neutral: '中立',
      testPrediction1000: '$1,000でシミュレーション検証',
      testCustomTrade: 'カスタム模擬トレード',

      technicalChecklist: 'テクニカル指標チェックリスト',
      technicalMathExplanation: '数理アルゴリズム要因分析',
      ma10Crossover: '10日移動平均線 (MA10)',
      rsiMomentum: '14日 RSI オシレーター',
      volumeSurge: '出来高急増比率',
      volatilitySentiment: 'ボラティリティ & ニュースセンチメント',
      formulaDetails: '計算式と寄与度',
      detected: '点灯',
      notDetected: '未達',
      oversold: '売られすぎ (<30)',
      overbought: '買われすぎ (>70)',
      momentumPositive: 'モメンタム好転',
      momentumNegative: 'モメンタム悪化',
      aboveMA10: '株価は10日MAを上回る',
      belowMA10: '株価は10日MAを下回る',
      sma50Trend: '50日移動平均',
      aboveSMA50: '株価は50日MAを上回る',
      belowSMA50: '株価は50日MAを下回る',
      modelDisclaimer: 'ヒューリスティックなテクニカルスコアであり、校正された確率ではありません。',
      highVolume: '出来高が10日平均を显著に上回る',
      lowVolume: '出来高に変動なし',
  aiConfidenceMeter: 'AI 信頼度メーター',
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
      ma10Line: '10日移動平均線',
      openPrice: '始値',
      highPrice: '高値',
      lowPrice: '安値',
      closePrice: '終値',

      backtestingAccuracy: '過去30日間のバックテスト勝率',
      past30Days: '過去30日間',
      algorithmSuccessRate: 'アルゴリズム的中率',
      confidenceExtreme: '極めて高い',
      confidenceHigh: '高い',
      confidenceModerate: '普通',
      confidenceLow: '低い',
      correctPredictions: '30日的中率',
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
    '各指標は現在のウォッチリスト内で横断面標準化（平均0、σ1）され、大きいほど強い向きに符号調整した上で合成されます：テクニカル45%（1M/3Mモメンタム、価格vs SMA50、52週高値からの距離、出来高トレンド）、ファンダメンタル35%（売上/利益成長、利益率、ROE、負債比率）、オプション20%（プット/コール残高スキュー）。欠損カテゴリは重みを再正規化して除外し、補完は行いません。Zスコアはこのリスト内の相対値であり市場全体との比較ではありません。',
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
      estimatedWindow: 'Couloir de Volatilité (95% IC)',
      bullish: 'Haussier',
      bearish: 'Baissier',
      neutral: 'Neutre',
      testPrediction1000: 'Tester la Prédiction avec 1 000 $',
      testCustomTrade: 'Simulation Personnalisée',

      technicalChecklist: 'LISTE DES INDICATEURS TECHNIQUES',
      technicalMathExplanation: 'Facteurs Mathématiques de l\'Algorithme',
      ma10Crossover: 'Moyenne Mobile 10 Jours (MA10)',
      rsiMomentum: 'Oscillateur RSI 14 Jours',
      volumeSurge: 'Pic Relatif de Volume',
      volatilitySentiment: 'Volatilité & Sentiment des Nouvelles',
      formulaDetails: 'Formule & Pondération',
      detected: 'Actif',
      notDetected: 'Inactif',
      oversold: 'Survendu (<30)',
      overbought: 'Suracheté (>70)',
      momentumPositive: 'Momentum Positif',
      momentumNegative: 'Momentum Négatif',
      aboveMA10: 'Prix au-dessus du MA10',
      belowMA10: 'Prix sous le MA10',
      sma50Trend: 'Moyenne Mobile 50 Jours',
      aboveSMA50: 'Prix au-dessus du MM50',
      belowSMA50: 'Prix sous le MM50',
      modelDisclaimer: 'Score technique heuristique — pas une probabilité calibrée.',
      highVolume: 'Volume élevé vs moyenne 10 jours',
      lowVolume: 'Volume normal',
  aiConfidenceMeter: 'INDICE DE CONFIANCE IA',
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
      ma10Line: 'Ligne MA10',
      openPrice: 'Ouverture',
      highPrice: 'Plus Haut',
      lowPrice: 'Plus Bas',
      closePrice: 'Clôture',

      backtestingAccuracy: 'PRÉCISION DU BACKTESTING (30J)',
      past30Days: '30 Derniers Jours',
      algorithmSuccessRate: 'Taux de Réussite',
      confidenceExtreme: 'EXTRÊME',
      confidenceHigh: 'ÉLEVÉ',
      confidenceModerate: 'MODÉRÉ',
      confidenceLow: 'FAIBLE',
      correctPredictions: 'Précision sur 30J',
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
    'Chaque indicateur est standardisé en un z-score transversal dans votre watchlist actuelle (moyenne 0, σ 1), ajusté en signe afin que plus haut signifie toujours plus fort, puis combiné : technique 45% (momentum 1M/3M, prix vs SMA50, distance du plus-haut 52S, tendance de volume), fondamental 35% (croissance revenus/bénéfices, marge, ROE, dette/fonds propres), options 20% (biais des intérêts ouverts put/call). Les catégories manquantes sont exclues avec renormalisation des poids — aucune imputation. Les z-scores sont relatifs à cette liste uniquement, pas au marché.',
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
      estimatedWindow: 'Volatilitäts-Korridor (95% CI)',
      bullish: 'Bullisch',
      bearish: 'Bärisch',
      neutral: 'Neutral',
      testPrediction1000: 'Mit $1.000 simulieren',
      testCustomTrade: 'Individueller Test-Trade',

      technicalChecklist: 'TECHNISCHE INDIKATOREN-CHECKLISTE',
      technicalMathExplanation: 'Mathematische Algorithmus-Treiber',
      ma10Crossover: '10-Tage Gleitender Durchschnitt (MA10)',
      rsiMomentum: '14-Tage RSI Oszillator',
      volumeSurge: 'Relatives Volumen-Wachstum',
      volatilitySentiment: 'Volatilität & Nachrichten-Sentiment',
      formulaDetails: 'Formel & Gewichtung',
      detected: 'Aktiv',
      notDetected: 'Inaktiv',
      oversold: 'Überverkauft (<30)',
      overbought: 'Überkauft (>70)',
      momentumPositive: 'Positives Momentum',
      momentumNegative: 'Negatives Momentum',
      aboveMA10: 'Kurs über dem MA10',
      belowMA10: 'Kurs unter dem MA10',
      sma50Trend: '50-Tage Gleitender Durchschnitt',
      aboveSMA50: 'Kurs über dem SMA50',
      belowSMA50: 'Kurs unter dem SMA50',
      modelDisclaimer: 'Heuristischer technischer Score — keine kalibrierte Wahrscheinlichkeit.',
      highVolume: 'Überdurchschnittliches Volumen (10T)',
      lowVolume: 'Kein ungewöhnliches Volumen',
      aiConfidenceMeter: 'AI VERTRAUENS-INDEX',
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
      ma10Line: 'MA10 Linie',
      openPrice: 'Eröffnung',
      highPrice: 'Hoch',
      lowPrice: 'Tief',
      closePrice: 'Schluss',

      backtestingAccuracy: 'BACKTESTING-GENAUIGKEIT (30 TAGE)',
      past30Days: 'Letzte 30 Tage',
      algorithmSuccessRate: 'Erfolgsquote',
      confidenceExtreme: 'EXTREM',
      confidenceHigh: 'HOCH',
      confidenceModerate: 'MODERAT',
      confidenceLow: 'NIEDRIG',
      correctPredictions: '30-Tage Trefferquote',
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
    'Jede Kennzahl wird innerhalb Ihrer aktuellen Watchlist querschnittsstandardisiert (Mittelwert 0, σ 1), im Vorzeichen so angepasst, dass höher immer stärker bedeutet, und dann kombiniert: technisch 45% (1M/3M-Momentum, Kurs vs. SMA50, Abstand zum 52W-Hoch, Volumenstrend), fundamental 35% (Umsatz-/Gewinnwachstum, Marge, ROE, Verschuldungsgrad), Optionen 20% (Put/Call-Open-Interest-Skew). Fehlende Kategorien werden mit renormalisierten Gewichten ausgeschlossen — nichts wird interpoliert. Z-Scores beziehen sich nur auf diese Liste, nicht auf den Markt.',
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
