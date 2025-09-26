import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  ArrowLeft, 
  Info, 
  Calendar, 
  DollarSign, 
  Lock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useWallet } from '../contexts/WalletContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const schema = yup.object({
  name: yup
    .string()
    .required('Vault name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(0.001, 'Minimum amount is 0.001 ETH'),
  lockPeriod: yup
    .string()
    .required('Lock period is required'),
  description: yup
    .string()
    .max(200, 'Description must be less than 200 characters'),
});

const CreateVault = () => {
  const navigate = useNavigate();
  const { address, formattedBalance } = useWallet();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isCreating, setIsCreating] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      amount: '',
      lockPeriod: '',
      description: '',
    },
  });

  const watchedAmount = watch('amount');
  const watchedLockPeriod = watch('lockPeriod');

  // Lock period options for disciplined savings
  const lockPeriods = [
    { value: '30', label: '1 Month', description: 'Short-term savings goal', days: 30 },
    { value: '90', label: '3 Months', description: 'Build saving habits', days: 90 },
    { value: '180', label: '6 Months', description: 'Medium-term planning', days: 180 },
    { value: '365', label: '1 Year', description: 'Long-term commitment', days: 365 },
    { value: '730', label: '2 Years', description: 'Maximum discipline', days: 730 },
  ];

  const selectedPeriod = lockPeriods.find(p => p.value === watchedLockPeriod);

  // Estimate gas fees (mock implementation)
  const estimateGas = async () => {
    // In a real implementation, this would call the smart contract
    // to estimate gas fees for the vault creation
    setEstimatedGas('0.0025'); // Mock gas fee
  };

  React.useEffect(() => {
    if (watchedAmount && watchedLockPeriod) {
      estimateGas();
    }
  }, [watchedAmount, watchedLockPeriod]);

  const onSubmit = async (data, event) => {
    if (event) {
      event.preventDefault();
    }
    
    try {
      setIsCreating(true);
      
      // Check if user is authenticated before proceeding
      if (!isAuthenticated) {
        toast.error('Please log in to create a vault.');
        navigate('/login');
        return;
      }
      
      // Mock vault creation - replace with actual smart contract interaction
      console.log('Creating vault with data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Vault created successfully!');
      
      // Navigate to dashboard only if still authenticated
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error creating vault:', error);
      toast.error('Failed to create vault. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Vault
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set up a new savings vault with custom lock period and goals.
          </p>
        </div>
      </div>

      {/* Wallet Balance Info */}
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Available Balance
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formattedBalance} ETH
            </p>
          </div>
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>

      {/* Create Vault Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Vault Details
          </h2>
          
          <div className="space-y-6">
            {/* Vault Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vault Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="input-field"
                placeholder="e.g., Emergency Fund, Vacation Savings"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                {...register('amount')}
                className="input-field"
                placeholder="0.0"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Lock Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lock Period
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lockPeriods.map((period) => (
                  <label
                    key={period.value}
                    className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      watchedLockPeriod === period.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
                    }`}
                  >
                    <input
                      type="radio"
                      value={period.value}
                      {...register('lockPeriod')}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {period.label}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {period.days} days
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {period.description}
                    </span>
                  </label>
                ))}
              </div>
              {errors.lockPeriod && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.lockPeriod.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field"
                placeholder="Add a description for your savings goal..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>



        {/* Gas Estimation */}
        {estimatedGas && (
          <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Transaction Fee
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Estimated gas fee: <span className="font-semibold">{estimatedGas} ETH</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Important Notice
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Once created, your funds will be locked for the selected period. 
                Early withdrawal may result in penalties. Please ensure you won't need 
                these funds before the unlock date.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="btn-primary flex-1"
          >
            {isCreating ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Creating Vault...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Create Vault</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVault;