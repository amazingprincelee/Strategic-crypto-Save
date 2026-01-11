import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  DollarSign,
  BarChart3,
  Info
} from 'lucide-react';

const CryptoArbitrage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filters, setFilters] = useState({
    minProfit: 0.5, // Minimum profit percentage
    minVolume: 1000, // Minimum volume in USD
    search: '',
    sortBy: 'profit' // profit, volume, coin
  });
  const [showFilters, setShowFilters] = useState(false);

  // Simulated arbitrage opportunities (replace with real API call)
  const fetchArbitrageOpportunities = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with your backend endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - replace with real data from your backend
      const mockData = [
        {
          id: 1,
          coin: 'BTC',
          coinName: 'Bitcoin',
          buyExchange: 'Binance',
          sellExchange: 'Coinbase',
          buyPrice: 43250.50,
          sellPrice: 43678.30,
          profitMargin: 0.99,
          profitUSD: 427.80,
          volume: 2450000,
          volumeCoins: 56.5,
          transferEnabled: true,
          lastPrice: 43678.30,
          orderBookDepth: {
            buy: 150,
            sell: 230
          },
          timestamp: new Date()
        },
        {
          id: 2,
          coin: 'ETH',
          coinName: 'Ethereum',
          buyExchange: 'Kraken',
          sellExchange: 'Binance',
          buyPrice: 2345.60,
          sellPrice: 2367.90,
          profitMargin: 0.95,
          profitUSD: 22.30,
          volume: 1850000,
          volumeCoins: 781.2,
          transferEnabled: true,
          lastPrice: 2367.90,
          orderBookDepth: {
            buy: 320,
            sell: 450
          },
          timestamp: new Date()
        },
        {
          id: 3,
          coin: 'SOL',
          coinName: 'Solana',
          buyExchange: 'Coinbase',
          sellExchange: 'Kraken',
          buyPrice: 98.50,
          sellPrice: 99.32,
          profitMargin: 0.83,
          profitUSD: 0.82,
          volume: 892000,
          volumeCoins: 8980,
          transferEnabled: true,
          lastPrice: 99.32,
          orderBookDepth: {
            buy: 180,
            sell: 210
          },
          timestamp: new Date()
        },
        {
          id: 4,
          coin: 'USDT',
          coinName: 'Tether',
          buyExchange: 'Binance',
          sellExchange: 'Bybit',
          buyPrice: 0.9998,
          sellPrice: 1.0052,
          profitMargin: 0.54,
          profitUSD: 0.0054,
          volume: 5200000,
          volumeCoins: 5200000,
          transferEnabled: false,
          lastPrice: 1.0052,
          orderBookDepth: {
            buy: 5200,
            sell: 4800
          },
          timestamp: new Date()
        },
        {
          id: 5,
          coin: 'MATIC',
          coinName: 'Polygon',
          buyExchange: 'Bybit',
          sellExchange: 'Coinbase',
          buyPrice: 0.8456,
          sellPrice: 0.8502,
          profitMargin: 0.54,
          profitUSD: 0.0046,
          volume: 450000,
          volumeCoins: 531250,
          transferEnabled: true,
          lastPrice: 0.8502,
          orderBookDepth: {
            buy: 890,
            sell: 1020
          },
          timestamp: new Date()
        }
      ];

      // Sort by profit margin (best opportunities first)
      const sorted = mockData.sort((a, b) => b.profitMargin - a.profitMargin);
      setOpportunities(sorted);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch arbitrage opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArbitrageOpportunities();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchArbitrageOpportunities, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter and sort opportunities
  const filteredOpportunities = opportunities
    .filter(opp => {
      const matchesProfit = opp.profitMargin >= filters.minProfit;
      const matchesVolume = opp.volume >= filters.minVolume;
      const matchesSearch = opp.coin.toLowerCase().includes(filters.search.toLowerCase()) ||
                          opp.coinName.toLowerCase().includes(filters.search.toLowerCase());
      return matchesProfit && matchesVolume && matchesSearch;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'profit') return b.profitMargin - a.profitMargin;
      if (filters.sortBy === 'volume') return b.volume - a.volume;
      if (filters.sortBy === 'coin') return a.coin.localeCompare(b.coin);
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            Crypto Arbitrage Scanner
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Real-time arbitrage opportunities across multiple exchanges
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <button
            onClick={fetchArbitrageOpportunities}
            disabled={loading}
            className="btn-primary"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Last Update Info */}
      {lastUpdate && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <span className="text-xs text-gray-500">• Auto-refresh in 30s</span>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Filters & Settings
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Search Coin
              </label>
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="BTC, ETH, SOL..."
                  className="w-full pl-10 input"
                />
              </div>
            </div>

            {/* Min Profit */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Profit (%)
              </label>
              <input
                type="number"
                value={filters.minProfit}
                onChange={(e) => setFilters(prev => ({ ...prev, minProfit: parseFloat(e.target.value) }))}
                step="0.1"
                min="0"
                className="w-full input"
              />
            </div>

            {/* Min Volume */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Volume (USD)
              </label>
              <input
                type="number"
                value={filters.minVolume}
                onChange={(e) => setFilters(prev => ({ ...prev, minVolume: parseFloat(e.target.value) }))}
                step="100"
                min="0"
                className="w-full input"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort By
            </label>
            <div className="flex gap-2">
              {['profit', 'volume', 'coin'].map(sortOption => (
                <button
                  key={sortOption}
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: sortOption }))}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filters.sortBy === sortOption
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-brandDark-700 dark:text-gray-300 dark:hover:bg-brandDark-600'
                  }`}
                >
                  {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="p-4 border-l-4 rounded-lg bg-blue-50 border-blue-500 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <Info className="flex-shrink-0 w-5 h-5 text-blue-500 dark:text-blue-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              How it works
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Our scanner finds price differences for the same cryptocurrency across exchanges. 
              Buy low on one exchange, sell high on another. The best opportunities with enabled 
              transfers are shown at the top. Volume shows how much you can sell at the last price.
            </p>
          </div>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="card overflow-hidden p-0">
        {loading && opportunities.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 text-primary-600 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">Scanning exchanges...</p>
            </div>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">No opportunities found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-brandDark-800">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    Coin
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    Buy Exchange
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    Sell Exchange
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
                    Buy Price
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
                    Sell Price
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
                    Profit %
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
                    Volume (USD)
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400">
                    Transfer
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-brandDark-900 dark:divide-brandDark-700">
                {filteredOpportunities.map((opp, index) => (
                  <tr 
                    key={opp.id}
                    className={`hover:bg-gray-50 dark:hover:bg-brandDark-800 transition-colors ${
                      index === 0 && opp.transferEnabled ? 'bg-green-50 dark:bg-green-900/10' : ''
                    }`}
                  >
                    {/* Coin */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 mr-3 font-bold text-white rounded-full bg-gradient-to-br from-primary-500 to-secondary-500">
                          {opp.coin.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {opp.coin}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {opp.coinName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Buy Exchange */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {opp.buyExchange}
                      </span>
                    </td>

                    {/* Sell Exchange */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-300">
                        {opp.sellExchange}
                      </span>
                    </td>

                    {/* Buy Price */}
                    <td className="px-4 py-4 text-sm text-right text-gray-900 whitespace-nowrap dark:text-white">
                      ${opp.buyPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                    </td>

                    {/* Sell Price */}
                    <td className="px-4 py-4 text-sm text-right text-gray-900 whitespace-nowrap dark:text-white">
                      ${opp.sellPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                    </td>

                    {/* Profit Margin */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-right">
                        <div className="inline-flex items-center px-2 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded dark:bg-green-900 dark:text-green-300">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {opp.profitMargin.toFixed(2)}%
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          +${opp.profitUSD.toFixed(2)}
                        </div>
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ${(opp.volume / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {opp.volumeCoins.toLocaleString(undefined, { maximumFractionDigits: 2 })} {opp.coin}
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <BarChart3 className="w-3 h-3" />
                          <span>Depth: {opp.orderBookDepth.sell}</span>
                        </div>
                      </div>
                    </td>

                    {/* Transfer Status */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      {opp.transferEnabled ? (
                        <CheckCircle className="inline-block w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="inline-block w-5 h-5 text-red-500" />
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <button
                        disabled={!opp.transferEnabled}
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                          opp.transferEnabled
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                        }`}
                      >
                        Execute
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Opportunities</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {filteredOpportunities.length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Profit Margin</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {filteredOpportunities.length > 0
                  ? (filteredOpportunities.reduce((acc, opp) => acc + opp.profitMargin, 0) / filteredOpportunities.length).toFixed(2)
                  : '0.00'}%
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Transfers</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {filteredOpportunities.filter(opp => opp.transferEnabled).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                ${(filteredOpportunities.reduce((acc, opp) => acc + opp.volume, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoArbitrage;