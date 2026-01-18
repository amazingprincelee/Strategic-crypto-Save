import React, { useState } from 'react';
import {
  Settings,
  DollarSign,
  TrendingUp,
  Filter,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

const ArbitrageSettings = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    minProfitPercent: 0.001,
    minVolume: 0.0001,
    showOnlyProfitable: false,
    maxRisk: 'High',
    requireTransferable: false
  });

  const handleApply = () => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultFilters = {
      minProfitPercent: 0.001,
      minVolume: 0.0001,
      showOnlyProfitable: false,
      maxRisk: 'High',
      requireTransferable: false
    };
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  const presetOptions = [
    {
      name: 'Show All',
      description: 'Display every opportunity - complete market view',
      settings: { 
        minProfitPercent: 0.001, 
        minVolume: 0.0001, 
        showOnlyProfitable: false,
        maxRisk: 'High',
        requireTransferable: false
      }
    },
    {
      name: 'Profitable Only',
      description: 'Only opportunities profitable after fees',
      settings: { 
        minProfitPercent: 0.001, 
        minVolume: 0.0001, 
        showOnlyProfitable: true,
        maxRisk: 'High',
        requireTransferable: false
      }
    },
    {
      name: 'Low Risk',
      description: 'Conservative - high profit, low risk, verified transfers',
      settings: { 
        minProfitPercent: 0.5, 
        minVolume: 0.01, 
        showOnlyProfitable: true,
        maxRisk: 'Low',
        requireTransferable: true
      }
    },
    {
      name: 'High Profit',
      description: 'Focus on highest profit margins (>1%)',
      settings: { 
        minProfitPercent: 1.0, 
        minVolume: 0.001, 
        showOnlyProfitable: true,
        maxRisk: 'Medium',
        requireTransferable: false
      }
    }
  ];

  const applyPreset = (preset) => {
    setFilters(preset.settings);
  };

  return (
    <div className="card">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/20">
            <Settings className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter & Display Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize which opportunities to display
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {/* Settings Panel */}
      {isOpen && (
        <div className="mt-6 space-y-6">
          {/* Current Settings Summary */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/10">
              <div className="flex items-center gap-2 mb-1 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>Min Profit</span>
              </div>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {filters.minProfitPercent}%
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10">
              <div className="flex items-center gap-2 mb-1 text-sm text-gray-600 dark:text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span>Min Volume</span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {filters.minVolume}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
              <div className="flex items-center gap-2 mb-1 text-sm text-gray-600 dark:text-gray-400">
                <Filter className="w-4 h-4" />
                <span>Max Risk</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filters.maxRisk}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10">
              <div className="flex items-center gap-2 mb-1 text-sm text-gray-600 dark:text-gray-400">
                <Info className="w-4 h-4" />
                <span>Filters</span>
              </div>
              <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {filters.showOnlyProfitable ? 'Profitable Only' : 'Show All'}
              </p>
              <p className="text-xs text-purple-500">
                {filters.requireTransferable ? 'Verified Only' : 'All Exchanges'}
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Quick Presets
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {presetOptions.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-3 text-left transition-all border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 dark:border-gray-700"
                >
                  <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {preset.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Settings */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Filters
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Min Profit */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minimum Profit (%)
                </label>
                <div className="relative">
                  <TrendingUp className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    max="10"
                    value={filters.minProfitPercent}
                    onChange={(e) => setFilters({ ...filters, minProfitPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 input"
                    placeholder="0.001"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Lower = more opportunities
                </p>
              </div>

              {/* Min Volume */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minimum Volume (coins)
                </label>
                <div className="relative">
                  <DollarSign className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={filters.minVolume}
                    onChange={(e) => setFilters({ ...filters, minVolume: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 input"
                    placeholder="0.0001"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Higher = more liquidity
                </p>
              </div>

              {/* Max Risk */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maximum Risk Level
                </label>
                <div className="relative">
                  <Filter className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <select
                    value={filters.maxRisk}
                    onChange={(e) => setFilters({ ...filters, maxRisk: e.target.value })}
                    className="w-full pl-10 input"
                  >
                    <option value="High">All Risks (Low, Medium, High)</option>
                    <option value="Medium">Low & Medium Only</option>
                    <option value="Low">Low Risk Only</option>
                  </select>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Lower risk = fewer opportunities
                </p>
              </div>
            </div>
          </div>

          {/* Toggle Filters */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Additional Filters
            </h4>
            
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={filters.showOnlyProfitable}
                onChange={(e) => setFilters({ ...filters, showOnlyProfitable: e.target.checked })}
                className="w-5 h-5 text-primary-600"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  Show Only Profitable After Fees
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hide opportunities that won't be profitable after estimated fees (~0.4%)
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={filters.requireTransferable}
                onChange={(e) => setFilters({ ...filters, requireTransferable: e.target.checked })}
                className="w-5 h-5 text-primary-600"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  Require Verified Transfers
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Only show opportunities where both exchanges allow deposits/withdrawals
                </p>
              </div>
            </label>
          </div>

          {/* Info Box */}
          <div className="p-4 border-l-4 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>💡 How it works:</strong> The backend scans exchanges every 5 minutes in the background. 
              These filters only affect what you see in the table - they don't change the backend scanning.
              Data updates automatically, no manual refresh needed!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleApply}
              className="flex-1 btn-primary"
            >
              <Save className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArbitrageSettings;