import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart,
} from 'lucide-react';
import { Stock, Timeframe, StockDataPoint, CurrencyInfo } from '../types';
import { TranslationDict } from '../utils/translations';
import { formatCurrencyValue } from '../utils/currencies';
import { fetchChartSeries } from '../data/chartSeries';

interface LivePriceChartProps {
  stock: Stock;
  currency: CurrencyInfo;
  t: TranslationDict;
}

export const LivePriceChart: React.FC<LivePriceChartProps> = ({ stock, currency, t }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1M');
  const [showEMA9, setShowEMA9] = useState(true);
  const [showEMA20, setShowEMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [showSMA200, setShowSMA200] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showVolumeProfile, setShowVolumeProfile] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<StockDataPoint | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Per-timeframe series cache: key = "TICKER|TF" -> real Yahoo candles.
  const [seriesCache, setSeriesCache] = useState<Record<string, StockDataPoint[]>>({});
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [seriesError, setSeriesError] = useState(false);

  useEffect(() => {
    const key = `${stock.ticker.toUpperCase()}|${selectedTimeframe}`;
    if (seriesCache[key]) return;

    const controller = new AbortController();
    setSeriesLoading(true);
    setSeriesError(false);

    fetchChartSeries(stock.ticker, selectedTimeframe, controller.signal)
      .then((points) => {
        if (controller.signal.aborted) return;
        setSeriesCache((prev) => ({ ...prev, [key]: points ?? [] }));
        setSeriesError(points === null);
        setSeriesLoading(false);
      })
      .catch((err) => {
        if ((err as Error)?.name === 'AbortError') return;
        setSeriesCache((prev) => ({ ...prev, [key]: [] }));
        setSeriesError(true);
        setSeriesLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock.ticker, selectedTimeframe]);

  const cacheKey = `${stock.ticker.toUpperCase()}|${selectedTimeframe}`;
  const dataPoints: StockDataPoint[] = useMemo(
    () => seriesCache[cacheKey] ?? [],
    [seriesCache, cacheKey]
  );

  const firstPoint = dataPoints[0];
  const lastPoint = dataPoints[dataPoints.length - 1];
  const activePoint = hoveredPoint || lastPoint;
  const livePrice = stock.currentPrice > 0 ? stock.currentPrice : lastPoint?.close ?? 0;

  const isPeriodPositive = lastPoint && firstPoint ? livePrice >= firstPoint.close : true;
  const periodChange = lastPoint && firstPoint ? livePrice - firstPoint.close : 0;
  const periodChangePercent = firstPoint && firstPoint.close > 0 ? (periodChange / firstPoint.close) * 100 : 0;

  const chartThemeColor = isPeriodPositive ? '#10b981' : '#ef4444';
  const chartFillGradientId = isPeriodPositive ? 'emerald-gradient' : 'rose-gradient';

  // SVG Chart Geometry
  const width = 800;
  const height = 340;
  const padding = { top: 20, right: 30, bottom: 65, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const volumeHeight = 55;

  const { minPrice, maxPrice, maxVolume, pricePoints, ema9Points, ema20Points, sma50Points, sma200Points, volumeBars } = useMemo(() => {
    if (dataPoints.length === 0) {
      return { minPrice: 0, maxPrice: 100, maxVolume: 1000, pricePoints: [], ema9Points: [], ema20Points: [], sma50Points: [], sma200Points: [], volumeBars: [] };
    }

    let minP = Infinity;
    let maxP = -Infinity;
    let maxV = 0;

    dataPoints.forEach((p) => {
      if (p.low < minP) minP = p.low;
      if (p.high > maxP) maxP = p.high;
      if (p === lastPoint && livePrice < minP) minP = livePrice;
      if (p === lastPoint && livePrice > maxP) maxP = livePrice;
      [p.ema9, p.ema20, p.sma50, p.sma200].forEach((value) => {
        if (value !== undefined && value < minP) minP = value;
        if (value !== undefined && value > maxP) maxP = value;
      });
      if (p.volume > maxV) maxV = p.volume;
    });

    const priceBuffer = (maxP - minP) * 0.08 || 1;
    minP = Math.max(0, minP - priceBuffer);
    maxP = maxP + priceBuffer;

    const pricePts = dataPoints.map((p, i) => {
      const x = padding.left + (i / (dataPoints.length - 1 || 1)) * chartWidth;
      const close = i === dataPoints.length - 1 ? livePrice : p.close;
      const y = padding.top + chartHeight - ((close - minP) / (maxP - minP || 1)) * chartHeight;
      return { x, y, point: p };
    });

    const indicatorPoints = (key: 'ema9' | 'ema20' | 'sma50' | 'sma200') => dataPoints.flatMap((p, i) => {
      const value = p[key];
      if (value === undefined) return [];
      const x = padding.left + (i / (dataPoints.length - 1 || 1)) * chartWidth;
      const y = padding.top + chartHeight - ((value - minP) / (maxP - minP || 1)) * chartHeight;
      return [{ x, y }];
    });

    const volBars = dataPoints.map((p, i) => {
      const x = padding.left + (i / (dataPoints.length - 1 || 1)) * chartWidth;
      const barH = (p.volume / (maxV || 1)) * volumeHeight;
      const y = height - padding.bottom + (volumeHeight - barH);
      return { x, y, height: barH, isUp: p.close >= p.open };
    });

    return { minPrice: minP, maxPrice: maxP, maxVolume: maxV, pricePoints: pricePts, ema9Points: indicatorPoints('ema9'), ema20Points: indicatorPoints('ema20'), sma50Points: indicatorPoints('sma50'), sma200Points: indicatorPoints('sma200'), volumeBars: volBars };
  }, [dataPoints, chartWidth, chartHeight, padding, height, width, lastPoint, livePrice]);

  /**
   * Volume Profile (VPVR-style): distribute each session's volume across
   * horizontal price buckets. Bar length ≈ how many shares changed hands at
   * that level → a proxy for where investors' holding cost is concentrated.
   *
   * Each bar is SPLIT by session direction (TradingView-style):
   *  - green segment = volume traded on UP days (buying dominance)
   *  - red segment   = volume traded on DOWN days (selling dominance)
   *
   * The highest-volume bucket is the Point of Control (POC) — the strongest
   * "cost magnet" where the most capital is parked. A dashed reference line
   * marks the current price: levels below it are held at an average profit,
   * levels above it at an average loss.
   */
  const PRICE_BUCKETS = 28;
  const VP_MAX_WIDTH = 110; // SVG units, drawn inward from the right edge

  const { volumeProfileRows, poc, currentPriceY } = useMemo(() => {
    if (!showVolumeProfile || dataPoints.length === 0 || !(maxPrice > minPrice)) {
      return { volumeProfileRows: [], poc: null as null | { y: number }, currentPriceY: null as null | number };
    }

    const n = PRICE_BUCKETS;
    const bucketSize = (maxPrice - minPrice) / n;
    const totalVols = new Array<number>(n).fill(0);
    const upVols = new Array<number>(n).fill(0);
    const downVols = new Array<number>(n).fill(0);

    for (const p of dataPoints) {
      let idx = Math.floor((p.close - minPrice) / bucketSize);
      if (!Number.isFinite(idx)) continue;
      idx = Math.min(n - 1, Math.max(0, idx));
      totalVols[idx] += p.volume;
      if (p.close >= p.open) upVols[idx] += p.volume;
      else downVols[idx] += p.volume;
    }
    const maxBucketVol = Math.max(...totalVols);
    if (maxBucketVol <= 0) return { volumeProfileRows: [], poc: null, currentPriceY: null };

    const refPrice = stock.currentPrice || dataPoints[dataPoints.length - 1].close;
    const refY =
      padding.top +
      chartHeight -
      ((refPrice - minPrice) / (maxPrice - minPrice)) * chartHeight;

    const rows = totalVols.map((vol, i) => {
      const low = minPrice + i * bucketSize;
      const high = low + bucketSize;
      const center = low + bucketSize / 2;
      const yTop =
        padding.top + chartHeight - ((high - minPrice) / (maxPrice - minPrice)) * chartHeight;
      const h = Math.max(2, (bucketSize / (maxPrice - minPrice)) * chartHeight - 1);
      const w = Math.max(3, (vol / maxBucketVol) * VP_MAX_WIDTH);
      // Green hugs the right edge; red extends leftward.
      const upW = vol > 0 ? Math.min(w, Math.max(0.5, (upVols[i] / vol) * w)) : 0;
      const downW = w - upW;
      return {
        key: i,
        x: width - padding.right - w,
        y: yTop,
        width: w,
        upWidth: upW,
        downWidth: downW,
        height: h,
        center,
        volume: vol,
        upShare: vol > 0 ? upVols[i] / vol : 0,
        isPoc: vol === maxBucketVol,
      };
    });

    const pocRow = rows[totalVols.indexOf(maxBucketVol)];
    return {
      volumeProfileRows: rows,
      poc: { y: pocRow.y + pocRow.height / 2 },
      currentPriceY: refY,
    };
  }, [
    showVolumeProfile,
    dataPoints,
    minPrice,
    maxPrice,
    chartHeight,
    padding.top,
    padding.right,
    width,
    stock.currentPrice,
  ]);

  // Construct SVG Path strings
  const linePath = useMemo(() => {
    if (pricePoints.length === 0) return '';
    return pricePoints.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');
  }, [pricePoints]);

  const areaPath = useMemo(() => {
    if (pricePoints.length === 0) return '';
    const bottomY = padding.top + chartHeight;
    const firstX = pricePoints[0].x;
    const lastX = pricePoints[pricePoints.length - 1].x;
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [linePath, pricePoints, padding.top, chartHeight]);

  const makeIndicatorPath = (points: { x: number; y: number }[]) =>
    points.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`), '');
  const ema9Path = makeIndicatorPath(ema9Points);
  const ema20Path = makeIndicatorPath(ema20Points);
  const sma50Path = makeIndicatorPath(sma50Points);
  const sma200Path = makeIndicatorPath(sma200Points);

  // Mouse move handler for crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || dataPoints.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    // Scale to viewBox coordinates
    const scaleX = width / rect.width;
    const svgX = clientX * scaleX;

    const boundedX = Math.max(padding.left, Math.min(width - padding.right, svgX));
    const ratio = (boundedX - padding.left) / chartWidth;
    const index = Math.min(dataPoints.length - 1, Math.max(0, Math.round(ratio * (dataPoints.length - 1))));

    setHoverIndex(index);
    setHoveredPoint(dataPoints[index]);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setHoveredPoint(null);
  };

  const timeframes: Timeframe[] = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'ALL'];

  return (
    <div
      id="live-price-chart-panel"
      className="bg-[#0e1628] border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col"
    >
      {/* Top Header & Timeframe Selector (Yahoo Style) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <BarChart className="w-4 h-4 text-emerald-400" />
              {t.livePriceGraph}
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
              {stock.ticker}
            </span>
          </div>

          {/* Active Price & Period Change Info */}
          <div className="flex items-baseline gap-3 mt-1">
            <div className="text-2xl font-black text-slate-100 font-mono">
              {formatCurrencyValue(hoveredPoint ? activePoint?.close ?? livePrice : livePrice, currency)}
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-bold font-mono ${
                periodChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {periodChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>
                {periodChange >= 0 ? '+' : ''}
                {formatCurrencyValue(periodChange, currency)} ({periodChange >= 0 ? '+' : ''}
                {periodChangePercent.toFixed(1)}%)
              </span>
              <span className="text-[10px] text-slate-500 font-normal ml-1">
                [{selectedTimeframe}]
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe Buttons Bar */}
        <div className="flex items-center flex-wrap gap-1 bg-[#09101d] p-1 rounded-xl border border-slate-800">
          {timeframes.map((tf) => (
            <button
              key={tf}
              type="button"
              id={`btn-timeframe-${tf}`}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedTimeframe === tf
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950 font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {t[`timeframe${tf}` as keyof TranslationDict] || tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full aspect-[2.4/1] min-h-[260px] my-2 select-none">
        {(seriesLoading || (seriesError && dataPoints.length === 0)) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0f1d]/60 rounded-xl">
            {seriesLoading ? (
              <span className="text-xs font-mono text-cyan-400 animate-pulse">Loading live data…</span>
            ) : (
              <span className="text-xs font-mono text-rose-400">Live data unavailable for this range.</span>
            )}
          </div>
        )}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="emerald-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="rose-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + chartHeight * ratio;
            const priceVal = maxPrice - ratio * (maxPrice - minPrice);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {formatCurrencyValue(priceVal, currency, 1)}
                </text>
              </g>
            );
          })}

          {/* Volume Profile — holding-cost distribution.
              Each bar: red = down-day volume (selling), green = up-day volume (buying). */}
          {showVolumeProfile &&
            volumeProfileRows.map((row) => (
              <g key={`vp-${row.key}`}>
                {/* Selling pressure — left segment */}
                {row.downWidth > 0.5 && (
                  <rect
                    x={row.x}
                    y={row.y}
                    width={row.downWidth}
                    height={row.height}
                    rx="1"
                    fill="#ef4444"
                    opacity={row.isPoc ? 0.55 : 0.35}
                  >
                    <title>
                      {`${formatCurrencyValue(row.center, currency)} · ${t.volume}: ${(
                        row.volume / 1000000
                      ).toFixed(1)}M · ▼ ${Math.round((1 - row.upShare) * 100)}%`}
                    </title>
                  </rect>
                )}
                {/* Buying pressure — right segment, hugging the price axis */}
                {row.upWidth > 0.5 && (
                  <rect
                    x={row.x + row.downWidth}
                    y={row.y}
                    width={row.upWidth}
                    height={row.height}
                    rx="1"
                    fill="#10b981"
                    opacity={row.isPoc ? 0.6 : 0.4}
                  >
                    <title>
                      {`${formatCurrencyValue(row.center, currency)} · ${t.volume}: ${(
                        row.volume / 1000000
                      ).toFixed(1)}M · ▲ ${Math.round(row.upShare * 100)}%`}
                    </title>
                  </rect>
                )}
              </g>
            ))}

          {/* Current price reference line — below it holders are in profit, above at a loss */}
          {showVolumeProfile && currentPriceY !== null && (
            <g pointerEvents="none">
              <line
                x1={padding.left}
                y1={currentPriceY}
                x2={width - padding.right}
                y2={currentPriceY}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.5"
              />
            </g>
          )}

          {/* Point of Control marker — price level with the most traded volume */}
          {showVolumeProfile && poc && (
            <g pointerEvents="none">
              <line
                x1={padding.left}
                y1={poc.y}
                x2={width - padding.right}
                y2={poc.y}
                stroke="#fbbf24"
                strokeWidth="1"
                strokeDasharray="6 4"
                opacity="0.65"
              />
              <text
                x={padding.left + 4}
                y={poc.y - 4}
                fill="#fbbf24"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
                opacity="0.9"
              >
                POC
              </text>
            </g>
          )}

          {/* Volume bars */}
          {showVolume &&
            volumeBars.map((bar, i) => (
              <rect
                key={i}
                x={bar.x - 2}
                y={bar.y}
                width="4"
                height={Math.max(1, bar.height)}
                fill={bar.isUp ? '#10b981' : '#ef4444'}
                opacity={hoverIndex === i ? 0.8 : 0.3}
                rx="1"
              />
            ))}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#${chartFillGradientId})`} />

          {/* Main Price Line */}
          <path
            d={linePath}
            fill="none"
            stroke={chartThemeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {pricePoints.length > 0 && (
            <circle
              cx={pricePoints[pricePoints.length - 1].x}
              cy={pricePoints[pricePoints.length - 1].y}
              r="3.5"
              fill={chartThemeColor}
              stroke="#f8fafc"
              strokeWidth="1.5"
            >
              <title>{`Live price: ${formatCurrencyValue(livePrice, currency)}`}</title>
            </circle>
          )}

          {showEMA9 && <path d={ema9Path} fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.9" />}
          {showEMA20 && <path d={ema20Path} fill="none" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.9" />}
          {showSMA50 && <path d={sma50Path} fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.9" />}
          {showSMA200 && <path d={sma200Path} fill="none" stroke="#f472b6" strokeWidth="1.7" strokeDasharray="5 3" opacity="0.9" />}

          {/* Hover Crosshair and Indicator Dot */}
          {hoverIndex !== null && pricePoints[hoverIndex] && (
            <g>
              {/* Vertical line */}
              <line
                x1={pricePoints[hoverIndex].x}
                y1={padding.top}
                x2={pricePoints[hoverIndex].x}
                y2={height - padding.bottom + volumeHeight}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                strokeWidth="1"
              />

              {/* Horizontal line */}
              <line
                x1={padding.left}
                y1={pricePoints[hoverIndex].y}
                x2={width - padding.right}
                y2={pricePoints[hoverIndex].y}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                strokeWidth="1"
              />

            </g>
          )}

          {/* X Axis Dates */}
          {pricePoints.map((pt, i) => {
            // Show ~6 date labels
            const step = Math.floor(pricePoints.length / 5) || 1;
            if (i % step === 0 || i === pricePoints.length - 1) {
              return (
                <text
                  key={i}
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {pt.point.date}
                </text>
              );
            }
            return null;
          })}
        </svg>

        {/* Hover Tooltip Card Floating */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-slate-900/95 border border-slate-700 rounded-xl p-2.5 shadow-2xl backdrop-blur-md text-xs font-mono z-30 pointer-events-none min-w-[180px]">
            <div className="text-[11px] text-slate-400 border-b border-slate-800 pb-1 mb-1.5 flex justify-between">
              <span>{hoveredPoint.date}</span>
              <span className="text-emerald-400">{selectedTimeframe}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
              <span className="text-slate-400">Close:</span>
              <span className="text-slate-100 font-bold text-right">
                {formatCurrencyValue(hoveredPoint.close, currency)}
              </span>
              <span className="text-slate-400">Open:</span>
              <span className="text-slate-300 text-right">
                {formatCurrencyValue(hoveredPoint.open, currency)}
              </span>
              <span className="text-slate-400">High:</span>
              <span className="text-slate-300 text-right">
                {formatCurrencyValue(hoveredPoint.high, currency)}
              </span>
              <span className="text-slate-400">Low:</span>
              <span className="text-slate-300 text-right">
                {formatCurrencyValue(hoveredPoint.low, currency)}
              </span>
              {showEMA9 && hoveredPoint.ema9 !== undefined && (
                <><span className="text-yellow-400">9 EMA:</span><span className="text-yellow-300 text-right">{formatCurrencyValue(hoveredPoint.ema9, currency)}</span></>
              )}
              {showEMA20 && hoveredPoint.ema20 !== undefined && (
                <><span className="text-orange-400">20 EMA:</span><span className="text-orange-300 text-right">{formatCurrencyValue(hoveredPoint.ema20, currency)}</span></>
              )}
              {showSMA50 && hoveredPoint.sma50 !== undefined && (
                <><span className="text-purple-400">50 SMA:</span><span className="text-purple-300 text-right">{formatCurrencyValue(hoveredPoint.sma50, currency)}</span></>
              )}
              {showSMA200 && hoveredPoint.sma200 !== undefined && (
                <><span className="text-pink-400">200 SMA:</span><span className="text-pink-300 text-right">{formatCurrencyValue(hoveredPoint.sma200, currency)}</span></>
              )}
              {showVolume && (
                <>
                  <span className="text-slate-400">Volume:</span>
                  <span className="text-slate-300 text-right">
                    {(hoveredPoint.volume / 1000000).toFixed(2)}M
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chart Toggles Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-4">
          {[
            ['9 EMA', showEMA9, setShowEMA9, 'accent-yellow-400', 'text-yellow-400', 'bg-yellow-400'],
            ['20 EMA', showEMA20, setShowEMA20, 'accent-orange-400', 'text-orange-400', 'bg-orange-400'],
            ['50 SMA', showSMA50, setShowSMA50, 'accent-purple-400', 'text-purple-400', 'bg-purple-400'],
            ['200 SMA', showSMA200, setShowSMA200, 'accent-pink-400', 'text-pink-400', 'bg-pink-400'],
          ].map(([label, checked, setChecked, accent, text, dot]) => (
            <label key={label as string} className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
              <input
                type="checkbox"
                checked={checked as boolean}
                onChange={(e) => (setChecked as React.Dispatch<React.SetStateAction<boolean>>)(e.target.checked)}
                className={`${accent} rounded`}
              />
              <span className={`flex items-center gap-1 ${text} font-medium`}>
                <span className={`w-2.5 h-0.5 ${dot} inline-block`}></span>
                {label as string}
              </span>
            </label>
          ))}

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
            <input
              type="checkbox"
              checked={showVolume}
              onChange={(e) => setShowVolume(e.target.checked)}
              className="accent-emerald-400 rounded"
            />
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <span className="w-2 h-2 bg-emerald-400/80 inline-block rounded-xs"></span>
              {t.volume}
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
            <input
              type="checkbox"
              checked={showVolumeProfile}
              onChange={(e) => setShowVolumeProfile(e.target.checked)}
              className="accent-purple-400 rounded"
            />
            <span
              className="flex items-center gap-1 text-purple-300 font-medium"
              title={
                typeof t.volumeProfile === 'string'
                  ? `${t.volumeProfile}: ▮ green = up-day volume, ▮ red = down-day volume · dashed line = current price`
                  : undefined
              }
            >
              <span className="inline-flex gap-[2px] items-end">
                <span className="w-1.5 h-3 bg-emerald-400/80 inline-block rounded-[1px]"></span>
                <span className="w-1.5 h-3 bg-rose-400/80 inline-block rounded-[1px]"></span>
              </span>
              {t.volumeProfile}
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span>52W Low: {formatCurrencyValue(stock.low52w, currency)}</span>
          <span className="text-slate-600">|</span>
          <span>52W High: {formatCurrencyValue(stock.high52w, currency)}</span>
        </div>
      </div>
    </div>
  );
};
