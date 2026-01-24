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
  Clock,
  AlertTriangle,
  Shield,
  Activity,
  Zap,
  Download
} from 'lucide-react';
import { 
  fetchArbitrageOpportunities,
  refreshArbitrageOpportunities,
  fetchArbitrageStatus,
  clearArbitrageMessages 
} from '../../redux/slices/arbitrageslice';

const CryptoArbitrage = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { 
    opportunities = [], 
    loading = {}, 
    error, 
    successMessage,
    metadata = {},
    stats = {},
    status = {}
  } = useSelector((state) => state.arbitrage || {});

  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'profitPercent',
    showOnlyProfitable: false,
    maxRisk: 'High'
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Check status on mount and set up status polling
  useEffect(() => {
    // Check status immediately
    dispatch(fetchArbitrageStatus());
    
    // Poll status every 10 seconds to check if data is ready
    const statusInterval = setInterval(() => {
      dispatch(fetchArbitrageStatus());
    }, 10000);
    
    return () => clearInterval(statusInterval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle success messages
  useEffect(() => {
    if (successMessage) {
      setSuccessMsg(successMessage);
      dispatch(clearArbitrageMessages());
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  }, [successMessage, dispatch]);

  // Manual load opportunities (user clicks button)
  const handleLoadOpportunities = () => {
    dispatch(fetchArbitrageOpportunities());
    setHasLoadedOnce(true);
  };

  // Manual refresh (force new data fetch)
  const handleManualRefresh = () => {
    dispatch(refreshArbitrageOpportunities());
    setSuccessMsg('Manual refresh triggered. New data will be ready in 2-5 minutes...');
  };

  // Filter and sort opportunities
  const filteredOpportunities = (opportunities || [])
    .filter(opp => {
      const matchesSearch = opp.coin?.toLowerCase().includes(filters.search.toLowerCase()) ||
                          opp.symbol?.toLowerCase().includes(filters.search.toLowerCase());
      if (!matchesSearch) return false;
      
      if (filters.showOnlyProfitable && !opp.isProfitableAfterFees) return false;
      
      const riskLevels = { 'Low': 1, 'Medium': 2, 'High': 3 };
      const maxRiskLevel = riskLevels[filters.maxRisk];
      const oppRiskLevel = riskLevels[opp.riskLevel];
      if (oppRiskLevel > maxRiskLevel) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'profitPercent') return b.profitPercent - a.profitPercent;
      if (filters.sortBy === 'netProfitPercent') return b.netProfitPercent - a.netProfitPercent;
      if (filters.sortBy === 'volume') return b.tradeableVolume - a.tradeableVolume;
      return 0;
    });

  const getRiskBadgeColor = (risk) => {
    if (risk === 'Low') return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
  };

  const getTransferBadge = (status) => {
    if (status === 'Verified') return { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: CheckCircle };
    if (status === 'Blocked') return { color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', icon: XCircle };
    return { color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300', icon: Info };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
              Crypto Arbitrage Scanner
            </h1>
            {status.isLoading ? (
              <div className="relative flex items-center">
                <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
              </div>
            ) : status.isReady ? (
              <div className="relative flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-ping"></div>
              </div>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Real-time arbitrage opportunities with background data refresh
          </p>
          {metadata.lastUpdate && (
            <div className="flex items-center gap-4 mt-2">
              <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                <Clock className="w-3 h-3" />
                Last updated: {metadata.dataAgeFormatted || 'Just now'}
              </p>
              {metadata.nextUpdate && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Next update: {new Date(metadata.nextUpdate).toLocaleTimeString()}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLoadOpportunities}
            disabled={loading.opportunities || !status.isReady}
            className="btn-secondary"
            title="Load/Reload opportunities"
          >
            <RefreshCw className={`w-4 h-4 ${loading.opportunities ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{hasLoadedOnce ? 'Reload' : 'Load'}</span>
          </button>
          <button
            onClick={handleManualRefresh}
            disabled={loading.refreshing || status.isLoading}
            className="btn-primary"
            title="Force new data fetch (takes 2-5 min)"
          >
            <Zap className={`w-4 h-4 ${loading.refreshing ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">Force Update</span>
          </button>
        </div>
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
            {status.isReady && (
              <button
                onClick={handleLoadOpportunities}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Try Again →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards - Always show */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Opportunities</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalOpportunities || status.opportunitiesCount || 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {stats.profitableAfterFees || 0} profitable after fees
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
                {(stats.avgProfitPercent || 0).toFixed(3)}%
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {(stats.avgNetProfitPercent || 0).toFixed(3)}% after fees
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Opportunity</p>
              <p className="mt-1 text-2xl font-bold text-purple-600">
                {stats.bestOpportunity ? `${stats.bestOpportunity.profitPercent.toFixed(3)}%` : 'N/A'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {stats.bestOpportunity?.symbol || '-'}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Risk Breakdown</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs font-medium text-green-600">L:{stats.riskBreakdown?.low || 0}</span>
                <span className="text-xs font-medium text-yellow-600">M:{stats.riskBreakdown?.medium || 0}</span>
                <span className="text-xs font-medium text-red-600">H:{stats.riskBreakdown?.high || 0}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Low / Medium / High
              </p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters - Always show */}
      <div className="card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search by coin or symbol..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 input"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="input"
            >
              <option value="profitPercent">Sort by Profit %</option>
              <option value="netProfitPercent">Sort by Net Profit %</option>
              <option value="volume">Sort by Volume</option>
            </select>

            <select
              value={filters.maxRisk}
              onChange={(e) => setFilters({ ...filters, maxRisk: e.target.value })}
              className="input"
            >
              <option value="High">All Risks</option>
              <option value="Medium">Low-Medium Only</option>
              <option value="Low">Low Risk Only</option>
            </select>

            <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer dark:border-gray-600">
              <input
                type="checkbox"
                checked={filters.showOnlyProfitable}
                onChange={(e) => setFilters({ ...filters, showOnlyProfitable: e.target.checked })}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Profitable Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Opportunities Table - Always show */}
      <div className="card">
        {/* Loading State */}
        {loading.opportunities ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-12 h-12 mb-4 animate-spin text-primary-600" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading arbitrage opportunities...
            </p>
          </div>
        ) : /* Initializing State - Scanner is fetching data */
        status.isLoading && !status.isReady && !hasLoadedOnce ? (
          <div className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Scanning Exchanges...
              </h3>
              <p className="max-w-md mb-4 text-gray-600 dark:text-gray-400">
                The arbitrage scanner is fetching price data from exchanges. This usually takes 2-5 minutes on first load.
              </p>
              <div className="w-full max-w-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Finding opportunities</span>
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                    {status.opportunitiesCount || 0}
                  </span>
                </div>
                {/* Dynamic progress bar based on opportunities found */}
                <div className="relative w-full h-3 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                    style={{
                      width: `${Math.min(95, Math.max(15, (status.opportunitiesCount || 0) / 1.5))}%`
                    }}
                  />
                  {/* Moving shine effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
                      style={{
                        left: '0%',
                        animation: 'moveRight 1.5s ease-in-out infinite'
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">
                    Scanning markets...
                  </p>
                  <p className="text-xs text-blue-500 font-medium">
                    {Math.min(95, Math.max(15, Math.round((status.opportunitiesCount || 0) / 1.5)))}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : /* Ready to Load State */
        status.isReady && !hasLoadedOnce ? (
          <div className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-900/30">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                {status.opportunitiesCount || 0} Opportunities Ready!
              </h3>
              <p className="max-w-md mb-4 text-gray-600 dark:text-gray-400">
                Background scanning complete. Click below to load and view all arbitrage opportunities.
              </p>
              <button
                onClick={handleLoadOpportunities}
                disabled={loading.opportunities}
                className="btn-primary"
              >
                <Download className={`w-5 h-5 ${loading.opportunities ? 'animate-bounce' : ''}`} />
                <span>Load Opportunities</span>
              </button>
              {status.lastUpdate && (
                <p className="mt-3 text-xs text-gray-500">
                  Data updated: {new Date(status.lastUpdate).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ) : /* Waiting for Scanner State */
        !status.isReady && !status.isLoading && !hasLoadedOnce ? (
          <div className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800">
                <Activity className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Connecting to Scanner...
              </h3>
              <p className="max-w-md mb-4 text-gray-600 dark:text-gray-400">
                Checking arbitrage scanner status. Please wait a moment...
              </p>
              <button
                onClick={() => dispatch(fetchArbitrageStatus())}
                className="btn-secondary"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Check Status</span>
              </button>
            </div>
          </div>
        ) : /* No Data After Loading */
        hasLoadedOnce && filteredOpportunities.length === 0 ? (
          <div className="py-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No Opportunities Found
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              {opportunities.length === 0
                ? "No arbitrage opportunities available at the moment."
                : "Try adjusting your filters to see more opportunities."}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleLoadOpportunities}
                disabled={loading.opportunities}
                className="btn-secondary"
              >
                <RefreshCw className={`w-4 h-4 ${loading.opportunities ? 'animate-spin' : ''}`} />
                <span>Reload</span>
              </button>
              <button
                onClick={handleManualRefresh}
                disabled={loading.refreshing || status.isLoading}
                className="btn-primary"
              >
                <Zap className="w-4 h-4" />
                <span>Force Update</span>
              </button>
            </div>
          </div>
        ) : /* Data Table */ (
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
                      Prices
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
                      Profit
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400">
                      Volume
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400">
                      Risk
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
                  {filteredOpportunities.map((opp, index) => {
                    const transferBadge = getTransferBadge(opp.transferStatus);
                    const TransferIcon = transferBadge.icon;
                    
                    return (
                      <tr 
                        key={`${opp.symbol}-${opp.buyExchange}-${opp.sellExchange}`}
                        className={`hover:bg-gray-50 dark:hover:bg-brandDark-800 transition-colors ${
                          index === 0 && opp.isProfitableAfterFees ? 'bg-green-50 dark:bg-green-900/10' : ''
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
                                {opp.symbol}
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

                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            {/* Buy Price & Ask Depth */}
                            <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-blue-600 dark:text-blue-400">Buy:</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  ${opp.buyPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                </span>
                              </div>
                              {opp.buyOrderBook?.[0] && (
                                <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                                  <span>Available:</span>
                                  <span className="font-mono">{opp.buyOrderBook[0][1]?.toFixed(4)} {opp.coin}</span>
                                </div>
                              )}
                            </div>
                            {/* Sell Price & Bid Depth */}
                            <div className="p-2 rounded bg-green-50 dark:bg-green-900/20">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-green-600 dark:text-green-400">Sell:</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  ${opp.sellPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                </span>
                              </div>
                              {opp.sellOrderBook?.[0] && (
                                <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                                  <span>Available:</span>
                                  <span className="font-mono">{opp.sellOrderBook[0][1]?.toFixed(4)} {opp.coin}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 text-sm font-semibold rounded ${
                              opp.isProfitableAfterFees 
                                ? 'text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300'
                                : 'text-gray-700 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {opp.profitPercent?.toFixed(4)}%
                            </div>
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              After fees: {opp.netProfitPercent > 0 ? '+' : ''}{opp.netProfitPercent?.toFixed(4)}%
                            </div>
                            <div className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                              ${opp.profitPerCoin?.toFixed(6)} per coin
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {opp.tradeableVolume?.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {opp.coin}
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Max: ${opp.maxProfitDollar?.toFixed(2)}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskBadgeColor(opp.riskLevel)}`}>
                            {opp.riskLevel}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${transferBadge.color}`}>
                            <TransferIcon className="w-3 h-3" />
                            {opp.transferStatus}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => setSelectedOpportunity(opp)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
                          >
                            Details
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl dark:bg-brandDark-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedOpportunity.symbol} Arbitrage Details
              </h3>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Buy on</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedOpportunity.buyExchange}</p>
                  <p className="text-sm text-gray-600">${selectedOpportunity.buyPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sell on</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedOpportunity.sellExchange}</p>
                  <p className="text-sm text-gray-600">${selectedOpportunity.sellPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Profit Analysis</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Profit per coin:</span>
                    <span className="font-medium">${selectedOpportunity.profitPerCoin.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Profit percentage:</span>
                    <span className="font-medium text-green-600">{selectedOpportunity.profitPercent.toFixed(4)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">After fees (~0.4%):</span>
                    <span className={`font-medium ${selectedOpportunity.isProfitableAfterFees ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedOpportunity.netProfitPercent.toFixed(4)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Max profit (with volume):</span>
                    <span className="font-medium">${selectedOpportunity.maxProfitDollar.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Tradeable Volume</p>
                  <p className="text-lg font-bold text-blue-600">{selectedOpportunity.tradeableVolume.toFixed(4)} {selectedOpportunity.coin}</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Risk Level</p>
                  <p className={`text-lg font-bold ${
                    selectedOpportunity.riskLevel === 'Low' ? 'text-green-600' :
                    selectedOpportunity.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{selectedOpportunity.riskLevel}</p>
                </div>
              </div>

              <div className="p-3 border-l-4 border-blue-500 rounded bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm text-blue-700 dark:text-blue-300">{selectedOpportunity.fees.note}</p>
              </div>

              {/* Order Book Depth */}
              <div className="grid grid-cols-2 gap-4">
                {/* Buy Side Order Book */}
                <div className="p-4 border border-blue-200 rounded-lg dark:border-blue-800">
                  <p className="mb-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                    Buy Order Book ({selectedOpportunity.buyExchange})
                  </p>
                  <div className="space-y-1">
                    {selectedOpportunity.buyOrderBook?.slice(0, 3).map((order, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          ${order[0]?.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                        </span>
                        <span className="font-mono text-blue-600 dark:text-blue-400">
                          {order[1]?.toFixed(4)} {selectedOpportunity.coin}
                        </span>
                      </div>
                    )) || <p className="text-xs text-gray-500">No order book data</p>}
                  </div>
                </div>

                {/* Sell Side Order Book */}
                <div className="p-4 border border-green-200 rounded-lg dark:border-green-800">
                  <p className="mb-2 text-sm font-medium text-green-700 dark:text-green-300">
                    Sell Order Book ({selectedOpportunity.sellExchange})
                  </p>
                  <div className="space-y-1">
                    {selectedOpportunity.sellOrderBook?.slice(0, 3).map((order, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          ${order[0]?.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                        </span>
                        <span className="font-mono text-green-600 dark:text-green-400">
                          {order[1]?.toFixed(4)} {selectedOpportunity.coin}
                        </span>
                      </div>
                    )) || <p className="text-xs text-gray-500">No order book data</p>}
                  </div>
                </div>
              </div>

              {/* Transfer Status */}
              <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Transfer Status</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${
                    selectedOpportunity.buyTransferable === true
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : selectedOpportunity.buyTransferable === false
                        ? 'bg-red-50 dark:bg-red-900/20'
                        : 'bg-gray-50 dark:bg-gray-800'
                  }`}>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Buy Exchange</p>
                    <p className={`font-medium ${
                      selectedOpportunity.buyTransferable === true
                        ? 'text-green-600'
                        : selectedOpportunity.buyTransferable === false
                          ? 'text-red-600'
                          : 'text-gray-500'
                    }`}>
                      {selectedOpportunity.buyTransferable === true ? '✓ Transfers Enabled' :
                       selectedOpportunity.buyTransferable === false ? '✗ Transfers Blocked' :
                       '? Unknown Status'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    selectedOpportunity.sellTransferable === true
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : selectedOpportunity.sellTransferable === false
                        ? 'bg-red-50 dark:bg-red-900/20'
                        : 'bg-gray-50 dark:bg-gray-800'
                  }`}>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Sell Exchange</p>
                    <p className={`font-medium ${
                      selectedOpportunity.sellTransferable === true
                        ? 'text-green-600'
                        : selectedOpportunity.sellTransferable === false
                          ? 'text-red-600'
                          : 'text-gray-500'
                    }`}>
                      {selectedOpportunity.sellTransferable === true ? '✓ Transfers Enabled' :
                       selectedOpportunity.sellTransferable === false ? '✗ Transfers Blocked' :
                       '? Unknown Status'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOpportunity(null)}
              className="w-full mt-6 btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoArbitrage;