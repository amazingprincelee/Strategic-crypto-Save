import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  TrendingUp, 
  Clock, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Star,
  Users
} from 'lucide-react';
import { useAppSelector } from '../store/hooks';

const Home = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure & Decentralized',
      description: 'Your funds are secured by smart contracts on the Ethereum blockchain. No central authority controls your money.',
    },
    {
      icon: Clock,
      title: 'Time-Locked Savings',
      description: 'Create savings vaults with custom lock periods to prevent impulsive spending and build long-term wealth.',
    },
    {
  icon: Users,
  title: 'P2P',
  description: 'Trade crypto directly with other users in a secure and transparent peer-to-peer marketplace.',
},
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Access your funds immediately when the lock period expires. No waiting, no paperwork, no intermediaries.',
    },
  ];

  const benefits = [
    'No minimum deposit requirements',
    'Transparent smart contract code',
    'Low transaction fees',
    'Global accessibility 24/7',
    'Self-custody of your funds',
    'Automated savings goals',
  ];

  const stats = [
    { label: 'Total Value Locked', value: '$2.5M+' },
    { label: 'Active Users', value: '1,200+' },
    { label: 'Vaults Created', value: '5,000+' },
    { label: 'Avg Lock Period', value: '6 months' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 text-white bg-gradient-to-br from-brandDark-600 via-brandDark-700 to-brandDark-800 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container relative px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl sm:mb-6">
              Build Wealth with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                Strategic Crypto Savings
              </span>
            </h1>
            <p className="px-4 mb-6 text-lg leading-relaxed text-gray-100 sm:text-xl lg:text-2xl sm:mb-8 sm:px-0">
              Create time-locked savings vaults, build disciplined saving habits, and achieve your financial goals with the power of decentralized finance.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
              <button
                onClick={handleGetStarted}
                className="btn-primary btn-lg"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="/login"
                className="btn-outline btn-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white sm:py-16 dark:bg-brandDark-900">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-1 text-2xl font-bold sm:text-3xl lg:text-4xl text-primary-500 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-brandDark-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-brandDark-800">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl text-brandDark-700 dark:text-white">
              Why Choose Strategic Crypto Save?
            </h2>
            <p className="max-w-3xl px-4 mx-auto text-lg sm:text-xl text-brandDark-600 dark:text-gray-400 sm:px-0">
              Experience the future of savings with our innovative DeFi platform designed for long-term wealth building.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center transition-shadow duration-300 card hover:shadow-xl">
                  <div className="flex items-center justify-center mx-auto mb-4 rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-gradient-primary">
                    <Icon className="text-white w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white sm:py-20 dark:bg-brandDark-900">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 sm:gap-12">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white sm:mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="mb-6 text-lg text-gray-600 sm:text-xl dark:text-gray-400 sm:mb-8">
                Our platform provides all the tools and features you need to build a successful crypto savings strategy.
              </p>
              <div className="grid gap-3 sm:gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 sm:w-6 sm:h-6" />
                    <span className="text-sm text-gray-700 sm:text-base dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="p-6 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-2xl sm:p-8">
                <div className="text-center">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full sm:w-24 sm:h-24 bg-gradient-primary sm:mb-6">
                    <TrendingUp className="w-10 h-10 text-white sm:w-12 sm:h-12" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white sm:mb-4">
                    Start Your Journey Today
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 sm:text-base dark:text-gray-400 sm:mb-6">
                    Join thousands of users who are already building wealth with Strategic Crypto Save.
                  </p>
                  <button
                     onClick={handleGetStarted}
                     className="w-full btn-primary"
                   >
                     Create Your First Vault
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-brandDark-800">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real stories from real users who have transformed their financial future.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: 'Sarah Chen',
                role: 'Software Engineer',
                content: 'Strategic Crypto Save helped me save for my house down payment. The time-lock feature prevented me from spending impulsively.',
                rating: 5,
              },
              {
                name: 'Michael Rodriguez',
                role: 'Entrepreneur',
                content: 'The time-locked vaults helped me build better saving habits and resist impulsive spending. Perfect for long-term goals.',
                rating: 5,
              },
              {
                name: 'Emily Johnson',
                role: 'Designer',
                content: 'Finally, a savings platform that gives me full control over my money while helping me build discipline.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="mb-6 italic text-gray-600 dark:text-gray-400">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-gradient-primary">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold">
            Ready to Start Building Wealth?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl">
            Join the DeFi revolution and take control of your financial future with Strategic Crypto Save.
          </p>
          <button
            onClick={handleGetStarted}
            className="transition-all duration-200 transform bg-white shadow-lg btn-primary btn-lg text-primary-600 hover:bg-gray-100 hover:shadow-xl hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default Home;