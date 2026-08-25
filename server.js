/**
 * DEV-ONLY server. Production runs the equivalent logic as Vercel
 * Serverless Functions in /api/yahoo/** — both import the same
 * shared module in api/_lib/yahoo.ts so behavior cannot drift.
 *
 * Run with: tsx server.js   (tsx handles the .ts import)
 */
import express from 'express';
import { fetchChart, fetchFundamentals, fetchNews, fetchOptions, PUBLIC_CACHE_CONTROL } from './api/_lib/yahoo';

const app = express();
const port = Number(process.env.PORT || 3005);

app.get('/api/yahoo/chart/:symbol', async (req, res) => {
  const range = String(req.query.range || '1mo');
  const interval = String(req.query.interval || '1d');

  const upstream = await fetchChart(req.params.symbol, range, interval);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.status(upstream.status).send(upstream.body);
});

app.get('/api/yahoo/fundamentals/:symbol', async (req, res) => {
  const upstream = await fetchFundamentals(req.params.symbol);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
  res.status(upstream.status).send(upstream.body);
});

app.get('/api/yahoo/news/:symbol', async (req, res) => {
  const count = Number(req.query.count || '15');
  const upstream = await fetchNews(req.params.symbol, count);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
  res.status(upstream.status).send(upstream.body);
});

app.get('/api/yahoo/options/:symbol', async (req, res) => {
  const upstream = await fetchOptions(req.params.symbol);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1800');
  res.status(upstream.status).send(upstream.body);
});

app.listen(port, () => {
  console.log(`Yahoo proxy server running on http://localhost:${port}`);
});
