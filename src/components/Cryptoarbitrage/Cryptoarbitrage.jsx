import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  RefreshCw,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  XCircle,
  Search,
  DollarSign,
  BarChart3,
  Info,
  Clock
} from 'lucide-react';
import { 
  fetchArbitrageOpportunities,
  clearArbitrageMessages 
} from '../../redux/slices/arbitrageslice';
import ArbitrageSettings from '../../components/Cryptoarbitrage/Arbitragesettings';

const CryptoArbitrage = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { 
    opportunities = [], 
    loading = {}, 
    error, 
    successMessage,
    lastUpdate 
  } = useSelector((state) => state.arbitrage || {});

  // Settings state
  const [settings, setSettings] = useState({
    minProfit: 0.1,
    minVolume: 100,
    topCoins: 50
  });

  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'profit'
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [scanTime, setScanTime] = useState(null);

  // Fetch opportunities on mount and settings change
  useEffect(() => {
    handleFetchOpportunities();
    
    // Auto-refresh every 2 minutes (CoinGecko rate limit consideration)
    const interval = setInterval(() => {
      handleFetchOpportunities(true);
    }, 120000);
    
    return () => clearInterval(interval);
  }, [settings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle success messages
  useEffect(() => {
    if (successMessage) {
      setSuccessMsg(successMessage);
      dispatch(clearArbitrageMessages());
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  }, [successMessage, dispatch]);

  // Fetch opportunities with current settings
  const handleFetchOpportunities = (silent = false) => {
    const startTime = Date.now();
    
    const params = {
      minProfit: settings.minProfit,
      minVolume: settings.minVolume,
      topCoins: settings.topCoins
    };
    
    dispatch(fetchArbitrageOpportunities(params));
    
    if (!silent) {
      setSuccessMsg(`Scanning top ${settings.topCoins} coins...`);
      setTimeout(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        setScanTime(elapsed);
      }, 100);
    }
  };

  // Handle settings save
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    setSuccessMsg('Settings saved! Rescanning...');
    
    // Will trigger useEffect to refetch
  };

  // Handle settings reset
  const handleResetSettings = (defaultSettings) => {
    setSettings(defaultSettings);
    setSuccessMsg('Settings reset to default');
  };

  // Force refresh
  const forceRefresh = () => {
    handleFetchOpportunities();
    setSuccessMsg('Force refreshing...');
  };

  // Filter and sort opportunities
  const filteredOpportunities = (opportunities || [])
    .filter(opp => {
      const matchesSearch = opp.coin.toLowerCase().includes(filters.search.toLowerCase()) ||
                          opp.coinName.toLowerCase().includes(filters.search.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'profit') return b.profitMargin - a.profitMargin;
      if (filters.sortBy === 'volume') return b.volume - a.volume;
      if (filters.sortBy === 'coin') return a.coin.localeCompare(b.coin);
      return 0;
    });

  // Calculate stats
  const calculatedStats = {
    totalOpportunities: filteredOpportunities.length,
    avgProfitMargin: filteredOpportunities.length > 0
      ? filteredOpportunities.reduce((acc, opp) => acc + opp.profitMargin, 0) / filteredOpportunities.length
      : 0,
    totalVolume: filteredOpportunities.reduce((acc, opp) => acc + opp.volume, 0),
    bestOpportunity: filteredOpportunities[0] || null
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
              Crypto Arbitrage Scanner
            </h1>
            {!loading.opportunities && (
              <div className="relative flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-ping"></div>
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Real-time arbitrage opportunities powered by CoinGecko API
          </p>
          {lastUpdate && (
            <div className="flex items-center gap-4 mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Last updated: {new Date(lastUpdate).toLocaleTimeString()}
              </p>
              {scanTime && (
                <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                  <Clock className="w-3 h-3" />
                  Scan time: {scanTime}s
                </p>
              )}
            </div>
          )}
        </div>
        <button
          onClick={forceRefresh}
          disabled={loading.opportunities}
          className="btn-primary"
          title="Force refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading.opportunities ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="flex items-start gap-3 p-4 border-l-4 border-green-500 rounded-lg bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-700 dark:text-green-300">{successMsg}</p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-4 border-l-4 border-red-500 rounded-lg bg-red-50 dark:bg-red-900/20">
          <XCircle className="flex-shrink-0 w-5 h-5 text-red-600 dark:text-red-400" />
          <div className="flex-1">
            <h3 className="font-medium text-red-800 dark:text-red-200">Error Loading Data</h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={forceRefresh}
              className="mt-2 text-sm font-medium text-red-800 underline dark:text-red-200 hover:text-red-900"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 border-l-4 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
        <Info className="flex-shrink-0 w-5 h-5 text-blue-600 dark:text-blue-400" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">Powered by CoinGecko FREE API</p>
          <ul className="mt-2 ml-4 space-y-1 list-disc">
            <li>Fetching prices from <strong>50+ exchanges</strong> in realtime</li>
            <li>No API key required - completely free!</li>
            <li>Scanning top <strong>{settings.topCoins} coins</strong> by market cap</li>
            <li>Current thresholds: <strong>{settings.minProfit}% profit</strong>, <strong>${settings.minVolume} volume</strong></li>
          </ul>
        </div>
      </div>

      {/* Settings Panel */}
      <ArbitrageSettings
        currentSettings={settings}
        onSave={handleSaveSettings}
        onReset={handleResetSettings}
      />

      {/* Search and Sort */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search coins (BTC, ETH, SOL...)"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 input"
          />
        </div>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="input sm:w-48"
        >
          <option value="profit">Sort by Profit</option>
          <option value="volume">Sort by Volume</option>
          <option value="coin">Sort by Coin</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Opportunities</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {calculatedStats.totalOpportunities}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Profit</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {calculatedStats.avgProfitMargin.toFixed(2)}%
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                ${(calculatedStats.totalVolume / 1000000).toFixed(1)}M
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Profit</p>
              <p className="mt-1 text-2xl font-bold text-purple-600">
                {calculatedStats.bestOpportunity ? `${calculatedStats.bestOpportunity.profitMargin.toFixed(2)}%` : 'N/A'}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="card">
        {loading.opportunities && (!opportunities || opportunities.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-12 h-12 mb-4 animate-spin text-primary-600" />
            <p className="text-gray-600 dark:text-gray-400">
              Scanning top {settings.topCoins} coins across 50+ exchanges...
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              This may take ~{Math.ceil(settings.topCoins * 1.2 / 60)} minutes
            </p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="py-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              {error ? 'Failed to Load Data' : 'No Opportunities Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {error 
                ? 'Please check your connection and try again' 
                : `Try lowering your profit threshold (currently ${settings.minProfit}%) or scanning more coins`
              }
            </p>
            {error && (
              <button onClick={forceRefresh} className="mt-4 btn-primary">
                Retry
              </button>
            )}
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
                    Volume
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-brandDark-900 dark:divide-brandDark-700">
                {filteredOpportunities.map((opp, index) => (
                  <tr 
                    key={opp.id || index}
                    className={`hover:bg-gray-50 dark:hover:bg-brandDark-800 transition-colors ${
                      index === 0 ? 'bg-green-50 dark:bg-green-900/10' : ''
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 mr-3 font-bold text-white rounded-full bg-gradient-to-br from-primary-500 to-secondary-500">
                          {opp.coin?.charAt(0) || '?'}
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

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {opp.buyExchange}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-300">
                        {opp.sellExchange}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-right text-gray-900 whitespace-nowrap dark:text-white">
                      ${opp.buyPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                    </td>

                    <td className="px-4 py-4 text-sm text-right text-gray-900 whitespace-nowrap dark:text-white">
                      ${opp.sellPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-right">
                        <div className="inline-flex items-center px-2 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded dark:bg-green-900 dark:text-green-300">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {opp.profitMargin?.toFixed(2)}%
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          +${opp.profitUSD?.toFixed(2)}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ${((opp.volume || 0) / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {opp.volumeCoins?.toLocaleString(undefined, { maximumFractionDigits: 2 })} {opp.coin}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
                      >
                        View
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
    </div>
  );
};

export default CryptoArbitrage;