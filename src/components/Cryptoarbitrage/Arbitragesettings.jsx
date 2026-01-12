import React, { useState } from 'react';
import {
  Settings,
  DollarSign,
  TrendingUp,
  Hash,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const ArbitrageSettings = ({ currentSettings, onSave, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    minProfit: currentSettings?.minProfit || 0.1,
    minVolume: currentSettings?.minVolume || 100,
    topCoins: currentSettings?.topCoins || 50,
    ...currentSettings
  });

  const handleSave = () => {
    onSave(settings);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultSettings = {
      minProfit: 0.1,
      minVolume: 100,
      topCoins: 50
    };
    setSettings(defaultSettings);
    onReset(defaultSettings);
  };

  const presetOptions = [
    {
      name: 'Conservative',
      description: 'High profit, high volume - safer but fewer opportunities',
      settings: { minProfit: 1.0, minVolume: 10000, topCoins: 20 }
    },
    {
      name: 'Balanced',
      description: 'Moderate settings - good mix of safety and opportunities',
      settings: { minProfit: 0.5, minVolume: 1000, topCoins: 50 }
    },
    {
      name: 'Aggressive',
      description: 'Low thresholds - more opportunities but riskier',
      settings: { minProfit: 0.1, minVolume: 100, topCoins: 100 }
    },
    {
      name: 'Maximum Coverage',
      description: 'Scan everything - most opportunities',
      settings: { minProfit: 0.05, minVolume: 50, topCoins: 200 }
    }
  ];

  const applyPreset = (preset) => {
    setSettings(prev => ({ ...prev, ...preset.settings }));
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
              Arbitrage Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure scanning parameters
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
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/10">
              <div className="flex items-center gap-2 mb-1 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>Min Profit</span>
              </div>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {settings.minProfit}%
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10">
              <div className="flex items-center gap-2 mb-1 text-sm text-gray-600 dark:text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span>Min Volume</span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${settings.minVolume}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
              <div className="flex items-center gap-2 mb-1 text-sm text-gray-600 dark:text-gray-400">
                <Hash className="w-4 h-4" />
                <span>Top Coins</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {settings.topCoins}
              </p>
            </div>
          </div>

          {/* Presets */}
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
              Custom Settings
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Min Profit */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minimum Profit (%)
                </label>
                <div className="relative">
                  <TrendingUp className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={settings.minProfit}
                    onChange={(e) => setSettings({ ...settings, minProfit: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 input"
                    placeholder="0.1"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Lower = more opportunities, higher risk
                </p>
              </div>

              {/* Min Volume */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minimum Volume (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={settings.minVolume}
                    onChange={(e) => setSettings({ ...settings, minVolume: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 input"
                    placeholder="100"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Higher = more liquidity, easier to execute
                </p>
              </div>

              {/* Top Coins */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Top Coins by Market Cap
                </label>
                <div className="relative">
                  <Hash className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <select
                    value={settings.topCoins}
                    onChange={(e) => setSettings({ ...settings, topCoins: parseInt(e.target.value) })}
                    className="w-full pl-10 input"
                  >
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                    <option value={50}>Top 50</option>
                    <option value={100}>Top 100</option>
                    <option value={200}>Top 200</option>
                    <option value={500}>Top 500</option>
                  </select>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  More coins = longer scan time
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 border-l-4 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>💡 Tip:</strong> Start with "Balanced" preset and adjust based on results. 
              Lower thresholds find more opportunities but may include less profitable trades.
              Scanning more coins takes longer but increases chances of finding good arbitrage.
            </p>
          </div>

          {/* Estimated Scan Time */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Estimated Scan Time
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                ~{Math.ceil(settings.topCoins * 1.2 / 60)} min
              </span>
            </div>
            <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
              <div 
                className="h-full transition-all duration-300 bg-primary-600"
                style={{ width: `${Math.min((settings.topCoins / 500) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              CoinGecko allows 50 API calls/minute. Scanning {settings.topCoins} coins ≈ {settings.topCoins} calls
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 btn-primary"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Settings</span>
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset to Default</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArbitrageSettings;